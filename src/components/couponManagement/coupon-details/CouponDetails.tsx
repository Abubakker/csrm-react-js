import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import axios from 'axios';
import FormField from './FormField';
import RadioGroup from './RadioGroup';
import DateRange from './DateRange';
import { CouponDetailsType } from '../DataTable/ViewCoupon';

import '../style.css';

const authToken = localStorage.getItem('LOCAL_STORAGE_TOKEN_KEY');

interface CouponDetailsProps {
  couponDetails?: Partial<CouponDetailsType>;
  setCouponDetails: Dispatch<SetStateAction<CouponDetailsType>>;
  discard?: boolean;
  setDiscard?: Dispatch<SetStateAction<boolean>>;
}

const CouponDetails = ({
  setCouponDetails,
  couponDetails,
  discard,
  setDiscard,
}: CouponDetailsProps) => {
  const { t } = useTranslation();
  const [productData, setProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [formData, setFormData] = useState<CouponDetailsType>({
    titleText: '',
    couponCode: '',
    startDate: null,
    endDate: null,
    couponType: 'flat',
    assignLimit: null,
    discountValue: 0,
    maxDiscountAmount: 0,
    minOrderAmount: 0,
    minOrderQuantity: 0,
    category: [],
    product: [],
  });

  // Handle discard
  const resetForm = useCallback(() => {
    setFormData({
      titleText: couponDetails?.titleText || '',
      couponCode: couponDetails?.couponCode || '',
      startDate: couponDetails?.startDate
        ? dayjs(couponDetails.startDate)
        : null,
      endDate: couponDetails?.endDate ? dayjs(couponDetails.endDate) : null,
      couponType: couponDetails?.couponType || 'flat',
      assignLimit: couponDetails?.assignLimit || null,
      discountValue: couponDetails?.discountValue || null,
      maxDiscountAmount: couponDetails?.maxDiscountAmount || null,
      minOrderAmount: couponDetails?.minOrderAmount || null,
      minOrderQuantity: couponDetails?.minOrderQuantity || null,
      category: couponDetails?.category || [],
      product: couponDetails?.product || [],
    });
    setDiscard?.(false);
  }, [couponDetails, setDiscard]);

  useEffect(() => {
    if (discard) resetForm();
  }, [discard, resetForm]);

  // Set default data
  useEffect(() => {
    if (couponDetails) {
      setFormData({
        titleText: couponDetails?.titleText || '',
        couponCode: couponDetails?.couponCode || '',
        startDate: couponDetails?.startDate
          ? dayjs(couponDetails.startDate)
          : null,
        endDate: couponDetails?.endDate ? dayjs(couponDetails.endDate) : null,
        couponType: couponDetails?.couponType || 'flat',
        assignLimit: couponDetails?.assignLimit || null,
        discountValue: couponDetails?.discountValue || null,
        maxDiscountAmount: couponDetails?.maxDiscountAmount || null,
        minOrderAmount: couponDetails?.minOrderAmount || null,
        minOrderQuantity: couponDetails?.minOrderQuantity || null,
        category:
          couponDetails?.category?.map((cat: any) => ({
            value: cat.id,
            label: cat.name,
          })) || [],
        product:
          couponDetails?.product?.map((prod: any) => ({
            value: prod.id,
            label: prod.name,
          })) || [],
      });
    }
  }, []);

  // Update parent
  useEffect(() => {
    setCouponDetails(formData);
  }, [formData]);

  const handleChange = (
    field: string,
    value: number | string | dayjs.Dayjs | null
  ) => {
    if (value !== undefined && value !== null) {
      setFormData((prevData: any) => ({
        ...prevData,
        [field]: value,
      }));
    }
  };

  // Data fetching and options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          axios.get(
            `${process.env.REACT_APP_IM_CHAT_BASE_API}/admin/pms/product/list?pageNum=1&pageSize=100`,
            { headers: { Authorization: authToken } }
          ),
          axios.get(
            `${process.env.REACT_APP_IM_CHAT_BASE_API}/admin/pms/category/list?pageNum=1&pageSize=1000`,
            { headers: { Authorization: authToken } }
          ),
        ]);

        const categoryOptions = categoryResponse.data?.list?.map(
          (category: any) => ({
            value: category?.id,
            label: category?.name,
          })
        );

        const productOptions = productResponse.data.list?.map(
          (product: any) => ({
            value: product?.id,
            label: product?.name,
          })
        );

        setCategoryData(categoryOptions);
        setProductData(productOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const disabledDate = (current: dayjs.Dayjs) =>
    current < dayjs().startOf('day');

  return (
    <div className="m-2 space-y-4 border-t border-[#d3d5df] -mt-3">
      <div className="grid grid-cols-2 items-center gap-6 pt-8">
        <FormField
          label={t('title') || ''}
          type="input"
          value={formData.titleText}
          onChange={(value) => handleChange('titleText', value)}
          placeholder={t('ecTit') || ''}
        />

        <FormField
          label={t('cCode') || ''}
          type="input"
          value={formData.couponCode}
          onChange={(value) => handleChange('couponCode', value)}
          placeholder={t('eCCode') || ''}
        />

        <div>
          <label className="block text-[10px] tracking-[0.5px] font-medium mb-2 uppercase font-sans">
            {t('cType')}
          </label>
          <RadioGroup
            options={[
              { value: 'flat', label: t('fDis') },
              { value: 'percent', label: t('pescOff') },
            ]}
            value={formData.couponType}
            onChange={(value) => handleChange('couponType', value)}
          />
        </div>

        <div
          className={`${
            formData.couponType === 'percent' ? 'flex' : ''
          } gap-4 justify-between`}
        >
          <FormField
            label={t('disVal') || ''}
            type="number"
            value={formData.discountValue}
            onChange={(value: number) => handleChange('discountValue', value)}
            placeholder={t('eDiVa') || ''}
            min={1}
            precision={0}
          />
          {formData.couponType === 'percent' && (
            <FormField
              label={t('max_discount_amount') || ''}
              type="number"
              value={formData.maxDiscountAmount}
              onChange={(value: number) =>
                handleChange('maxDiscountAmount', value)
              }
              placeholder={t('enter_amount') || ''}
              min={1}
              precision={0}
            />
          )}
        </div>

        <FormField
          label={t('minOrd') || ''}
          type="number"
          value={formData.minOrderAmount}
          onChange={(value) => handleChange('minOrderAmount', value)}
          placeholder={t('eAmo') || ''}
          min={1}
          precision={0}
        />

        <FormField
          label={t('minOQn') || ''}
          type="number"
          value={formData.minOrderQuantity}
          onChange={(value) => handleChange('minOrderQuantity', value)}
          placeholder={t('enQun') || ''}
          min={1}
          precision={0}
        />

        <FormField
          label={t('product_categories') || ''}
          type="select"
          mode="tags"
          options={categoryData}
          value={formData.category}
          onChange={(value) => handleChange('category', value)}
          disabled={formData.product.length > 0}
          placeholder={t('secat') || ''}
        />

        <FormField
          label={t('product') || ''}
          type="select"
          mode="tags"
          options={productData}
          value={formData.product}
          onChange={(value) => {
            handleChange('product', value);
          }}
          disabled={formData.category.length > 0}
          placeholder={t('sPro') || ''}
        />

        <div className="custom-datepicker">
          <label className="block text-[10px] tracking-[0.5px] font-medium mb-2 uppercase font-sans">
            {t('duration')}
          </label>
          <DateRange
            startDate={formData.startDate}
            endDate={formData.endDate}
            onStartChange={(date) => handleChange('startDate', date)}
            onEndChange={(date) => handleChange('endDate', date)}
            disabledDate={disabledDate}
          />
        </div>

        <FormField
          label={t('asTit') || ''}
          type="number"
          value={formData.assignLimit}
          onChange={(value: number) => handleChange('assignLimit', value)}
          placeholder={t('eclim') || ''}
          min={1}
          precision={0}
        />
      </div>
    </div>
  );
};

export default CouponDetails;
