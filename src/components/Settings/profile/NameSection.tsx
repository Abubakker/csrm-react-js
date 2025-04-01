import { Input } from "antd";
import { useState } from "react";
import { FaMinus } from "react-icons/fa6";
import { HiOutlinePlusSm } from "react-icons/hi";
import { LanguageConfigType, ProfileNameType } from "./Profile";
import { useTranslation } from "react-i18next";

// extract name section component form profile component

type NameSectionProps = {
  activeLanguages: string[];
  profileNames: ProfileNameType[];
  onNameChange: (lang: string, value: string) => void;
  onAddLanguage: (lang: string) => void;
  onRemoveLanguage: (lang: string) => void;
  languages: LanguageConfigType[];
};

const NameSection = ({
  activeLanguages,
  profileNames,
  onNameChange,
  onAddLanguage,
  onRemoveLanguage,
  languages,
}: NameSectionProps) => {
  const { t } = useTranslation();

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  return (
    <>
      {activeLanguages.map((lang) => (
        <div key={lang} className="mb-4">
          <div className="flex justify-between items-center">
            <label className="uppercase text-[10px] font-medium tracking-[0.5px]">
              {t("name")} <span className="text-[#676B80]">({lang})</span>
            </label>
            {lang !== t("english") && (
              <button
                onClick={() => onRemoveLanguage(lang)}
                className="h-4 w-4 bg-red-600 rounded-full text-white flex items-center justify-center text-xs"
              >
                <FaMinus />
              </button>
            )}
          </div>
          <Input
            value={profileNames.find((n) => n.language === lang)?.name || ""}
            onChange={(e) => onNameChange(lang, e.target.value)}
            placeholder={`${t("enter_name")} ${lang}`}
            className="mt-1 rounded-[10px] h-[42px] font-medium tracking-[1px]"
          />
        </div>
      ))}

      <div className="relative mb-4">
        <button
          onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
          className="text-[12px] font-bold tracking-[1px] flex items-center gap-1 text-[#1677FF]"
          disabled={activeLanguages.length === languages.length}
        >
          <HiOutlinePlusSm className="text-lg" />
          {t("addLang")}
        </button>

        {showLanguageDropdown && (
          <div className="absolute left-0 bg-white rounded-[10px] shadow-xl z-20 p-2">
            {languages
              .filter((lang) => !activeLanguages.includes(t(lang.fullForm)))
              .map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => {
                    onAddLanguage(t(lang.fullForm));
                    setShowLanguageDropdown(false);
                  }}
                  className="text-sm bg-transparent w-full text-left px-2 py-1 hover:bg-slate-100 rounded cursor-pointer"
                >
                  {t(lang.fullForm)}
                </button>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NameSection;
