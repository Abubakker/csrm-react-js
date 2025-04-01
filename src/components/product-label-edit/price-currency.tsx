import React, { useEffect, memo, useState } from 'react';
import { Select, InputNumber } from 'antd';
import { currencyItems, CURRENCY_ENUM, currencyMap } from 'types/pms';
import styles from './index.module.scss';
interface Props {
  onChange?: (data: any) => void;
  value?: any;
  shopId?: string /** 1-银座 2-香港 3-> 新加坡 同时对应货币 */;
}

const PriceCurrency = ({ onChange, value, shopId = '1' }: Props) => {
  const [price, setPrice] = useState<number>(1);
  const [currency, setCurrency] = useState<CURRENCY_ENUM>(CURRENCY_ENUM.JPY);

  useEffect(() => {
    if (!value || Object.keys(value).length === 0) return;
    const { price } = value;
    setCurrency(currencyMap[shopId]);
    setPrice(price);
  }, [value, shopId]);

  // form 返回出去
  useEffect(() => {
    if (onChange) onChange({ price, currency });
  }, [price, currency]);

  return (
    <div className={styles.PirceCurrency}>
      <InputNumber
        value={price}
        style={{ width: '100%' }}
        onChange={(e) => setPrice(e as number)}
        addonAfter={
          <Select
            style={{ width: 77 }}
            value={currency}
            onChange={(e) => setCurrency(e as CURRENCY_ENUM)}
            disabled
            showArrow={false}
          >
            {currencyItems.map((d) => (
              <Select.Option key={d.label} value={d.label}>
                {d.label}
              </Select.Option>
            ))}
          </Select>
        }
      />
      <div className={styles.tip}>
        {`${shopId}` === '1' && '请填写税入价格'}
        {`${shopId}` === '3' && '请填写免税价格'}
      </div>
    </div>
  );
};

export default memo(PriceCurrency);
