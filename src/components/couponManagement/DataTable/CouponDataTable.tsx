import { lazy, memo, Suspense, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notification } from 'antd';
import dayjs from 'dayjs';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

import {
  useCreateCouponMutation,
  useGetCouponQuery,
  useUpdateCouponMutation,
} from 'store/Coupon-stores/couponApi';

import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { HiOutlinePlusSm } from 'react-icons/hi';

import SearchForm from './SearchForm';
import CouponTable from './CouponTable';
import { PaginationProps } from 'antd';
import './couponDataTable.css';

import StatusBadge from './StatusBadge';
import ActionDropdown from './ActionDropdown';
import Loading from 'components/shared/Loading';

const MemoizedActionDropdown = memo(ActionDropdown);
const MemoizedStatusBadge = memo(StatusBadge);

const CreateCoupon = lazy(() => import('../create-coupon/CreateCoupon'));
const ViewCoupon = lazy(() => import('./ViewCoupon'));

interface CouponDataTableProps {
  authToken: string;
  baseUrl: string;
}

export enum Status {
  Draft = 'Draft',
  Active = 'Active',
  Inactive = 'Inactive',
  Expired = 'Expired',
}

const CouponDataTable = ({ authToken, baseUrl }: CouponDataTableProps) => {
  const { t } = useTranslation();
  const [isCreated, setIsCreated] = useState<boolean>(false);
  const [viewCoupon, setViewCoupon] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState({
    keyword: '',
    status: '',
    applicable: '',
    pageNum: 1,
    pageSize: 10,
  });

  const { data: couponData, isLoading } = useGetCouponQuery(searchQuery);
  const [duplicateCouponItem] = useCreateCouponMutation();
  const [updateStatus, { isLoading: updateLoading }] =
    useUpdateCouponMutation();

  const timeAgo = useMemo(() => {
    TimeAgo.addDefaultLocale(en);
    return new TimeAgo('en-US');
  }, []);

  const { control, handleSubmit, reset } = useForm();

  const handleDuplicate = useCallback(
    async (duplicateCoupon: any) => {
      const couponData = {
        name: `${duplicateCoupon?.name}_clone`,
        count: Number(duplicateCoupon?.count),
        amount: Number(duplicateCoupon?.amount),
        startTime: dayjs(duplicateCoupon?.startDate).format('YYYY-MM-DD HH:mm'),
        endTime: dayjs(duplicateCoupon?.endDate).format('YYYY-MM-DD HH:mm'),
        code: `${duplicateCoupon?.code}_clone`,
        discountType: duplicateCoupon?.discountType,
        status: duplicateCoupon?.status,
        query: {
          filters: duplicateCoupon?.query,
        },
        productCategory: duplicateCoupon?.productCategory,
        product: duplicateCoupon?.product,
        minOrderQuantity: Number(duplicateCoupon?.minOrderQuantity),
      };

      if (couponData) {
        const response: any = await duplicateCouponItem({ data: couponData });
        const placement = 'bottomRight';

        if (response?.data) {
          notification.info({
            message: '',
            description: 'coupon duplicated',
            placement,
          });
        } else {
          notification.info({
            message: '',
            description: response?.error?.data?.message,
            placement,
          });
        }
      }
    },
    [duplicateCouponItem]
  );

  const handleStateChange = useCallback(
    async (status: string, id: string) => {
      const placement = 'bottomRight';
      const newStatus = status === 'Active' ? 'Inactive' : 'Active';

      const response: any = await updateStatus({
        id,
        data: { status: newStatus },
      });

      if (response?.data) {
        notification.info({
          message: '',
          description: 'Status updated',
          placement,
        });
      } else {
        notification.info({
          message: '',
          description: response?.error?.data?.message,
          placement,
        });
      }
    },
    [updateStatus]
  );

  const columns = useMemo(
    () => [
      {
        title: t('title'),
        dataIndex: 'title',
        key: 'title',
        width: 220,
      },
      {
        title: t('status'),
        dataIndex: 'status',
        key: 'status',
        render: (status: Status) => <MemoizedStatusBadge status={status} />,
        width: 161,
      },
      {
        title: t('appFor'),
        dataIndex: 'applicableFor',
        key: 'applicableFor',
        width: 161,
      },
      {
        title: t('duration'),
        dataIndex: 'duration',
        key: 'duration',
        width: 302,
      },
      {
        title: t('couponUsages'),
        dataIndex: 'couponUsages',
        key: 'couponUsages',
        width: 161,
      },
      {
        title: t('couponRemains'),
        dataIndex: 'couponRemains',
        key: 'couponRemains',
        width: 161,
      },
      {
        title: t('creation_time'),
        dataIndex: 'creationTime',
        key: 'creationTime',
        width: 222,
      },
      {
        title: t('created_by'),
        dataIndex: 'createdBy',
        key: 'createdBy',
        width: 142,
      },
      {
        title: t('action'),
        key: 'action',
        render: (item: any) => (
          <MemoizedActionDropdown
            item={item}
            handleDuplicate={handleDuplicate}
            handleStateChange={handleStateChange}
            setViewCoupon={setViewCoupon}
          />
        ),
        width: 82,
      },
    ],
    [t, handleDuplicate, handleStateChange, setViewCoupon]
  );

  const data = useMemo(() => {
    return (
      couponData?.data?.map((coupon: any) => {
        const createdAt = new Date(coupon?.createdAt);
        const creationTime = timeAgo.format(createdAt);
        return {
          key: coupon?.id,
          title: coupon?.name,
          status: coupon?.status,
          applicableFor: coupon?.product?.length > 0 ? 'product' : 'category',
          duration: `${dayjs(coupon?.startTime).format(
            'YYYY-MM-DD'
          )} to ${dayjs(coupon?.endTime).format('YYYY-MM-DD')}`,
          couponUsages: coupon?.count,
          couponRemains: 2,
          creationTime: creationTime,
          createdBy: coupon?.createdBy?.username,
          fullResponse: coupon,
        };
      }) || []
    );
  }, [couponData, timeAgo]);

  // Pagination change handler
  const handleTableChange = (pagination: PaginationProps) => {
    setSearchQuery((prev) => ({
      ...prev,
      pageNum: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    }));
  };

  const onSearchSubmit: SubmitHandler<FieldValues> = (data) => {
    setSearchQuery({
      status: data?.status,
      keyword: data?.keyword,
      applicable: data?.applicable,
      pageNum: data.pageNum,
      pageSize: data.pageSize,
    });
  };

  const handleReset = () => {
    reset();
    setSearchQuery({
      status: '',
      keyword: '',
      applicable: '',
      pageNum: 1,
      pageSize: 10,
    });
  };

  return (
    <div className="max-w-[1612px] mx-auto bg-white min-h-screen">
      {viewCoupon ? (
        <Suspense fallback={<Loading />}>
          <ViewCoupon viewCoupon={viewCoupon} setViewCoupon={setViewCoupon} />
        </Suspense>
      ) : !isCreated ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-[24px] font-bold font-sans">
                {t('cmanege')}
              </h2>
            </div>
            <div
              className={`px-6 py-3 rounded-[10px] items-center gap-[6px] bg-[#1677FF] hover:bg-[#086dfc] text-white text-[12px] font-bold inline-flex justify-center tracking-[1px] cursor-pointer h-[42px]`}
              onClick={() => setIsCreated(true)}
            >
              <HiOutlinePlusSm className="font-extrabold text-[17px] mt-[2px]" />
              <span>{t('cnc')}</span>
            </div>
          </div>
          <SearchForm
            control={control}
            handleSubmit={handleSubmit(onSearchSubmit)}
            handleReset={handleReset}
          />
          <CouponTable
            data={data}
            isLoading={isLoading}
            updateLoading={updateLoading}
            columns={columns}
            pagination={{
              current: couponData?.pageNum || 1,
              pageSize: searchQuery.pageSize,
              total: couponData?.total || 0,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              position: ['bottomRight'],
            }}
            onChange={handleTableChange}
          />
        </>
      ) : (
        <Suspense fallback={<Loading />}>
          <CreateCoupon
            setIsCreated={setIsCreated}
            authToken={authToken}
            baseUrl={baseUrl}
          />
        </Suspense>
      )}
    </div>
  );
};

export default CouponDataTable;
