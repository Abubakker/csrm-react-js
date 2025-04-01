import {DownOutlined} from "@ant-design/icons"
import {useTranslation} from "react-i18next"

const BusinessHourHeader = () => {
  const {t} = useTranslation()
  return (
    <>
      <div className="p-4 flex justify-between">
        <div>
          <p className="text-xl font-bold">{t('business_hours')}</p>
          <p className="text-sm text-[#666666]">{t('set_business_hours')}</p>
        </div>
        <div className="flex justify-center items-center">
          <DownOutlined/>
        </div>
      </div>
    </>
  )
}

export default BusinessHourHeader