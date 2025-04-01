import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SetHolidays from './SetHolidays';
import SetBusinessHour from './SetBusinessHour';
import deleteIcon from '../../../assets/icons/delectIcon.svg';
import { useCreateSettingProfileMutation } from 'store/im-chat-stores/imManagerChatApi';
import {
  BusinessHour,
  Holiday,
  ProBusinessHour,
  Setting,
} from 'pages/Settings/Settings';
import { notification } from 'antd';

type BusinessHoursProps = {
  setProBusinessHour: Dispatch<SetStateAction<ProBusinessHour>>;
  setting: Setting;
  pluginKey: string;
  getSetting: Setting;
};

const BusinessHours = ({
  setProBusinessHour,
  setting,
  getSetting,
  pluginKey,
}: BusinessHoursProps) => {
  const { t } = useTranslation();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showDeleteButtonForBus, setShowDeleteButtonForBus] = useState<
    number | null
  >(null);
  // create mutation
  const [createProfile] = useCreateSettingProfileMutation();

  useEffect(() => {
    setBusinessHours(getSetting?.businessHours);
    const initialHolidays = Array.isArray(getSetting?.holidays)
      ? getSetting.holidays
      : [];
    setHolidays(initialHolidays);
  }, [getSetting]);

  // delete holidays
  const deleteHolidayDate = (sDate: string) => {
    const remainDays = holidays?.filter((day) => day.start_time !== sDate);
    setHolidays(remainDays);
  };
  // delete business hour
  const deleteBusinessHour = (index: number) => {
    const updatedHours = businessHours?.filter((_, idx) => idx !== index);
    setBusinessHours(updatedHours);
  };

  // manage state
  useEffect(() => {
    setProBusinessHour({ holidays, businessHours });
  }, [businessHours, holidays, setProBusinessHour]);

  // create
  const handleProfileSubmit = async () => {
    try {
      if (setting) {
        const res = await createProfile({ pluginKey, data: setting }).unwrap();
        if (res) {
          notification.info({
            message: '',
            description: t('profile_updated'),
            placement: 'bottomRight',
          });
        }
      }
    } catch (error) {
      notification.error({
        message: '',
        description: t('update_failed'),
        placement: 'bottomRight',
      });
    }
  };
  const handleCancel = () => {
    setBusinessHours(getSetting?.businessHours);
    setHolidays(getSetting?.holidays);
  };
  return (
    <div className=" pt-8 border-t border-[#DADDEB] mt-4">
      {/* Set business hour */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-sm font-bold">{t('setbhr')}</h1>
          <p className="text-[12px] text-[#8B8FA3] tracking-[1px] pt-[3px]">
            {t('atlaone')}
          </p>
          {/* Display business hours */}
          <div className="space-y-4">
            {businessHours?.length > 0 &&
              businessHours?.map((time, idx) => (
                <div
                  key={idx}
                  className="border border-slate-300  rounded-[10px] text-[12px] font-medium tracking-wider flex items-center justify-between hover:bg-slate-200 h-[60px]"
                  onMouseEnter={() => setShowDeleteButtonForBus(idx)}
                  onMouseLeave={() => setShowDeleteButtonForBus(null)}
                >
                  <span className="flex flex-col px-3 py-2">
                    <span className="flex">
                      {time.working_days?.map((day, index) => (
                        <span key={index}>
                          {day}
                          {index < time?.working_days?.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </span>
                    <span className="mt-1">{`${time.start_time} - ${time.end_time}`}</span>
                  </span>

                  {showDeleteButtonForBus === idx && (
                    <button
                      className="text-red-500 text-[14px] bg-transparent cursor-pointer bg-white h-[58px] w-12 rounded-[10px]"
                      onClick={() => deleteBusinessHour(idx)}
                    >
                      <img
                        src={deleteIcon}
                        className="size-5"
                        alt="delete icon"
                      />
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
        <div>
          <SetBusinessHour
            businessHour={businessHours}
            SetBusinessHour={setBusinessHours}
          />
        </div>
      </div>

      {/* Set holiday */}
      <div className="flex justify-between mt-8">
        <div>
          <h1 className="text-sm font-bold">{t('shod')}</h1>
          <p className="text-[12px] text-[#8B8FA3] tracking-[1px] pt-[3px]">
            {t('anytnp')}
          </p>
          {holidays?.length > 0 &&
            holidays?.map((date, idx) => (
              <p
                key={idx}
                className="border border-slate-300 rounded-[10px] text-[12px] font-medium tracking-wider flex items-center justify-between hover:bg-slate-200 h-[44px]"
                onMouseEnter={() => setShowDeleteButton(true)}
                onMouseLeave={() => setShowDeleteButton(false)}
              >
                <span className=" px-3 py-2 ">
                  {date?.start_time} - {date?.end_time}
                </span>

                {showDeleteButton && (
                  <button
                    className="text-red-500 text-[14px] bg-transparent cursor-pointer bg-white h-[42px] w-10 rounded-[10px]"
                    onClick={() =>
                      date?.start_time && deleteHolidayDate(date.start_time)
                    }
                  >
                    <img
                      src={deleteIcon}
                      className="size-5"
                      alt="delete icon"
                    />
                  </button>
                )}
              </p>
            ))}
        </div>
        <div>
          <SetHolidays setHolidays={setHolidays} holidays={holidays} />
        </div>
      </div>

      {/* footer section */}
      <div
        className={`${
          businessHours?.length > 0 ? 'flex gap-4 mt-8 items-center' : 'hidden '
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

export default BusinessHours;
