import { MessageFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export const NoSessionSelected = () => {
  const {t} = useTranslation()

  return (
    <div className="bg-white h-[100%] space-y-3 flex flex-col justify-center items-center">
      <MessageFilled
        style={{
          fontSize: 100,
          color: '#E8F1FF',
        }}

      />
      <p className="text-[18px]">{t('no_selected_session')}</p>
    </div>
  )
}
