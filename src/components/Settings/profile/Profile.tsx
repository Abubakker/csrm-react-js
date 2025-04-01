import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllCountries, getAllTimezones } from 'countries-and-timezones';
import {
  useCreateSettingProfileMutation,
  useUploadAttachmentMutation,
} from 'store/im-chat-stores/imManagerChatApi';
import ProfileImageSection from './ProfileImageSection';
import NameSection from './NameSection';
import ContactInput from './ContactInput';
import CountrySelect from './CountrySelect';
import TimezoneSelect from './TimezoneSelect';
import { notification } from 'antd';

// Define a type
export type CountryType = {
  id: string;
  name: string;
  timezones: string[];
};

export type TimezoneType = {
  name: string;
  utcOffset: number;
};

export type LanguageConfigType = {
  value: string;
  label: string;
  fullForm: string;
};

export type ProfileNameType = {
  name: string;
  language: string;
};

const Profile = ({ setProfile, setting, getSetting, pluginKey }: any) => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState([t('english')]);
  const countryList: CountryType[] = Object.values(
    getAllCountries()
  ) as CountryType[];
  const timeZoneList: TimezoneType[] = Object.values(
    getAllTimezones()
  ) as TimezoneType[];
  const [addLanguageToggle, setAddLanguageToggle] = useState(false);
  const [imageUrl, setImageUrl] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [filteredTimeZones, setFilteredTimeZones] = useState<any[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>(null);
  const [contact, setContact] = useState<string>('');
  const [name, setName] = useState<ProfileNameType[]>([]);
  const [imageToggle, setImageToggle] = useState(false);
  const [uploadAttachment, { isLoading }] = useUploadAttachmentMutation();
  // create mutaition
  const [createProfile] = useCreateSettingProfileMutation();

  // languages
  const languages: LanguageConfigType[] = [
    { value: 'en', label: 'EN', fullForm: t('english') },
    { value: 'ja', label: 'JA', fullForm: t('ja') },
    { value: 'zh_CN', label: 'zh_CN', fullForm: t('zh_CN') },
    { value: 'zh_TW', label: 'zh_TW', fullForm: t('zh_TW') },
  ];

  // initial profile data loaded
  useEffect(() => {
    setImageUrl(getSetting?.icon);
    setPreviewImageUrl(getSetting?.icon);
    setSelectedCountry(getSetting?.country);
    setSelectedTimezone(getSetting?.timeZone);

    setName(
      getSetting?.imChannelProfileNameList
        ?.map((item: any) => {
          const languageFullForm = languages.find(
            (lang) => lang.value === item.language
          )?.fullForm;

          // Return the mapped value or a default structure
          return {
            name: item?.name || 'Default Name',
            language: languageFullForm || t('english'),
          };
        })
        ?.reverse() || [
        {
          name: '',
          language: t('english'),
        },
      ]
    );

    setContact(getSetting?.contactNumber);

    const initialLanguages: string[] = getSetting?.imChannelProfileNameList
      ?.map(
        (item: { language: string }) =>
          languages.find((l: LanguageConfigType) => l.value === item.language)
            ?.fullForm || t('english')
      )
      ?.filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
      ?.reverse() || [t('english')];

    setLanguage(initialLanguages);
  }, [getSetting]);

  // handle select country changes
  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    const countryData = countryList.find((c) => c.name === value);
    const timeZones = countryData?.timezones || [];
    setFilteredTimeZones(
      timeZoneList.filter((tz) => timeZones.includes(tz.name))
    );
  };
  // handle timezone
  const handleTimezoneChange = (value: string) => {
    setSelectedTimezone(value);
  };
  // handle name
  const handleNameChange = (lang: string, value: string) => {
    setName((prev: any) => {
      const existing = prev.find((item: any) => item.language === lang);
      if (existing) {
        return prev.map((item: any) =>
          item.language === lang ? { ...item, name: value } : item
        );
      }
      return [...prev, { name: value, language: lang }];
    });
  };

  // handle image file upload
  const handleFile = async (e: any) => {
    const file = e?.target?.files[0];
    const maxFileSize = 10 * 1024 * 1024;
    if (file?.size <= maxFileSize) {
      let response = await uploadAttachment({ file: file }).unwrap();
      setImageUrl(response.url);
      setPreviewImageUrl(response.url);
      setImageToggle(false);
    }
  };

  // add language in name section
  const addLanguage = (language: string) => {
    setLanguage((prev) => [...prev, language]);
    setAddLanguageToggle(false);
    setName((prev: any) => [...prev, { name: '', language }]);
  };
  // removed language
  const removeLanguage = (lang: string) => {
    setLanguage((prev) => prev.filter((l) => l !== lang));
    setName((prev) => prev.filter((item) => item.language !== lang));
  };

  // delete image
  const deleteImage = () => {
    setImageUrl(null);
    setPreviewImageUrl(null);
    setImageToggle(false);
  };
  // set profile values
  useEffect(() => {
    const profileData = {
      icon: imageUrl,
      imChannelProfileNameList: name?.map((item) => ({
        name: item?.name,
        language: languages?.find((lang) => lang?.fullForm === item?.language)
          ?.label,
      })),
      contactNumber: contact,
      country: selectedCountry,
      timeZone: selectedTimezone,
    };

    setProfile((prevProfile: any) => {
      const isSame =
        JSON.stringify(prevProfile) === JSON.stringify(profileData);
      if (!isSame) {
        return profileData;
      }
      return prevProfile;
    });
  }, [imageUrl, name, contact, selectedCountry, selectedTimezone, languages]);

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
  // handle cancel
  const handleCancel = () => {
    setImageUrl(getSetting?.icon);
    setPreviewImageUrl(getSetting?.icon);
    setSelectedCountry(getSetting?.country);
    setSelectedTimezone(getSetting?.timeZone);
    setName(
      getSetting?.imChannelProfileNameList?.map((item: any) => {
        const languageFullForm = languages.find(
          (lang) => lang.label === item.language
        )?.fullForm;

        // Return the mapped value or a default structure
        return {
          name: item?.name || 'Default Name',
          language: languageFullForm || t('english'),
        };
      }) || [
        {
          name: 'Default Name',
          language: t('english'),
        },
      ]
    );
    setContact(getSetting?.contactNumber);
    setLanguage(
      getSetting?.imChannelProfileNameList?.map(
        (item: any) =>
          languages.find((lang) => lang.label === item.language)?.fullForm
      ) || [t('english')]
    );
  };

  return (
    <div className="border-t border-[#DADDEB] mt-4 ">
      {/* Image Section */}
      <ProfileImageSection
        previewUrl={previewImageUrl}
        isUploading={isLoading}
        showActions={imageToggle}
        onUpload={handleFile}
        onDelete={() => {
          deleteImage();
        }}
        onToggleActions={() => setImageToggle(!imageToggle)}
      />

      {/* Name Section */}
      <NameSection
        activeLanguages={language}
        profileNames={name}
        onNameChange={handleNameChange}
        onAddLanguage={addLanguage}
        onRemoveLanguage={removeLanguage}
        languages={languages}
      />

      {/* Contact Input */}
      <ContactInput value={contact} onChange={setContact} />

      {/* Country Select */}
      <CountrySelect
        countries={countryList}
        selectedCountry={selectedCountry}
        onCountryChange={handleCountryChange}
      />

      {/* Timezone Select */}
      <TimezoneSelect
        timezones={filteredTimeZones}
        selectedTimezone={selectedTimezone}
        selectedCountry={selectedCountry}
        onTimezoneChange={handleTimezoneChange}
      />

      {/* footer section */}
      <div
        className={`${
          imageUrl &&
          name &&
          contact &&
          selectedCountry &&
          selectedTimezone &&
          previewImageUrl
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

export default Profile;
