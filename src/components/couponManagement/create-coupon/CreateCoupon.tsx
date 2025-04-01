import { lazy, Suspense, useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useCreateCouponMutation } from 'store/Coupon-stores/couponApi';
import { notification } from 'antd';
import { audiencefiltersItem } from 'constants/general-constants';
import CouponSection from './CouponSection';
import Button from './Button';
import DiscardModal from './DiscardModal';
import { Loading } from 'antd-mobile';

const AudienceComponent = lazy(() => import('components/shared/Audience'));
const CouponDetails = lazy(() => import('../coupon-details/CouponDetails'));

interface CreateCouponProps {
  setIsCreated: (value: boolean) => void;
  authToken: string;
  baseUrl: string;
}

const CreateCoupon = ({
  setIsCreated,
  authToken,
  baseUrl,
}: CreateCouponProps) => {
  const { t } = useTranslation();
  const [audience, setAudience] = useState([]);
  const [couponDetails, setCouponDetails] = useState<any>({});
  const [openCouponTab, setOpenCouponTab] = useState(1);
  const [CreateCoupon] = useCreateCouponMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discard, setDiscard] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleDiscard = () => {
    setCouponDetails({});
    setAudience([]);
    setDiscard(true);
    handleCancel();
    setIsCreated(false);
  };

  const couponsContain = [
    {
      id: 1,
      name: t('cdetails'),
      subTitle: t('cdsTit'),
      content: (
        <Suspense fallback={<Loading />}>
          <CouponDetails
            couponDetails={couponDetails}
            setCouponDetails={setCouponDetails}
            discard={discard}
            setDiscard={setDiscard}
          />
        </Suspense>
      ),
    },
    {
      id: 2,
      name: t('push_Audience'),
      subTitle: t('daud'),
      content: (
        <Suspense fallback={<Loading />}>
          <AudienceComponent
            audience={audience}
            setAudience={setAudience}
            audienceType={t('coupon')}
            authToken={authToken}
            baseUrl={baseUrl}
            discard={discard}
            setDiscard={setDiscard}
          />
        </Suspense>
      ),
    },
  ];

  const handleCreate = useCallback(
    async (status: string) => {
      const startDate = couponDetails.startDate;
      const endDate = couponDetails.endDate;

      console.log({ couponDetails });

      if (!couponDetails?.titleText || !couponDetails?.couponCode) {
        notification.error({
          message: '',
          description: t('title_and_code_req_msg'),
          duration: 2,
          placement: 'bottomRight',
        });
        return;
      }

      if (!startDate) {
        notification.error({
          message: '',
          description: t('start_date_req_msg'),
          duration: 2,
          placement: 'bottomRight',
        });
        return;
      }

      if (startDate && endDate && startDate > endDate) {
        notification.error({
          message: '',
          description: t('start_date_must_be_before_end_date'),
          duration: 2,
          placement: 'bottomRight',
        });
        return;
      }

      if (Number(couponDetails?.discountValue) <= 0) {
        notification.error({
          message: t('validation_error'),
          description: t('discount_value_validation'),
          duration: 2,
          placement: 'bottomRight',
        });
        return;
      }

      if (Number(couponDetails?.minOrderAmount) <= 0) {
        notification.error({
          message: t('validation_error'),
          description: t('minimum_order_amount_validation'),
          duration: 2,
          placement: 'bottomRight',
        });
        return;
      }

      if (Number(couponDetails?.minOrderQuantity) <= 0) {
        notification.error({
          message: t('validation_error'),
          description: t('minimum_order_quantity_validation'),
          duration: 2,
          placement: 'bottomRight',
        });
        return;
      }

      if (Number(couponDetails?.assignLimit) <= 0) {
        notification.error({
          message: t('validation_error'),
          description: t('assign_limit_validation'),
          duration: 2,
          placement: 'bottomRight',
        });
        return;
      }

      if (
        Number(couponDetails?.discountValue) >
        Number(couponDetails?.minOrderAmount)
      ) {
        notification.error({
          message: t('validation_error'),
          description: t('discount_value_with_order_amount_validation'),
          duration: 2,
          placement: 'bottomRight',
        });
        return;
      }

      const couponData = {
        name: couponDetails?.titleText,
        count: Number(couponDetails?.assignLimit),
        amount: Number(couponDetails?.discountValue),
        startTime: dayjs(couponDetails?.startDate).format('YYYY-MM-DD HH:mm'),
        endTime: dayjs(couponDetails?.endDate).format('YYYY-MM-DD HH:mm'),
        code: couponDetails?.couponCode,
        discountType: couponDetails?.couponType,
        status: status,
        query: {
          filters: audience?.map((item: any) => {
            const fieldName = audiencefiltersItem?.find(
              (tr) => t(tr.trname) === item?.fieldName
            )?.original;
            return {
              field: fieldName,
              operator: item?.condition,
              value: item?.value,
            };
          }),
        },
        productCategory: couponDetails?.category || [],
        product: couponDetails?.product || [],
        minOrderAmount: Number(couponDetails?.minOrderAmount),
        minOrderQuantity: Number(couponDetails?.minOrderQuantity),
      };

      if (couponData) {
        const response: any = await CreateCoupon({ data: couponData });

        if (response?.data) {
          notification.info({
            message: '',
            description: 'new coupon created',
            placement: 'bottomRight',
          });
          setIsCreated(false);
        } else {
          notification.info({
            message: '',
            description: response?.error?.data?.message,
            placement: 'bottomRight',
          });
        }
      }
    },
    [couponDetails, audience, t, CreateCoupon, setIsCreated]
  );

  return (
    <div className="min-h-full p-8">
      <section className="max-w-[1020px] mx-auto">
        <section className="space-y-6">
          {couponsContain.map((item) => (
            <CouponSection
              key={item.id}
              id={item.id}
              name={item.name}
              subTitle={item.subTitle}
              content={item.content}
              isOpen={openCouponTab === item.id}
              onToggle={setOpenCouponTab}
            />
          ))}
        </section>

        <div className="flex justify-between mt-8">
          <Button variant="danger" onClick={showModal}>
            {t('discard')}
          </Button>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => handleCreate('Draft')}>
              {t('sasd')}
            </Button>
            <Button variant="primary" onClick={() => handleCreate('Active')}>
              {t('push_Create')}
            </Button>
          </div>

          <DiscardModal
            isOpen={isModalOpen}
            onCancel={handleCancel}
            onConfirm={handleDiscard}
            title={t('discardCouTit')}
            message={t('disCouSub')}
          />
        </div>
      </section>
    </div>
  );
};

export default CreateCoupon;
