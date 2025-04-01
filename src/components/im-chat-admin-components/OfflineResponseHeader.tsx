import {DownOutlined} from "@ant-design/icons"
import {useTranslation} from "react-i18next"

const OfflineResponseHeader = () => {
  const {t} = useTranslation()
  return (
    <div className="p-4 rounded-lg flex justify-between">
      <div>
        <p className="text-xl font-bold">{t('offline_response')}</p>
        <p className="text-sm text-[#666666]">{t('set_auto_reply_pre_settled_messages_while_outside_business_hours')}</p>
      </div>
      <div className="flex justify-center items-center">
        <DownOutlined/>
      </div>
    </div>
  )
}

export default OfflineResponseHeader