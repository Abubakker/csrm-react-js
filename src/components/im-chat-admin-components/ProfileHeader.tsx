import {DownOutlined} from "@ant-design/icons"
import {useTranslation} from "react-i18next"

const ProfileHeader = () => {
  const {t} = useTranslation()

  return (
    <>
      <div className="p-4 rounded-lg flex justify-between">
        <div>
          <p className="text-xl font-bold">{t('profile')}</p>
          <p className="text-sm text-[#666666]">{t('set_profile_with_information')}</p>
        </div>
        <div className="flex justify-center items-center">
          <DownOutlined/>
        </div>
      </div>
    </>
  )
}
export default ProfileHeader