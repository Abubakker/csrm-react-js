import { lazy, Suspense, useEffect, useState } from 'react';

import { HiOutlinePlusSm } from 'react-icons/hi';
import couponIcon from '../../assets/icons/receipt-disscount.svg';
import CouponDataTable from 'components/couponManagement/DataTable/CouponDataTable';
import { useTranslation } from 'react-i18next';
import { useGetCouponQuery } from 'store/Coupon-stores/couponApi';
import { useDispatch } from 'react-redux';
import {
  resetAuthToken,
  resetBaseUrl,
  storeAuthToken,
  storeBaseUrl,
} from 'store/im-chat-stores/imManagerSettingsSlice';
import Loading from 'components/shared/Loading';

const CreateCoupon = lazy(
  () => import('components/couponManagement/create-coupon/CreateCoupon')
);

const CouponManagement = ({
  authToken,
  baseUrl,
}: {
  authToken: string;
  baseUrl: string;
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetAuthToken());
    dispatch(resetBaseUrl());

    if (authToken) {
      dispatch(storeBaseUrl(baseUrl));
      dispatch(storeAuthToken(authToken));
    }
  }, [baseUrl, authToken]);

  const { t } = useTranslation();
  const [isCreated, setIsCreated] = useState<boolean>(false);
  // get coupon data
  const { data: couponData, isLoading } = useGetCouponQuery({
    pageNum: 1,
    pageSize: 1,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="-mx-8 -mt-10 bg-white min-h-[calc(100vh-64px)] w-full  overflow-hidden ">
      <div className=" max-w-[1920px] p-6 mx-auto">
        {couponData?.data.length > 0 ? (
          <CouponDataTable authToken={authToken} baseUrl={baseUrl} />
        ) : (
          <div>
            {!isCreated ? (
              <div className="min-h-[75vh] flex items-center justify-center">
                <div className="flex flex-col justify-center items-center">
                  <img
                    src={couponIcon}
                    alt="couponIcon"
                    className="size-[120px]"
                  />
                  <p className="text-[15px] font-normal mt-1">{t('nyco')}</p>

                  {/* create new coupon yet */}
                  <div
                    className={`px-6 py-3 rounded-[10px] items-center gap-[6px] 
                             bg-[#1677FF] hover:bg-[#086dfc] text-white
                           text-[12px] font-bold inline-flex justify-center tracking-[1px] -mt-2 cursor-pointer h-[42px]`}
                    onClick={() => setIsCreated(true)}
                  >
                    <span className="font-extrabold text-[16px] mt-[1px]">
                      <HiOutlinePlusSm />
                    </span>
                    <span className="-mt-[1px]">{t('cnc')}</span>
                  </div>
                </div>
              </div>
            ) : (
              // created form
              <Suspense fallback={<Loading />}>
                <CreateCoupon
                  setIsCreated={setIsCreated}
                  authToken={authToken}
                  baseUrl={baseUrl}
                />
              </Suspense>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponManagement;
