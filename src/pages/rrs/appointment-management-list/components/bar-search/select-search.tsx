import { useState, useEffect } from 'react';
import { Input, Select, Space } from 'antd';
import i18n from '../../../../../i18n';
import LOCALS from '../../../../../commons/locals';

export interface DataProps {
  value?: string;
  field: string;
  valueType: string;
}

interface Props {
  onChange?: (data: DataProps) => void;
  value?: DataProps;
}

const SelectSearchOption = [
  {
    value: 'username',
    label: i18n.t(LOCALS.name),
    key: 1,
    type: 'string',
  },
  {
    value: 'phone',
    label: i18n.t(LOCALS.phone_number),
    key: 2,
    type: 'string',
  },
  {
    value: 'email',
    label: i18n.t(LOCALS.email),
    key: 3,
    type: 'number',
  },
];

const SelectSearch = ({ onChange, value }: Props) => {
  const [selected, setSelected] = useState('username');
  const [inputValue, setInputValue] = useState<string>();
  const [valueType, setValueType] = useState('String');

  useEffect(() => {
    setInputValue('');
  }, [selected]);

  useEffect(() => {
    if (onChange)
      onChange({
        value: inputValue,
        field: selected,
        valueType,
      });
  }, [inputValue, valueType, selected]);

  return (
    <div className={'SelectSearch'}>
      <Space.Compact block>
        <Select
          value={selected}
          options={SelectSearchOption}
          style={{ width: 120 }}
          onChange={(e, ee: any) => {
            setSelected(e);
            setValueType(ee.type);
          }}
        />
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ width: '100%' }}
        />
      </Space.Compact>
    </div>
  );
};

export default SelectSearch;
