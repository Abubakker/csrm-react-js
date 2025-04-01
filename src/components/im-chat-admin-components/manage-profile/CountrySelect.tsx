import { Select } from 'antd';
import { getAllCountries } from 'countries-and-timezones';

interface CountrySelectProps {
  value?: string;
  onChange: (value: string) => void;
}

const CountrySelect = ({ value, onChange }: CountrySelectProps) => {
  const countryList = Object.values(getAllCountries());

  return (
    <Select value={value} onChange={onChange}>
      {countryList?.map((country: any) => (
        <Select.Option key={country.id} value={country.name}>
          {country.name}
        </Select.Option>
      ))}
    </Select>
  );
};
export default CountrySelect;
