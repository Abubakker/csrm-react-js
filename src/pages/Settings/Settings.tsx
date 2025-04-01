import { useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Profile } from 'components/Settings/profile';
import { useTranslation } from 'react-i18next';
import { BusinessHours } from 'components/Settings/business-hours';
import { useDispatch } from 'react-redux';
import {
  resetAuthToken,
  resetBaseUrl,
  resetPluginKey,
  storeAuthToken,
  storeBaseUrl,
  storePluginKey,
} from 'store/im-chat-stores/imManagerSettingsSlice';
import { useGetSettingProfileInfoQuery } from 'store/im-chat-stores/imManagerChatApi';
import { Spin } from 'antd';
import Greetings from 'components/Settings/Greetings';
import PreviewPanel from './PreviewPanel';

export type ProBusinessHour = {
  businessHours: BusinessHour[];
  holidays: Holiday[];
};

type ProfileName = {
  name: string;
  language: string;
};

type Greeting = {
  language: string;
  greeting: string;
};

export type BusinessHour = {
  working_days: string[];
  start_time?: string;
  end_time?: string;
};

export type Holiday = {
  start_time?: string;
  end_time?: string;
};

export type Setting = {
  icon: string;
  imChannelProfileNameList: ProfileName[];
  contactNumber: string;
  country: string;
  timeZone: string;
  imChannelProfileGreetingList: Greeting[];
  businessHours: BusinessHour[];
  holidays: Holiday[];
};

type SettingsProps = {
  authToken: string;
  pluginKey: string;
  baseUrl: string;
};

const Settings = ({ authToken, pluginKey, baseUrl }: SettingsProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetAuthToken());
    dispatch(resetBaseUrl());
    dispatch(resetPluginKey());

    if (authToken) {
      dispatch(storeBaseUrl(baseUrl));
      dispatch(storeAuthToken(authToken));
      dispatch(storePluginKey(pluginKey));
    }
  }, [baseUrl, pluginKey, authToken]);

  const { t } = useTranslation();
  const [openTab, setOpenTab] = useState<number>(1);
  const [profile, setProfile] = useState<any>({
    icon: '',
    imChannelProfileNameList: [],
    contactNumber: '',
    country: '',
    timeZone: '',
  });
  const [greeting, setGreeting] = useState<
    { language: string; greeting: string }[]
  >([{ language: 'EN', greeting: '' }]);
  const [proBusinessHour, setProBusinessHour] = useState<ProBusinessHour>({
    businessHours: [],
    holidays: [],
  });
  // get setting
  const [setting, setSetting] = useState<Setting>({
    icon: '',
    imChannelProfileNameList: [{ name: '', language: '' }],
    contactNumber: '',
    country: '',
    timeZone: '',
    imChannelProfileGreetingList: [{ language: '', greeting: '' }],
    businessHours: [{ working_days: [] }],
    holidays: [{}],
  });
  // set get profile data
  const [getSetting, setGetSetting] = useState<Setting>({
    icon: '',
    imChannelProfileNameList: [{ name: '', language: '' }],
    contactNumber: '',
    country: '',
    timeZone: '',
    imChannelProfileGreetingList: [{ language: '', greeting: '' }],
    businessHours: [{ working_days: [] }],
    holidays: [{}],
  });

  // get profile query
  const { data: imChartSetting, isLoading } = useGetSettingProfileInfoQuery({
    pluginKey,
  });

  // load initial data
  useEffect(() => {
    setGetSetting({
      icon: imChartSetting?.icon,
      imChannelProfileNameList: imChartSetting?.imChannelProfileNameList,
      contactNumber: imChartSetting?.contactNumber,
      country: imChartSetting?.country,
      timeZone: imChartSetting?.timeZone,
      imChannelProfileGreetingList:
        imChartSetting?.imChannelProfileGreetingList,
      businessHours: imChartSetting?.businessHours,
      holidays: imChartSetting?.holidays,
    });
  }, [imChartSetting]);

  // store data after change any data
  useEffect(() => {
    setSetting({
      icon: profile?.icon,
      imChannelProfileNameList: profile?.imChannelProfileNameList,
      contactNumber: profile?.contactNumber,
      country: profile?.country,
      timeZone: profile?.timeZone,
      imChannelProfileGreetingList: greeting,
      businessHours: proBusinessHour?.businessHours || [],
      holidays: proBusinessHour?.holidays || [],
    });
  }, [profile, greeting, proBusinessHour]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }
  // setting items
  const settingsItems = [
    {
      id: 1,
      name: t('profile'),
      subTitle: t('setPwI'),
      content: (
        <Profile
          setProfile={setProfile}
          setting={setting}
          getSetting={getSetting}
          pluginKey={pluginKey}
        />
      ),
    },
    {
      id: 2,
      name: t('greetings'),
      subTitle: t('sgmfc'),
      content: (
        <Greetings
          setGreeting={setGreeting}
          setting={setting}
          getSetting={getSetting}
          pluginKey={pluginKey}
        />
      ),
    },
    {
      id: 3,
      name: t('busH'),
      subTitle: t('sBho'),
      content: (
        <BusinessHours
          setProBusinessHour={setProBusinessHour}
          setting={setting}
          getSetting={getSetting}
          pluginKey={pluginKey}
        />
      ),
    },
  ];

  // handle toggle tab
  const handleToggleTab = (item: number) => {
    setOpenTab(item);
  };

  return (
    <div className="-mx-8 -my-10 overflow-hidden min-h-[calc(100vh-64px)] font-NotoSans bg-white p-6">
      <header>
        <h1 className="text-[24px] font-bold">{t('settings')}</h1>
      </header>
      <section className="max-w-[1020px] mx-auto mt-5">
        <div className="flex justify-between ">
          <section className="space-y-6 w-[60%] border-r border-[#DADDEB] pr-6">
            {settingsItems?.map((item) => (
              <div
                className={`bg-[#F5F6FC] rounded-[10px] p-6  ${
                  openTab === item?.id && 'border border-[#1677FF]'
                }`}
                key={item?.name}
              >
                <div
                  className="w-full flex items-start justify-between cursor-pointer"
                  onClick={() => handleToggleTab(item?.id)}
                >
                  <span>
                    <h1 className="text-[18px] font-bold">{item?.name}</h1>
                    <p className="text-[14px] font-normal text-[#676B80] -mt-1 mb-0 ">
                      {item?.subTitle}
                    </p>
                  </span>
                  {openTab === item?.id ? (
                    <span className="text-[20px] font-bold">
                      <IoIosArrowUp />
                    </span>
                  ) : (
                    <span className="text-[20px] font-bold">
                      <IoIosArrowDown />
                    </span>
                  )}
                </div>

                {/* Dropdown Content */}
                {openTab === item.id && <div className="">{item.content}</div>}
              </div>
            ))}
          </section>
          {/* preview section */}
          <div className="w-[40%]">
            <PreviewPanel
              settings={setting}
              imChartSetting={imChartSetting}
              greeting={greeting}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
