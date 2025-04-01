import { BookIcon } from 'assets/images';
import { useTranslation } from 'react-i18next';

const UserGuideBtn = () => {
  const { t } = useTranslation();

  return (
    <button className="flex items-center gap-2 rounded-[10px] py-3 px-4 bg-[#1677FF14]">
      <img src={BookIcon} alt="book" />
      <span className="text-[#1677FF] font-bold leading-5">
        {t('user_guide_btn')}
      </span>
    </button>
  );
};

export default UserGuideBtn;
