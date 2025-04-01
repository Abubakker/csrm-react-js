import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { audiencefiltersItem } from 'constants/general-constants';
import { lowerCase } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import ViewCouponDetails from './ViewCouponDetails';
import editIcon from '../../../assets/icons/editIcon.svg';
import { notification } from 'antd';
import { useUpdateCouponMutation } from 'store/Coupon-stores/couponApi';
import dayjs from 'dayjs';
import EditControls from './EditControls';
import Header from './Header';
import SearchBar from './SearchBar';
import CouponTable from './CouponTable';
import AudienceView from './AudienceView';
import { Loading } from 'antd-mobile';

const AudienceComponent = lazy(() => import('components/shared/Audience'));
const CouponDetails = lazy(() => import('../coupon-details/CouponDetails'));

interface ViewCouponProps {
  setViewCoupon: (value: any) => void;
  viewCoupon: any;
}

export interface CouponDetailsType {
  titleText: string;
  couponCode: string;
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
  couponType: 'flat' | 'percent' | string;
  assignLimit: number | null;
  discountValue: number | null;
  maxDiscountAmount?: number | null;
  minOrderAmount: number | null;
  minOrderQuantity: number | null;
  category: any[];
  product: any[];
}

interface AudienceFilter {
  fieldName: string;
  condition: string;
  value: any;
}

interface TableData {
  key: string;
  userId: string;
  userName: string;
  email: string;
  totalAvailed: string;
}

const ViewCoupon: React.FC<ViewCouponProps> = ({
  setViewCoupon,
  viewCoupon,
}) => {
  const { t } = useTranslation();
  const [audience, setAudience] = useState<AudienceFilter[]>([]);
  const [couponDetails, setCouponDetails] = useState<CouponDetailsType>({
    titleText: '',
    couponCode: '',
    startDate: null,
    endDate: null,
    couponType: 'flat',
    minOrderAmount: 0,
    minOrderQuantity: 0,
    category: [],
    product: [],
    assignLimit: 0,
    discountValue: 0,
    maxDiscountAmount: 0,
  });
  const [editCouponDetails, setEditCouponDetails] = useState<boolean>(false);
  const [editAudience, setEditAudience] = useState<boolean>(false);
  const [updateCouponMutation] = useUpdateCouponMutation();

  // Initialize current data
  const currentdata: CouponDetailsType = {
    titleText: viewCoupon?.name || '',
    couponCode: viewCoupon?.code || '',
    startDate: viewCoupon?.startTime || '',
    endDate: viewCoupon?.endTime || '',
    couponType: lowerCase(viewCoupon?.discountType) || '',
    minOrderAmount: viewCoupon?.minOrderAmount || 0,
    minOrderQuantity: viewCoupon?.minOrderQuantity || 0,
    category: viewCoupon?.productCategory || [],
    product: viewCoupon?.product || [],
    assignLimit: viewCoupon?.count || 0,
    discountValue: viewCoupon?.amount || 0,
  };

  // Set initial data
  useEffect(() => {
    if (currentdata) setCouponDetails(currentdata);

    if (viewCoupon?.query) {
      const filters: AudienceFilter[] = viewCoupon.query.map((item: any) => {
        const fieldName =
          audiencefiltersItem.find((tr) => tr.original === item.field)
            ?.trname || '';
        return {
          fieldName: t(fieldName),
          condition: item.operator,
          value: item.value,
        };
      });
      setAudience(filters);
    }
  }, [viewCoupon]);

  // Update audience
  const updateAudience = useCallback(async () => {
    if (!audience.length) return;

    const data = {
      query: {
        filters: audience.map((item) => {
          const fieldName =
            audiencefiltersItem.find((tr) => t(tr.trname) === item.fieldName)
              ?.original || '';
          return {
            field: fieldName,
            operator: item.condition,
            value: item.value,
          };
        }),
      },
    };

    const res = await updateCouponMutation({ id: viewCoupon?.id, data });
    const placement = 'bottomRight';

    if ('data' in res) {
      notification.info({
        message: '',
        description: 'Update success',
        placement,
      });
      setEditAudience(false);
    } else {
      notification.info({
        message: '',
        description: (res.error as any)?.data?.message,
        placement,
      });
    }
  }, [audience, updateCouponMutation, viewCoupon, t]);

  // Update coupon details
  const updateCouponDetails = useCallback(async () => {
    if (!couponDetails) return;

    const couponData = {
      name: couponDetails.titleText,
      count: Number(couponDetails.assignLimit),
      amount: Number(couponDetails.discountValue),
      startTime: dayjs(couponDetails.startDate).format('YYYY-MM-DD HH:mm'),
      endTime: dayjs(couponDetails.endDate).format('YYYY-MM-DD HH:mm'),
      code: couponDetails.couponCode,
      discountType: couponDetails.couponType,
      productCategory: couponDetails.category || [],
      product: couponDetails.product || [],
      minOrderAmount: Number(couponDetails.minOrderAmount),
      minOrderQuantity: Number(couponDetails.minOrderQuantity),
    };

    const res = await updateCouponMutation({
      id: viewCoupon?.id,
      data: couponData,
    });
    const placement = 'bottomRight';

    if ('data' in res) {
      notification.info({
        message: '',
        description: 'Update success',
        placement,
      });
      setEditCouponDetails(false);
    } else {
      notification.info({
        message: '',
        description: (res.error as any)?.data?.message,
        placement,
      });
    }
  }, [couponDetails, updateCouponMutation, viewCoupon]);

  // Table columns and data
  const columns = useMemo(
    () => [
      { title: t('user_id_title'), dataIndex: 'userId', key: 'userId' },
      { title: t('user_name_title'), dataIndex: 'userName', key: 'userName' },
      { title: t('email_title'), dataIndex: 'email', key: 'email' },
      {
        title: t('total_availed_title'),
        dataIndex: 'totalAvailed',
        key: 'totalAvailed',
      },
    ],
    [t]
  );

  const data = useMemo<TableData[]>(
    () => [
      {
        key: '1',
        userId: 'ID 205',
        userName: 'John Doe',
        email: 'G1KQ3@example.com',
        totalAvailed: '12',
      },
      {
        key: '2',
        userId: 'ID 205',
        userName: 'John Doe',
        email: 'G1KQ3@example.com',
        totalAvailed: '12',
      },
      {
        key: '3',
        userId: 'ID 205',
        userName: 'John Doe',
        email: 'G1KQ3@example.com',
        totalAvailed: '12',
      },
    ],
    []
  );

  return (
    <div>
      {/* Header */}
      <Header
        onBack={() => setViewCoupon(null)}
        label={`${t('view_coupon')}`}
      />

      {/* Coupon Details Section */}
      <div className="max-w-[1020px] mx-auto p-6 bg-[#F7F8FC] rounded-[10px]">
        <div
          className={`flex justify-between ${editCouponDetails ? 'mb-3' : ''}`}
        >
          <h1 className="text-[24px]">{t('cdetails')}</h1>
          {editCouponDetails ? (
            <EditControls
              onSave={updateCouponDetails}
              onCancel={() => setEditCouponDetails(false)}
            />
          ) : (
            <img
              src={editIcon}
              alt="Edit"
              onClick={() => setEditCouponDetails(true)}
              className="cursor-pointer size-6 "
            />
          )}
        </div>
        {editCouponDetails ? (
          <Suspense fallback={<Loading />}>
            <CouponDetails
              couponDetails={couponDetails}
              setCouponDetails={setCouponDetails}
            />
          </Suspense>
        ) : (
          <ViewCouponDetails CouponDetails={couponDetails} />
        )}
      </div>

      {/* Audience Section */}
      <div className="max-w-[1020px] mx-auto p-6 bg-[#F7F8FC] mt-6 rounded-[10px]">
        <div
          className={`flex justify-between ${editCouponDetails ? 'mb-3' : ''}`}
        >
          <h1 className="text-[24px] ">{t('push_Audience')}</h1>
          {editAudience ? (
            <EditControls
              onSave={updateAudience}
              onCancel={() => setEditAudience(false)}
            />
          ) : (
            <img
              src={editIcon}
              alt="Edit"
              onClick={() => setEditAudience(true)}
              className="cursor-pointer size-6"
            />
          )}
        </div>
        {editAudience ? (
          <Suspense fallback={<Loading />}>
            <AudienceComponent
              audience={audience}
              setAudience={setAudience}
              audienceType={t('coupon')}
            />
          </Suspense>
        ) : (
          <AudienceView filters={audience} />
        )}
      </div>

      {/* Search and Table Section */}
      <SearchBar />

      <div className="custom-table mt-6">
        {/* Table */}
        <CouponTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default ViewCoupon;
