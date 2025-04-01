import { Select } from 'antd';
import { OrderGenerateForMemberDto } from 'types/oms';
import { ORDER_CREATED_FROM_OPTION_LIST, SHOP_MAP } from 'commons/options';
import i18n from '../../../i18n';

type Props = {
  setPayload: (
    data: Partial<Pick<OrderGenerateForMemberDto, 'createdFrom'>>
  ) => void;
} & Pick<OrderGenerateForMemberDto, 'createdFrom'>;

const CreatedSelect = ({ setPayload, createdFrom }: Props) => {
  return (
    <Select
      value={createdFrom}
      size="large"
      placeholder={i18n.t('enter_order_source')}
      onChange={(e) => {
        setPayload({ createdFrom: e });
      }}
      listHeight={300}
    >
      {ORDER_CREATED_FROM_OPTION_LIST.filter(
        (d) =>
          ![
            SHOP_MAP.GINZA,
            SHOP_MAP.HONGKONG,
            SHOP_MAP.SINGAPORE,
            SHOP_MAP.SNS,
          ].includes(d.value)
      ).map((d) => (
        <Select.Option value={d.value} key={d.value}>
          {d.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default CreatedSelect;
