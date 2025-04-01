import { useState } from 'react'
import { Modal, DatePicker, Calendar, Button, Space } from 'antd'
import dayjs from "dayjs"
import isBetween from 'dayjs/plugin/isBetween'
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
dayjs.extend(isBetween)

const { RangePicker } = DatePicker

const HolidayModal = ({ visible, onCancel, onConfirm }) => {
  const { t } = useTranslation()
  const [dateRange, setDateRange] = useState([])

  const handleCancel = () => {
    setDateRange([])
    onCancel()
  }

  const handleConfirm = () => {
    onConfirm({start_time: dateRange[0], end_time: dateRange[1]})
    setDateRange([])
  }

  const handleRangeChange = (dates) => {
    setDateRange(dates)
  }

  const isInRange = (selected_date) => {
    if (dateRange.length !== 2) return false
    return selected_date.isBetween(dateRange[0], dateRange[1], null, '[]')
  }

  const dateFullCellRender = (date) => {
    if (!dateRange[0] || !dateRange[1]) {
      return <div className="flex items-center justify-center h-full w-full">{date.date()}</div>
    }

    const currentDateStr = date?.format('YYYY-MM-DD')
    const startDateStr = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : null
    const endDateStr = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : null
    const isStart = currentDateStr === startDateStr
    const isEnd = currentDateStr === endDateStr
    const isMiddle = isInRange(date) && !isStart && !isEnd

    let cellClasses = ''

    if (isStart) {
      cellClasses += ' bg-gray-500 text-white rounded-l-full'
    }else if (isEnd) {
      cellClasses += ' bg-gray-500 text-white rounded-r-full'
    }else if (isMiddle) {
      cellClasses += ' bg-gray-500 text-white'
    } else {
      cellClasses += ' bg-white text-black'
    }

    return (
      <div className={cellClasses}>
        {date.date()}
      </div>
    )
  }

  return (
    <Modal
      title={t('set_holiday')}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={400}
    >
      <Space direction="vertical" size={16} className="w-full">
        <RangePicker
          value={dateRange}
          onChange={handleRangeChange}
          className="w-full"
          placeholder={[t('start_date'), t('end_date')]}
        />
        <Calendar
          fullscreen={false}
          value={dateRange[0]}
          fullCellRender={dateFullCellRender}
          headerRender={({ value, onChange }) => (
            <div className="flex justify-between items-center p-2">
              <span>{value?.format('MMMM YYYY')}</span>
              <Space>
                {!dateRange && (
                  <>
                    <Button onClick={() => onChange(value.clone().subtract(1, 'month'))}
                            className="flex items-center justify-center w-8 h-8 rounded-full">
                      &lt;
                    </Button>
                    <Button onClick={() => onChange(value.clone().add(1, 'month'))}
                            className="flex items-center justify-center w-8 h-8 rounded-full">
                      &gt;
                    </Button>
                  </>
                )}
              </Space>
            </div>
          )}
        />
        <div className="flex justify-end w-full">
          <Button onClick={handleCancel} className="mr-2">{t('cancel')}</Button>
          <Button type="primary" onClick={handleConfirm}>{t('save')}</Button>
        </div>
      </Space>
    </Modal>
  )
}

export default HolidayModal

HolidayModal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
}