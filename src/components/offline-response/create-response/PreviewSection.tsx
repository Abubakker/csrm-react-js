import { useTranslation } from 'react-i18next';

import userImg from '../../../assets/icons/ImChat(16x16).svg';
import phoneImage from '../../../assets/images/phone-notification.png';

interface PreviewSectionProps {
  buttonText: string;
  responseText: string;
}

const PreviewSection = ({ buttonText, responseText }: PreviewSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="px-[54px] border-l border-[#DEE0ED]">
      <h2 className="text-[14px] font-bold ">{t('preview')}</h2>
      <div
        className="relative w-[390px] min-h-[380px] border-[#3F4253] rounded-t-[42px] bg-center text-white bg-no-repeat flex px-5 py-14 justify-center items-center border mt-6 ml-3 mx-auto bg-cover"
        style={{ backgroundImage: `url(${phoneImage})` }}
      >
        <div className="flex flex-row-reverse justify-between w-full items-start relative">
          {/* button text */}
          <span className="text-[12px] min-h-[34px] leading-5 bg-white text-black rounded-[10px] absolute tracking-[1px] font-medium px-3 py-2">
            {buttonText ? buttonText : t('button')}
          </span>

          {/* Response */}
          <div className="flex items-end gap-2 pt-5 mt-8 w-full">
            <div className=" text-black bg-white p-[9px] rounded-full mb-3">
              <img src={userImg} alt="" />
            </div>
            <p className="text-[12px] leading-5 bg-[#F7F7F7] text-black p-2 rounded-[10px] min-w-[80%] font-medium  tracking-[1px]">
              {responseText ? responseText : t('response')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewSection;
