import {DownOutlined} from "@ant-design/icons"
import {useTranslation} from "react-i18next"


const GreetingsHeader = () => {
  const {t} = useTranslation()
  return (
    <>
      <div className="p-4 rounded-lg flex justify-between">
        <div>
          <p className="text-xl font-bold">{t('greetings')}</p>
          <p className="text-sm text-[#666666]">{t('set_a_greeting_message_for_customers_while_starting_a_conversation')}</p>
        </div>
        <div className="flex justify-center items-center">
          <DownOutlined/>
        </div>
      </div>
    </>
  )
}

export default GreetingsHeader