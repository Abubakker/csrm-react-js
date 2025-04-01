import { Select } from 'antd';
import { getAllTimezones } from 'countries-and-timezones';

interface TimezoneSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

const TimezoneSelect = ({ value, onChange }: TimezoneSelectProps) => {
  const timeZoneList = Object.values(getAllTimezones());

  const timeZoneValue = (timeZone: { name: string; utcOffset: number }) => {
    return `${timeZone.name} (UTC${timeZone.utcOffset > 0 ? '+' : ''}${
      timeZone.utcOffset / 60 === 0 ? '' : timeZone.utcOffset / 60
    })`;
  };

  return (
    <Select value={value} onChange={onChange}>
      {timeZoneList?.map((timeZone: any) => (
        <Select.Option key={timeZone.name} value={timeZoneValue(timeZone)}>
          {timeZoneValue(timeZone)}
        </Select.Option>
      ))}
    </Select>
  );
};

export default TimezoneSelect;
