import { Select } from "antd";
import { CountryType } from "./Profile";
import { useTranslation } from "react-i18next";

// extract country select component form profile component

type CountrySelectProps = {
  countries: CountryType[];
  selectedCountry: string | null;
  onCountryChange: (value: string) => void;
};

const CountrySelect = ({
  countries,
  selectedCountry,
  onCountryChange,
}: CountrySelectProps) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4 custom-select">
      <label className="uppercase text-[10px] font-medium tracking-[1px]">
        {t("country")}
      </label>
      <Select
        value={selectedCountry}
        onChange={onCountryChange}
        options={countries.map((c) => ({
          value: c.name,
          label: c.name,
        }))}
        className="w-full mt-1 min-h-10 rounded-xl"
        placeholder={t("select_country")}
      />
    </div>
  );
};

export default CountrySelect;
