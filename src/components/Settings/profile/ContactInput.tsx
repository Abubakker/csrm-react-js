import { Input } from "antd";
import { useTranslation } from "react-i18next";

// extract contact input component form profile component

interface ContactInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ContactInput = ({ value, onChange }: ContactInputProps) => {
  const { t } = useTranslation();

  return (
    <div className="my-4">
      <label className="uppercase text-[10px] font-medium tracking-[1px]">
        {t("contact_number")}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("enter_contact") || "Contact"}
        className="mt-1 rounded-[10px] h-[42px] font-medium tracking-[1px]"
      />
    </div>
  );
};

export default ContactInput;
