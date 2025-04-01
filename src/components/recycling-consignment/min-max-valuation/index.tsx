import { useState, useEffect } from 'react';
import { InputNumber } from 'antd';
import styles from './index.module.scss';

interface Props {
  onChange?: (data?: [number?, number?]) => void;
  currency?: string;
  value?: [number?, number?];
}

const MinMaxValuation = ({ onChange, currency = 'JPY', value }: Props) => {
  const [minValue, setMinValue] = useState<number>();
  const [maxValue, setMaxValue] = useState<number>();

  useEffect(() => {
    if (value && value.length === 2) {
      setMinValue(value[0]);
      setMaxValue(value[1]);
    }
  }, [value]);

  useEffect(() => {
    if (onChange) {
      if (minValue || maxValue) {
        onChange([minValue, maxValue]);
      } else {
        onChange();
      }
    }
  }, [minValue, maxValue]);

  return (
    <div className={styles.MinMaxValuation}>
      <InputNumber
        max={1000000000}
        addonBefore={currency}
        value={minValue}
        onChange={(e) => setMinValue(e as number)}
        style={{ width: '45%' }}
        min={1}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
      />
      ~
      <InputNumber
        max={1000000000}
        addonBefore={currency}
        value={maxValue}
        onChange={(e) => setMaxValue(e as number)}
        style={{ width: '45%' }}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
        min={1}
      />
    </div>
  );
};

export default MinMaxValuation;
