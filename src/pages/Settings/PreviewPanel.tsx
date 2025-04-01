import { useTranslation } from 'react-i18next';

// extract preview panel component form setting

interface PreviewPanelProps {
  settings: {
    icon?: string;
    imChannelProfileGreetingList?: Array<{ greeting?: string }>;
  };
  imChartSetting?: {
    icon?: string;
    imChannelProfileGreetingList?: Array<{ greeting?: string }>;
  };
  greeting: Array<{ greeting?: string }>;
}

const PreviewPanel = ({
  settings,
  imChartSetting,
  greeting,
}: PreviewPanelProps) => {
  const { t } = useTranslation();
  const date = new Date();

  const resolveImageSource = () => {
    if (settings?.icon) return settings.icon;
    if (imChartSetting?.icon) return imChartSetting.icon;
    return '/default-user.png'; // Consider moving this to constants
  };

  const resolveGreetingMessage = () => {
    if (greeting[0]?.greeting) return greeting[0].greeting;
    if (imChartSetting?.imChannelProfileGreetingList?.[0]?.greeting) {
      return imChartSetting.imChannelProfileGreetingList[
        imChartSetting.imChannelProfileGreetingList.length - 1
      ]?.greeting;
    }
    return `${t('gmess')}...`;
  };

  return (
    <section className=" px-6">
      <h1 className="text-[14px] font-bold mb-6">{t('preview')}</h1>
      <div className="w-[390px] h-[690px] bg-[#3F4252] rounded-[25px] relative">
        <h1 className="text-[16px] font-bold text-white tracking-wider text-center p-5">
          {t('backon')}
        </h1>
        <p className="text-[12px] font-medium text-[#C5C8D9] tracking-[1px] text-center -mt-6">
          {t('backon')}{' '}
          {date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>

        {/* Preview Content */}
        <div className="absolute flex items-end gap-2 p-5 bottom-[90px]">
          <div className="flex items-center justify-center bg-[#f8f8f8] rounded-full w-8 h-8 -mt-[44px] overflow-hidden">
            <img
              src={resolveImageSource()}
              alt={t('profile_image') || ''}
              className="w-8 object-cover rounded-full"
            />
          </div>
          <div>
            <p className="text-[12px] tracking-[1px] font-medium p-2 bg-white rounded-[10px] w-[286px] leading-5 break-words mb-0">
              {resolveGreetingMessage()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreviewPanel;
