import { useCallback, useMemo } from 'react';
import { Radio } from 'antd';
import styles from './index.module.scss';
import { UmsMemberReceiveAddressV1 } from 'types/ums';
import classNames from 'classnames';
import i18n from 'i18n';

export const Options = [
  { label: i18n.t('select_address'), value: 1 },
  { label: i18n.t('enter_address_manually'), value: 2 },
];

interface valueType {
  selectedType?: number;
  addressId?: number;
}

interface Props {
  addressList?: UmsMemberReceiveAddressV1[];
  onChange?: (data: valueType) => void;
  value?: valueType;
}

const AddressSelect = ({ addressList, value, onChange }: Props) => {
  const selectedType = useMemo(() => {
    return value?.selectedType;
  }, [value?.selectedType]);

  const addressId = useMemo(() => {
    return value?.addressId;
  }, [value?.addressId]);

  const triggerChange = useCallback(
    (changedValue: valueType) => {
      const t = {
        ...value,
        ...changedValue,
      };
      onChange?.(t);
    },
    [onChange, value]
  );

  return (
    <div className={styles.AddressSelect}>
      <div className={styles.selected}>
        <Radio.Group
          options={Options}
          value={selectedType}
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => {
            triggerChange({ selectedType: e.target.value, addressId: 0 });
          }}
        />
      </div>
      {selectedType === 1 && (
        <Radio.Group
          value={addressId}
          onChange={(e) => {
            triggerChange({ addressId: e.target.value });
          }}
          className="w-full"
        >
          {addressList?.length &&
            addressList.map((d) => (
              <div
                key={d.id}
                className={classNames('bg-[#F9F9F9] py-2 px-4 mt-2', {
                  'bg-[#FFF6EA]': d.id === addressId,
                })}
              >
                <Radio value={d.id}>
                  {d.name} | {d.phoneNumber} | {d.province}
                  {d.detailAddress}
                </Radio>
              </div>
            ))}
        </Radio.Group>
      )}
    </div>
  );
};

export default AddressSelect;
