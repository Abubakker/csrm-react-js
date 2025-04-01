import { Select, Tooltip } from "antd";
import { TimezoneType } from "./Profile";
import { useTranslation } from "react-i18next";

// extract timezone select component form profile component

type TimezoneSelectProps = {
  timezones: TimezoneType[];
  selectedTimezone: string | null;
  selectedCountry: string | null;
  onTimezoneChange: (value: string) => void;
};

const TimezoneSelect = ({
  timezones,
  selectedTimezone,
  selectedCountry,
  onTimezoneChange,
}: TimezoneSelectProps) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4 custom-select">
      <label className="uppercase text-[10px] font-medium tracking-[1px]">
        {t("timezone")}
      </label>
      <Tooltip title={!selectedCountry ? t("select_country_first") : undefined}>
        <Select
          value={selectedTimezone}
          onChange={onTimezoneChange}
          disabled={!selectedCountry}
          options={timezones.map((tz) => ({
            value: tz.name,
            label: `${tz.name} (UTC${tz.utcOffset >= 0 ? "+" : ""}${
              tz.utcOffset / 60
            })`,
          }))}
          className="w-full mt-1 h-10 rounded-[10px]"
          placeholder={t("select_timezone")}
        />
      </Tooltip>
    </div>
  );
};

export default TimezoneSelect;
