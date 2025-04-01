import { useCallback, useMemo } from 'react';
import { Select, InputNumber } from 'antd';
import { FmsAccountManagement } from 'types/fms';
import styles from './index.module.scss';
import classNames from 'classnames';

interface CollectionInputType {
  payAmount: number | null;
  payType: string;
}

interface Props {
  accountList: FmsAccountManagement[];
  onChange?: (data: Partial<CollectionInputType>) => void;
  value?: CollectionInputType;
  onBlur?: () => void;
  max?: number;
}

const PaymentInput = ({ onChange, value, onBlur, max, accountList }: Props) => {
  const triggerChange = useCallback(
    (changedValue: Partial<CollectionInputType>) => {
      const val = {
        ...value,
        ...changedValue,
      };
      onChange?.(val);
    },
    [value, onChange]
  );

  // 收款类型
  const CollectionTypeSelectEle = useMemo(() => {
    return (
      <Select
        value={value?.payType}
        className={classNames(styles.marginZero, 'w-56')}
        options={accountList.map((i) => {
          return {
            value: i.accountCode,
            label: i.accountName,
          };
        })}
        onChange={(accountCode) => {
          triggerChange({
            payType: accountCode,
          });
        }}
      />
    );
  }, [value?.payType, accountList, triggerChange]);

  return (
    <InputNumber
      className="w-full"
      addonBefore={CollectionTypeSelectEle}
      value={value?.payAmount}
      onChange={(e) => {
        triggerChange({ payAmount: e });
      }}
      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      placeholder=""
      onBlur={() => onBlur?.()}
      max={max}
    />
  );
};

export default PaymentInput;
