import { useState, useEffect } from 'react'
import { Modal, TimePicker, Button, Typography, Space, Divider, message } from 'antd'
import PropTypes from "prop-types"
import {useTranslation} from "react-i18next";
const { Text } = Typography

const BusinessHourModal = ({ timeZone, visible, onCancel, onConfirm }) => {
  const { t } = useTranslation()
  const [selectedDays, setSelectedDays] = useState([])
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [isFormValid, setIsFormValid] = useState(false)

  const daysOfWeek = [
    { label: 'S', value: 'Sun' },
    { label: 'M', value: 'Mon' },
    { label: 'T', value: 'Tue' },
    { label: 'W', value: 'Wed' },
    { label: 'T', value: 'Thu' },
    { label: 'F', value: 'Fri' },
    { label: 'S', value: 'Sat' }
  ]

  useEffect(() => {
    setIsFormValid(selectedDays.length > 0 && startTime && endTime)
  }, [selectedDays, startTime, endTime])

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const handleCancel = () => {
    setSelectedDays([])
    setStartTime(null)
    setEndTime(null)
    onCancel()
  }

  const handleConfirm = () => {
    if (isFormValid) {
      onConfirm({
        working_days: selectedDays,
        start_time: startTime.format('HH:mm'),
        end_time: endTime.format('HH:mm')
      })
      setSelectedDays([])
      setStartTime(null)
      setEndTime(null)
    } else {
      message.error('Please select at least one day and set both start and end times.')
    }
  }

  return (
    <Modal
      title={t('set_business_hour')}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {t('cancel')}
        </Button>,
        <Button key="confirm" type="primary" onClick={handleConfirm} disabled={!isFormValid}>
          {t('save')}
        </Button>,
      ]}
    >
      <Space direction="vertical" size="middle" className="w-full">
        <div className="flex items-center">
          <Text className="w-[120px]">{t('day_of_week')}</Text>
          <div className="flex gap-1">
            {daysOfWeek.map((day) => (
              <Button
                key={day.value}
                onClick={() => toggleDay(day.value)}
                className={`h-[34px] w-[40px] rounded-[10px] flex justify-center focus:outline-none focus:ring-0 focus-visible:outline-none hover:none ${selectedDays.includes(day.value) ? 'bg-[#676B80] text-white' : 'bg-white text-black'}`}
              >
                {day.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <Text className="w-[120px]">{t('time')}</Text>
          <TimePicker
            value={startTime}
            format="HH:mm"
            onChange={(time) => setStartTime(time)}
            placeholder={t('start_time')}
          />
          <Divider type="vertical" className="w-[12px] h-[2px] m-5 bg-black"/>
          <TimePicker
            value={endTime}
            format="HH:mm"
            onChange={(time) => setEndTime(time)}
            placeholder={t('end_time')}
          />
        </div>
        <div className="flex">
          <Text className="w-[120px]">{t('timezone')} :</Text>
          <Text type="secondary">{timeZone}</Text>
        </div>
      </Space>
    </Modal>
  )
}

export default BusinessHourModal

BusinessHourModal.propTypes = {
  timeZone: PropTypes.string,
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
}