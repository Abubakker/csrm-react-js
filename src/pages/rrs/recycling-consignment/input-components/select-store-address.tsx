import { useMemo } from 'react';
import styles from './index.module.scss';
import { Radio } from 'antd';
import { storeAddressList } from 'constants/RecyclingConsignment';

interface Props {
  onChange?: (data: string[] | string) => void;
  value?: number;
}

const SelectStoreAddress = ({ onChange, value = 1 }: Props) => {
  const store = useMemo(() => {
    return value;
  }, [value]);

  const Desc = useMemo(() => {
    if (store) {
      return (
        <div className={styles.address}>
          <div>收件人：{storeAddressList[store - 1].name}</div>
          <div>收件地址：{storeAddressList[store - 1].address}</div>
          <div>联系方式：{storeAddressList[store - 1].phone}</div>
        </div>
      );
    }
  }, [store]);

  return (
    <div className={styles.SelectStoreAddress}>
      <Radio.Group
        options={storeAddressList}
        optionType="button"
        buttonStyle="solid"
        value={store}
        onChange={(e) => {
          const val = e.target.value;
          // setStore(val);
          if (onChange) onChange(val);
        }}
      />
      {Desc}
    </div>
  );
};
export default SelectStoreAddress;
