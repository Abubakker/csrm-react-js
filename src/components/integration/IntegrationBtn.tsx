import { RightArrow } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { IntegrationBtnTyp } from 'types/integration';

const IntegrationBtn = ({ handleBtnClick }: IntegrationBtnTyp) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={handleBtnClick}
      className="w-full rounded-[10px] py-3 px-6 bg-[#1677FF] text-white flex items-center gap-3 justify-center font-bold"
    >
      <span>{t('integrations_btn')}</span>
      <img src={RightArrow} alt="arrow" />
    </button>
  );
};

export default IntegrationBtn;
