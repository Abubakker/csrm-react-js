import { useTranslation } from 'react-i18next';
import { TbDeviceMobileFilled } from 'react-icons/tb';
import { IoMdCloseCircle } from 'react-icons/io';

import ginzaUser from '../../../assets/images/ginzaUser.png';
import defultImg from '../../../assets/images/defultImg.png';
import disktopView from '../../../assets/images/disktopView.jpg';
import phoneImage from '../../../assets/images/phone-notification.png';
import monitor from '../../../assets/icons/monitor.png';
import activemonitor from '../../../assets/icons/activemonitor.svg';

interface PreviewSectionProps {
  deviceByView: string;
  SetDeviceByView: (view: string) => void;
  title: string;
  description: string;
  previewImageUrl: string | null;
}

const PreviewSection = ({
  deviceByView,
  SetDeviceByView,
  title,
  description,
  previewImageUrl,
}: PreviewSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="pl-[60px] pr-9 border-l border-[#DADDEB]">
      <div className="flex justify-between items-center mt-9">
        <h2 className="text-[14px] font-bold -ml-3">{t('preview')}</h2>
        <div className="flex gap-2 items-center">
          <span
            className={`text-[25px] cursor-pointer ${
              deviceByView === 'mobile' ? 'text-blue-600' : 'text-[#8B8FA3]'
            }`}
            onClick={() => SetDeviceByView('mobile')}
          >
            <TbDeviceMobileFilled />
          </span>
          <span
            className={`text-[24px] cursor-pointer`}
            onClick={() => SetDeviceByView('disktop')}
          >
            {deviceByView === 'disktop' ? (
              <img
                src={activemonitor}
                alt={'monitor'}
                className="size-6 -mt-[10px]"
              />
            ) : (
              <img
                src={monitor}
                alt={'monitor'}
                className="size-6 -mt-[10px]"
              />
            )}
          </span>
        </div>
      </div>
      {deviceByView === 'mobile' ? (
        <div
          className="relative w-full min-h-[350px] rounded-t-3xl overflow-hidden bg-cover bg-no-repeat flex p-5 justify-center items-center mt-4 mx-auto"
          style={{ backgroundImage: `url(${phoneImage})` }}
        >
          <div className="bg-white w-full rounded-xl p-3">
            <div className="flex items-center gap-[6px] w-full">
              <img
                src={ginzaUser}
                className="size-[18px] -mt-2"
                alt="ginzaUser"
              />
              <h2 className="text-[12px] font-medium tracking-[1px]">
                Ginza Xiaoma
              </h2>
            </div>
            <div className="flex justify-between items-center gap-3">
              <div className="tracking-[1px] mt-3">
                <h1 className="text-[14px] font-bold">
                  {title === '' ? t('push_title') : title}
                </h1>
                <p className="text-[12px] text-[#3F4252] font-medium tracking-[1px] font-sans">
                  {description === '' ? t('description') : description}
                </p>
              </div>
              <div className="min-w-[25%] flex justify-end">
                {previewImageUrl != null ? (
                  <img
                    src={previewImageUrl}
                    alt="notification"
                    className="size-[56px] rounded-[12px]"
                  />
                ) : (
                  <img
                    src={defultImg}
                    alt="notification"
                    className="size-[56px] rounded-[12px]"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="relative min-w-[400px] min-h-[350px] rounded-[10px] shadow-lg border border-[#e7e7e7] overflow-hidden bg-center bg-cover bg-no-repeat p-5 -ml-5 mt-6"
          style={{ backgroundImage: `url(${disktopView})` }}
        >
          <div className="bg-[#F5F6FC] w-full rounded-[5px] p-3 max-w-[254px] absolute end-3 shadow top-8">
            <div className="flex items-center gap-[6px] w-full">
              <img
                src={ginzaUser}
                className="size-[15px] -mt-2"
                alt="ginzaUser"
              />
              <h2 className="text-[10px] font-medium tracking-wider -mt-1">
                Ginza Xiaoma
              </h2>
            </div>
            <div className="flex justify-between items-center mt-2 gap-3">
              <div className="tracking-wider">
                <h1 className="text-[12px] font-bold">
                  {title === '' ? t('push_title') : title}
                </h1>
                <p className="text-[10px] text-slate-600 font-medium -mt-[2px]">
                  {description === '' ? t('description') : description}
                </p>
              </div>
              <div className="-mt-1">
                {previewImageUrl != null ? (
                  <img
                    src={previewImageUrl}
                    alt="notification"
                    className="size-[40px] rounded-[10px]"
                  />
                ) : (
                  <img
                    src={defultImg}
                    alt="notification"
                    className="size-[40px] rounded-[10px]"
                  />
                )}
              </div>
            </div>
          </div>
          <span className="absolute end-2 shadow-xl top-6 z-20 text-[#666666] text-[18px]">
            <IoMdCloseCircle />
          </span>
        </div>
      )}
    </div>
  );
};

export default PreviewSection;
