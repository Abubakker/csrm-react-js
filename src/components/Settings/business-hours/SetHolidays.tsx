import { Modal, Input } from 'antd';
import { useEffect, useState } from 'react';
import { Calendar } from 'react-multi-date-picker';
import '../style.css';
import { HiOutlinePlusSm } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

const SetHolidays = ({ setHolidays, holidays }: any) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [values, setValues] = useState<any>([]);

  useEffect(() => {
    const calendarValues = holidays.map((holiday: any) => [
      holiday.start_time,
      holiday.end_time,
    ]);
    setValues(calendarValues);
  }, [holidays]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    const formattedHolidays = values.map((range: any) => ({
      start_time: range[0]?.format('YYYY-MM-DD'),
      end_time: range[1]?.format('YYYY-MM-DD'),
    }));

    setHolidays(formattedHolidays);

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const lastSelection = values.length > 0 ? values[values.length - 1] : null;

  return (
    <div>
      <button
        onClick={showModal}
        className="text-[12px] text-blue-600 tracking-wider font-bold border border-blue-600 p-3 rounded-lg flex gap-[6px] items-center justify-center w-[164px] h-[42px]"
      >
        <span className="text-lg">
          <HiOutlinePlusSm />
        </span>
        <span className="-mt-[2px]">{t('adHoli')}</span>
      </button>

      {/* Modal for setting holiday */}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={480}
        closable={false}
        className="customModal"
      >
        <div className="mb-4 w-full customCalendar mt-5 py-1">
          <div className="flex items-center gap-4 mb-6">
            <Input
              value={
                lastSelection && lastSelection[0]
                  ? new Date(lastSelection[0]).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : ''
              }
              className="h-[38px] text-center rounded-lg text-[16px]"
              placeholder={`${t('start_date_placeholder')}`}
            />

            <Input
              value={
                lastSelection && lastSelection[1]
                  ? new Date(lastSelection[1]).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : ''
              }
              className="h-[38px] text-center rounded-lg text-[16px]"
              placeholder={`${t('end_date_placeholder')}`}
            />
          </div>
          <Calendar
            className="calendarBody"
            value={values}
            onChange={setValues}
            headerOrder={['MONTH_YEAR', 'LEFT_BUTTON', 'RIGHT_BUTTON']}
            multiple
            range
            weekDays={['S', 'M', 'T', 'We', 'Th', 'Fr', 'Su']}
            shadow={false}
          />
        </div>

        <div className="flex gap-4 justify-end pt-2">
          <button
            onClick={handleCancel}
            className="px-6 py-[10px] font-semibold rounded-md flex items-center border bg-transparent hover:bg-slate-200 h-[42px] tracking-[1px]"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-[10px] rounded-md flex items-center font-semibold hover:bg-[#1677FF] h-[42px] tracking-[1px]"
            disabled={lastSelection?.length < 2 || values.length === 0}
          >
            {t('confirm')}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SetHolidays;
