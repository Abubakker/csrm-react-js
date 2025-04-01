import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import BusinessHourModal from '../modals/BusinessHourModal.jsx';
import HolidayModal from '../modals/HolidayModal.jsx';
import {
  useCreateProfileMutation,
  useGetProfileInfoQuery,
} from '../../../store/im-chat-stores/imManagerChatApi.js';
import BusinessHoursSkeletonLoader from '../loader/BusinessHoursSkeletonLoader.jsx';
import { Button } from 'antd';
import BusinessHourItem from './BusinessHourItem';
import HolidayItem from './HolidayItem';
import ActionButtons from './ActionButtons';

export interface BusinessHourData {
  working_days: string[];
  start_time: string;
  end_time: string;
}

export interface Holidays {
  start_time?: string;
  end_time?: string;
}

interface ImChannelProfile {
  businessHours?: BusinessHourData[];
  holidays?: Holidays;
  timeZone?: string;
}

enum Status {
  IDLE = 'idle',
  EDITING = 'editing',
  SUBMITTING = 'submitting',
}

const BusinessHour = () => {
  const { t } = useTranslation();
  const pluginKey = useSelector(
    (state: any) => state.imManagerSettings.pluginKey
  );
  const { data: profileData, isLoading: profileLoading } =
    useGetProfileInfoQuery({ pluginKey: pluginKey });
  const [updateManagerProfile] = useCreateProfileMutation();
  const [businessHourModal, setBusinessHourModal] = useState(false);
  const [holidayModal, setHolidayModal] = useState(false);
  const [imChannelProfile, setImChannelProfile] =
    useState<ImChannelProfile | null>(null);
  const [businessHours, setBusinessHours] = useState<BusinessHourData[]>([]);
  const [holidays, setHolidays] = useState<Holidays>({});
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [originalData, setOriginalData] = useState<{
    businessHours: BusinessHourData[];
    holidays: Holidays;
  }>({
    businessHours: [],
    holidays: {},
  });

  useEffect(() => {
    if (profileData) {
      setImChannelProfile(profileData);
      setBusinessHours(profileData.businessHours || []);
      setHolidays(profileData.holidays || {});
      setOriginalData({
        businessHours: profileData.businessHours || [],
        holidays: profileData.holidays || {},
      });
    }
  }, [profileData]);

  const addBusinessHour = (newBusinessHour: BusinessHourData) => {
    setBusinessHours((prevHours) => [...prevHours, newBusinessHour]);
    setStatus(Status.EDITING);
    setBusinessHourModal(false);
  };

  const deleteBusinessHour = (index: number) => {
    setBusinessHours((prevHours) => prevHours.filter((_, i) => i !== index));
    setStatus(Status.EDITING);
  };

  const addHolidays = (newHolidays: Holidays) => {
    setHolidays({
      start_time: newHolidays.start_time,
      end_time: newHolidays.end_time,
    });
    setStatus(Status.EDITING);
    setHolidayModal(false);
  };

  const deleteHolidays = () => {
    setHolidays({});
    setStatus(Status.EDITING);
  };

  const handleSubmit = async () => {
    setStatus(Status.SUBMITTING);
    try {
      await updateManagerProfile({
        pluginKey: pluginKey,
        data: {
          ...imChannelProfile,
          businessHours: businessHours,
          holidays: holidays,
        },
      });
      setStatus(Status.IDLE);
      setOriginalData({ businessHours, holidays });
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setStatus(Status.IDLE);
    }
  };

  const resetState = () => {
    setBusinessHours(originalData.businessHours);
    setHolidays(originalData.holidays);
    setStatus(Status.IDLE);
  };

  if (profileLoading) {
    return <BusinessHoursSkeletonLoader />;
  }

  return (
    <div className="px-3">
      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold">{t('set_business_hour')}</p>
          <p className="text-xs">{t('at_least_one_business_hour')}</p>
        </div>
        <Button
          onClick={() => setBusinessHourModal(true)}
          icon={<PlusOutlined />}
          className="w-[164px] h-[42px] bg-transparent"
        >
          {t('add_day_time')}
        </Button>
      </div>
      <div className="w-[316px] mt-3">
        <div className="space-y-3">
          {businessHours.map((businessHour, index) => (
            <BusinessHourItem
              key={index}
              businessHour={businessHour}
              onDelete={() => deleteBusinessHour(index)}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold">{t('set_holiday')}</p>
          <p className="text-xs">{t('changes_not_possible_today')}</p>
        </div>
        <Button
          icon={<PlusOutlined />}
          onClick={() => setHolidayModal(true)}
          className="w-[164px] h-[42px] bg-transparent"
        >
          {t('add_holiday')}
        </Button>
      </div>

      <div className="w-[316px] mt-3">
        <div className="space-y-3">
          {Object.keys(holidays).length > 0 && (
            <HolidayItem holidays={holidays} onDelete={deleteHolidays} />
          )}
        </div>
      </div>

      <ActionButtons
        isEditing={status === Status.EDITING}
        isSubmitting={status === Status.SUBMITTING}
        onSave={handleSubmit}
        onCancel={resetState}
      />

      <BusinessHourModal
        timeZone={imChannelProfile?.timeZone}
        visible={businessHourModal}
        onCancel={() => setBusinessHourModal(false)}
        onConfirm={addBusinessHour}
      />
      <HolidayModal
        visible={holidayModal}
        onConfirm={addHolidays}
        onCancel={() => setHolidayModal(false)}
      />
    </div>
  );
};

export default BusinessHour;
