import { DatePicker, Input } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const OperationComponent = ({
  setOperations,
  operationType,
  discard,
  setDiscard,
  operations,
}: any) => {
  const { t } = useTranslation();
  const [isRepetitionOn, setIsRepetitionOn] = useState(false);
  const [cooldownPeriod, setCooldownPeriod] = useState('');
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [offlineOperation, setOfflineOperation] = useState<string[]>([]);

  // is already selected
  useEffect(() => {
    if (operations) {
      setIsRepetitionOn(operations?.is_repetable || false);
      setStartDate(operations.start_date || null);
      setEndDate(operations.end_date || null);
      setCooldownPeriod(operations?.duration || '');
      setOfflineOperation(operations?.offline_notification);
    }
  }, []);

  // reset if discard clicked present
  useEffect(() => {
    if (discard) {
      setCooldownPeriod('');
      setStartDate(null);
      setEndDate(null);
      setOfflineOperation([]);
      setIsRepetitionOn(false);
      setDiscard(false);
    }
  }, [discard]);

  // Update operations data format whenever any state changes
  useEffect(() => {
    const operationsData = {
      is_repetable: isRepetitionOn,
      duration: cooldownPeriod,
      start_date: startDate
        ? dayjs(startDate).format('YYYY-MM-DD HH:mm')
        : null,
      end_date: endDate ? dayjs(endDate).format('YYYY-MM-DD HH:mm') : null,
      offline_notification: offlineOperation,
    };
    setOperations(operationsData);
  }, [isRepetitionOn, cooldownPeriod, startDate, endDate, offlineOperation]);

  // Handle checkbox changes for offline operations
  const handleOfflineOperationChange = (value: string, checked: boolean) => {
    setOfflineOperation((prev) =>
      checked
        ? [...(prev || []), value]
        : (prev || []).filter((item) => item !== value)
    );
  };
  // Function to disable past dates
  const disabledDate = (current: any) => {
    return current && current < dayjs().startOf('day');
  };

  return (
    <div className="m-2 border-t border-[#d3d5df] -mt-3">
      {/* Repetition Section */}
      <div className="space-y-2 mb-6 pt-8">
        <div>
          <div className="flex items-center justify-start gap-3">
            <label className="relative inline-flex items-center cursor-pointer -mt-[6px]">
              <input
                type="checkbox"
                checked={isRepetitionOn}
                onChange={() => setIsRepetitionOn(!isRepetitionOn)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>
              <div
                className={`w-4 h-4 bg-white rounded-full absolute left-1 top-0.5 transition-transform ${
                  isRepetitionOn ? 'translate-x-3 right-3' : ''
                }`}
              ></div>
            </label>
            <h3 className="text-sm font-bold font-sans">{t('repetition')}</h3>
          </div>
          <div>
            <p className="text-sm text-[#676B80] leading-5 font-sans tracking-[0.7px] font-normal">
              {operationType === t('notification')
                ? t('repNotfi')
                : t('repCamp')}
            </p>
          </div>
        </div>

        {isRepetitionOn && (
          <div className="pt-4">
            <label
              htmlFor="cooldownPeriod"
              className="block text-[10px] font-medium text-[#1A1A1A] mb-1"
            >
              {t('COOLDOWNPERIOD')}
            </label>
            <Input
              id="cooldownPeriod"
              type="number"
              value={cooldownPeriod}
              onChange={(e) => setCooldownPeriod(e.target.value)}
              className=" p-2 text-[12px] max-w-[180px] tracking-[1px] h-[42px] rounded-[10px]"
              placeholder={`${t('COOLDOWNPERIOD')}`}
            ></Input>
          </div>
        )}
      </div>

      {/* Scheduling Section */}
      <div className="space-y-3 mb-6 border-t border-[#d3d5df] -mt-1">
        <h3 className="text-sm font-bold pt-4">{t('scheduling')}</h3>
        <p className="text-sm text-[#676B80] leading-5 font-sans tracking-[0.7px]  font-normal">
          {operationType === t('notification') ? t('pushSec') : t('camSec')}
        </p>
        <p className="text-[12px] text-[#9EA1B5] leading-[18px] font-sans tracking-[1px] font-medium">
          {t('ztz')}
        </p>

        <div className="grid grid-cols-1 gap-5 pt-3">
          <div>
            <label
              htmlFor="startDate"
              className="block text-[10px] tracking-[0.5px] font-medium text-[#1A1A1A] mb-1"
            >
              {t('startDate')}
            </label>
            <DatePicker
              value={startDate ? dayjs(startDate) : null}
              className="max-w-[180px] w-full border border-gray-200 rounded-[10px] shadow-sm p-2 text-[12px] h-[42px] tracking-[1px]"
              onChange={(date) => setStartDate(date)}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              disabledDate={disabledDate}
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-[10px] tracking-[0.5px] font-medium text-[#1A1A1A] mb-1"
            >
              {t('endDate')}
            </label>
            <DatePicker
              value={endDate ? dayjs(endDate) : null}
              className="max-w-[180px] w-full border border-gray-200 rounded-[10px] shadow-sm p-2 text-[12px] h-[42px] tracking-[1px]"
              onChange={(date) => setEndDate(date)}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              disabledDate={disabledDate}
            />
          </div>
        </div>
      </div>

      {/* Offline Push  campaign*/}
      <div className="space-y-3 mb-6 border-t border-[#d3d5df] -mt-2">
        <h3 className="text-sm font-bold pt-4">
          {t('off-Pus')} {operationType}
        </h3>
        <p className="text-sm text-[#676B80] leading-5 font-sans tracking-[0.7px]  font-normal">
          {operationType === t('notification') ? t('opreaPus') : t('opreaCam')}
        </p>

        <div className="flex flex-col space-y-3 pt-1">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="offlineOperation"
              value="email"
              checked={offlineOperation?.includes('email')}
              onChange={(e) =>
                handleOfflineOperationChange('email', e.target.checked)
              }
              className="h-4 w-4 text-blue-600 border border-gray-400 appearance-none checked:bg-blue-600 checked:h-[14px]  checked:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-offset-1"
              style={{ borderRadius: 3 }}
            />
            <span className="text-sm">{t('pEmail')}</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default OperationComponent;