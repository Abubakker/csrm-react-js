import { Modal, notification, Select } from 'antd';
import { useEffect, useState } from 'react';
import { GoDash } from 'react-icons/go';
import '../style.css';
import { HiOutlinePlusSm } from 'react-icons/hi';
import { times } from 'constants/general-constants';
import { useTranslation } from 'react-i18next';

const SetBusinessHour = ({ SetBusinessHour, businessHour }: any) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workingDays, setWorkingDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setWorkingDays([]);
  }, [businessHour]);

  const submit = () => {
    // Check if startTime is earlier than endTime
    if (!startTime || !endTime || workingDays.length === 0) {
      notification.error({
        message: '',
        description: t('please_fill_all_required_fields'),
        placement: 'bottomRight',
      });
      handleCancel();
      return;
    }

    if (startTime >= endTime) {
      notification.error({
        message: '',
        description: t('start_time_end_time_err'),
        placement: 'bottomRight',
      });
      handleCancel();
      return;
    }

    // Check if any day already has business hours set
    const overlappingDays = businessHour?.some((hour: any) =>
      hour?.working_days?.some((day: string) => workingDays.includes(day))
    );

    if (overlappingDays) {
      notification.error({
        message: '',
        description: t('business_hours_exist'),
        placement: 'bottomRight',
      });
      handleCancel();
      return;
    }

    // If validations pass, add the new business hour
    SetBusinessHour((prev: any) => [
      ...prev,
      { working_days: workingDays, start_time: startTime, end_time: endTime },
    ]);
    handleCancel();
  };

  const handleAddDays = (day: string) => {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div>
      <button
        onClick={showModal}
        className="text-[12px] text-blue-600 tracking-wider font-bold border border-blue-600 p-3 rounded-lg flex gap-[6px] items-center justify-center w-[164px] h-[42px]"
      >
        <span className="text-lg">
          <HiOutlinePlusSm />
        </span>
        <span className="-mt-[2px]">{t('adDayT')}</span>
      </button>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={false}
        className="customModal w-[532px] h-[320px]"
      >
        <div className="py-1">
          <h1 className="text-[18px] font-bold">{t('setbhr')}</h1>
          <div className="mt-10 flex items-start">
            <h3 className="text-[12px] font-medium mb-2 w-[30%] tracking-[1px]">
              {t('dayofweek')}
            </h3>
            <div className="flex gap-2 mb-4">
              {[
                t('sun'),
                t('mon'),
                t('tue'),
                t('wed'),
                t('thu'),
                t('fri'),
                t('sat'),
              ].map((day, index) => (
                <button
                  key={index}
                  className={`w-10 h-[34px] rounded-[10px] border border-slate-200 ${
                    workingDays.includes(day)
                      ? 'bg-[#676B80] text-white'
                      : 'bg-white text-[#3F4252]'
                  } text-center text-[12px] font-medium`}
                  onClick={() => handleAddDays(day)}
                >
                  {day.slice(0, 1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-start mt-3">
            <h3 className="text-[12px] font-medium w-[30%] tracking-[1px]">
              {t('time')}
            </h3>
            <div className="flex gap-[26px] mb-5 items-center custom-select BsSelect">
              <Select
                onChange={(value) => setStartTime(value)}
                options={times?.map((time: string) => ({
                  value: time,
                  label: time,
                }))}
                className="w-[96px] h-8 font-medium "
                placeholder="00:00"
              />
              <span>
                <GoDash />
              </span>
              <Select
                onChange={(value) => setEndTime(value)}
                options={times.map((time: string) => ({
                  value: time,
                  label: time,
                }))}
                className="w-[96px] h-8 font-medium"
                placeholder="00:00"
              />
            </div>
          </div>
          <p className="text-sm text-[#9EA1B5] font-medium tracking-[1px]">
            {t('ztz')}
          </p>
          <div className="flex gap-4 justify-end mt-6 items-end">
            <p
              className="px-6 rounded-[10px] cursor-pointer text-[12px] font-bold border py-3 tracking-[1px] mb-0"
              onClick={handleCancel}
            >
              {t('cancel')}
            </p>
            <p
              className={`px-6 rounded-[10px] text-[12px] font-bold py-3 text-white mb-0 ${
                startTime && endTime && workingDays.length > 0
                  ? 'bg-[#1677FF] hover:bg-[#1677FF] cursor-pointer'
                  : 'bg-[#8B8FA3] cursor-not-allowed tracking-[1px]'
              }`}
              onClick={submit}
            >
              {t('confirm')}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SetBusinessHour;
