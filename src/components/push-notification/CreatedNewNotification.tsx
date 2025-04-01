import { useTranslation } from 'react-i18next';
import { lazy, Suspense } from 'react';
import Loading from 'components/shared/Loading';

// Lazy load the NotificationContent component
const NotificationContent = lazy(
  () => import('./notification-contents/NotificationContents')
);

interface CreatedNewNotificationProps {
  selectedType: string | null;
  setIsSelectedType: (value: string | null) => void;
}

const CreatedNewNotification = ({
  selectedType,
  setIsSelectedType,
}: CreatedNewNotificationProps) => {
  const { t } = useTranslation();

  // product item
  const productItem = [
    {
      label: t('push_Order'),
      value: 'order_status',
    },
    {
      label: t('push_Promotion'),
      value: 'product_promotion',
    },
    {
      label: t('push_General'),
      value: 'general',
    },
    {
      label: t('push_Payment'),
      value: 'payment',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center ">
        <h1 className="text-[24px] font-bold">{t('push_newNoti')}</h1>
        <p className="text-[18px] text-gray-700 flex items-center gap-1 font-normal">
          {t('product_type')} :
          <span className="text-black font-semibold">
            {
              productItem?.find(
                (item: Record<string, string>) => item?.value === selectedType
              )?.label
            }
          </span>
        </p>
      </div>

      {/* notification content section*/}
      <div className="relative -mt-4">
        <Suspense fallback={<Loading />}>
          <NotificationContent
            notificationType={selectedType}
            setIsSelectedType={setIsSelectedType}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default CreatedNewNotification;
