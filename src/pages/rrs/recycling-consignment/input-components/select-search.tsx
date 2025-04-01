import { Input, Select, Space } from 'antd';
import { SelectSearchOption } from 'constants/RecyclingConsignment';

export interface DataProps {
  value: string;
  field: string;
  valueType: string;
}

interface Props {
  onChange?: (data: DataProps) => void;
  value?: DataProps;
}

const SelectSearch = ({ onChange, value }: Props) => {
  return (
    <div className={'SelectSearch'}>
      <Space.Compact block>
        <Select
          value={value?.field}
          options={SelectSearchOption}
          style={{ width: 230 }}
          onChange={(e, ee: any) => {
            onChange &&
              onChange({
                value: '',
                valueType: ee.type,
                field: e,
              });
          }}
        />
        <Input
          value={value?.value}
          onChange={(e) => {
            if (!value) {
              return;
            }
            onChange &&
              onChange({
                ...value,
                value: e.target.value,
              });
          }}
          style={{ width: '100%' }}
        />
      </Space.Compact>
    </div>
  );
};

export default SelectSearch;
