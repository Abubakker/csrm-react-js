import { useEffect, useState } from 'react';
import { FaMinus } from 'react-icons/fa6';
import TextArea from 'antd/lib/input/TextArea';
import { HiOutlinePlusSm } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useCreateSettingProfileMutation } from 'store/im-chat-stores/imManagerChatApi';
import { notification } from 'antd';

// Define types for Greetings
type GreetingType = {
  language: string;
  greeting: string;
};

type SettingType = {
  icon?: string;
  imChannelProfileNameList?: Array<{ name: string; language: string }>;
  contactNumber?: string;
  country?: string;
  timeZone?: string;
  imChannelProfileGreetingList?: GreetingType[];
  businessHours?: any[];
  holidays?: any[];
};

type GreetingsProps = {
  setGreeting: React.Dispatch<React.SetStateAction<GreetingType[]>>;
  setting: SettingType;
  getSetting: SettingType;
  pluginKey: string;
};

const Greetings = ({
  setGreeting,
  setting,
  getSetting,
  pluginKey,
}: GreetingsProps) => {
  const { t } = useTranslation();

  const [language, setLanguage] = useState(['EN']);
  const [addLanguageToggle, setAddLanguageToggle] = useState(false);
  const [greetings, setGreetingsState] = useState<
    { language: string; greeting: string }[]
  >([{ language: 'EN', greeting: '' }]);

  // create mutation
  const [createProfile] = useCreateSettingProfileMutation();
  const languages = [
    { value: 'en', label: 'EN', fullForm: t('english') },
    { value: 'ja', label: 'JA', fullForm: t('ja') },
    { value: 'zh_CN', label: 'zh_CN', fullForm: t('zh_CN') },
    { value: 'zh_TW', label: 'zh_TW', fullForm: t('zh_TW') },
  ];

  // load initial greeting state
  useEffect(() => {
    setGreetingsState(
      getSetting?.imChannelProfileGreetingList
        ?.map((item: any) => {
          const lan = languages?.find(
            (lan: any) => lan?.value === item?.language
          )?.label;
          return {
            greeting: item?.greeting,
            language: lan as string,
          };
        })
        ?.reverse() || [{ language: 'EN', greeting: '' }]
    );
    setLanguage(
      getSetting?.imChannelProfileGreetingList
        ?.map(
          (item: any) =>
            languages?.find((lan) => lan?.value === item?.language)?.label ||
            'EN'
        )
        ?.reverse() || ['EN']
    );
  }, [getSetting]);

  const addLanguage = (langLabel: string) => {
    setLanguage((prev) => [...prev, langLabel]);
    setGreetingsState((prev) => [
      ...prev,
      { language: langLabel, greeting: '' },
    ]);
    setAddLanguageToggle(false);
  };

  const removeLanguage = (langLabel: string) => {
    setLanguage((prev) => prev.filter((lan) => lan !== langLabel));
    setGreetingsState((prev) =>
      prev.filter((item) => item.language !== langLabel)
    );
  };

  const handleInputChange = (langLabel: string, value: string) => {
    setGreetingsState((prev) =>
      prev.map((item) =>
        item.language === langLabel ? { ...item, greeting: value } : item
      )
    );
  };

  useEffect(() => {
    setGreeting(greetings);
  }, [greetings]);

  // handle submit
  const handleProfileSubmit = async () => {
    if (setting) {
      const res: any = await createProfile({ pluginKey, data: setting });
      if (res?.data) {
        notification.info({
          message: '',
          description: t('profile_updated'),
          placement: 'bottomRight',
        });
      }
    }
  };

  const handleCancel = () => {
    setGreetingsState(
      getSetting?.imChannelProfileGreetingList || [
        { language: 'EN', greeting: '' },
      ]
    );
    setLanguage(
      getSetting?.imChannelProfileGreetingList?.map(
        (item: any) =>
          languages?.find((lan) => lan?.value === item?.language)?.label || 'EN'
      ) || ['EN']
    );
  };

  return (
    <div className="border-t border-[#DADDEB] mt-4">
      <div className="mt-8">
        {language.sort().map((item) => (
          <div key={item} className="mb-4">
            <div className="flex justify-between">
              <label
                className="uppercase text-[10px] font-medium tracking-[0.5px]"
                htmlFor={`greeting-${item}`}
              >
                {languages.find((lang) => lang.label === item)?.fullForm}
              </label>
              {item !== 'EN' && (
                <span
                  className="h-4 w-4 bg-red-600 rounded-full text-white p-1 flex items-center justify-center text-[12px] cursor-pointer"
                  onClick={() => removeLanguage(item)}
                >
                  <FaMinus />
                </span>
              )}
            </div>
            <TextArea
              id={`greeting-${item}`}
              value={
                greetings.find((greet) => greet.language === item)?.greeting ||
                ''
              }
              onChange={(e) => handleInputChange(item, e.target.value)}
              className="mt-1 rounded-[10px] h-20"
              placeholder={`${t('egrein')} ${
                languages.find((lang) => lang.label === item)?.fullForm
              }`}
              autoSize={{ minRows: 4 }}
            />
          </div>
        ))}
        <div className="relative">
          <p
            className={`text-[12px] font-bold tracking-[1px] flex items-center gap-[6px] ${
              language.length === languages.length
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-[#1677FF] cursor-pointer'
            }`}
            onClick={() =>
              language.length < languages.length &&
              setAddLanguageToggle(!addLanguageToggle)
            }
          >
            <span className="text-[15px] font-extrabold">
              <HiOutlinePlusSm />
            </span>
            {t('addLang')}
          </p>
          {addLanguageToggle && (
            <div className="left-10 absolute bg-white rounded-[10px] shadow-xl z-20 p-2 -mt-2">
              {languages
                .filter((lang) => !language.includes(lang.label))
                .map((lang) => (
                  <li
                    key={lang.value}
                    className="text-sm list-none px-2 py-1 tracking-wider hover:bg-slate-100 rounded cursor-pointer"
                    onClick={() => addLanguage(lang.label)}
                  >
                    {lang.fullForm}
                  </li>
                ))}
            </div>
          )}
        </div>
      </div>
      {/* footer section */}
      <div
        className={`${
          greetings[0]?.greeting !== ''
            ? 'flex gap-4 mt-8 items-center'
            : 'hidden '
        }`}
      >
        <button
          className="text-[12px] py-3 px-6 rounded-[10px] bg-[#1677FF] hover:bg-[#0c71fd] tracking-[1px] text-white h-[42px] font-bold"
          onClick={() => handleProfileSubmit()}
        >
          {t('save')}
        </button>
        <button
          className="text-[12px] py-3 px-6 border rounded-[10px] bg-[#ffffff] tracking-[1px] text-black h-[42px] font-bold hover:bg-slate-100"
          onClick={handleCancel}
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  );
};

export default Greetings;
