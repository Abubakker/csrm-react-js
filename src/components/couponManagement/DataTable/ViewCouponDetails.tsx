import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Radio } from 'antd';
import FormField from '../coupon-details/FormField';

// const authToken = localStorage.getItem("LOCAL_STORAGE_TOKEN_KEY");

const ViewCouponDetails = ({ CouponDetails }: any) => {
  const { t } = useTranslation();
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);

  const authToken = useMemo(
    () => localStorage.getItem('LOCAL_STORAGE_TOKEN_KEY') || '',
    []
  );

  useEffect(() => {
    if (!authToken) return;

    const fetchProductsAndCategories = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          axios.get(
            `${process.env.REACT_APP_IM_CHAT_BASE_API}/admin/pms/product/list?pageNum=1&pageSize=1000`,
            { headers: { Authorization: authToken } }
          ),
          axios.get(
            `${process.env.REACT_APP_IM_CHAT_BASE_API}/admin/pms/category/list?pageNum=1&pageSize=1000`,
            { headers: { Authorization: authToken } }
          ),
        ]);

        setProduct(
          productRes.data?.list?.map((item: { id: string; name: string }) => ({
            value: item.id,
            label: item.name,
          })) || []
        );
        setCategory(
          categoryRes.data?.list?.map((item: { id: string; name: string }) => ({
            value: item.id,
            label: item.name,
          })) || []
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProductsAndCategories();
  }, [authToken]);

  const selectedProductIds = new Set(CouponDetails?.product || []);
  const selectedCategoryIds = new Set(CouponDetails?.category || []);

  const products = product.filter(({ id }) => selectedProductIds.has(id));
  const categories = category.filter(({ value }) =>
    selectedCategoryIds.has(value)
  );

  return (
    <div className="space-y-4 border-t border-[#d3d5df] px-2">
      <div className="grid grid-cols-2 items-center gap-6 pt-8">
        {/* Title */}
        <FormField
          label={`${t('title')}`}
          type="input"
          value={CouponDetails.titleText}
          onChange={() => {}}
          placeholder={`${t('ecTit')}`}
          readOnly
        />

        {/* Coupon Code */}
        <FormField
          label={`${t('cCode')}`}
          type="input"
          value={CouponDetails.couponCode}
          onChange={() => {}}
          placeholder={`${t('eCCode')}`}
          readOnly
        />

        {/* Coupon Type */}
        <div>
          <label className="block text-[10px] tracking-[0.5px] font-medium mb-2 uppercase font-sans">
            {t('cType')}
          </label>
          <Radio.Group
            value={CouponDetails.couponType}
            className="grid grid-cols-2 gap-3"
          >
            <span
              className={`flex items-center tracking-[1px] h-[42px] ${
                CouponDetails.couponType === 'flat'
                  ? 'bg-white border border-[#DADDEB]'
                  : 'bg-transparent border border-[#DADDEB]'
              } rounded-[10px] px-3 w-full`}
            >
              <Radio
                value="flat"
                className="text-[12px] font-medium tracking-[1px]"
              >
                {t('fDis')}
              </Radio>
            </span>

            <span
              className={`flex items-center text-[12px] font-medium tracking-[1px] h-[42px] ${
                CouponDetails.couponType === 'percent'
                  ? 'bg-white border border-[#DADDEB]'
                  : 'bg-transparent border border-[#DADDEB]'
              } rounded-[10px] px-3 w-full`}
            >
              <Radio
                value="percent"
                className="text-[12px] font-medium tracking-[1px]"
              >
                {t('pescOff')}
              </Radio>
            </span>
          </Radio.Group>
        </div>

        {/* Discount Value */}
        <FormField
          label={`${t('disVal')}`}
          type="number"
          value={CouponDetails.discountValue}
          onChange={() => {}}
          placeholder={`${t('eDiVa')}`}
          readOnly
        />

        {/* Minimum Order Amount */}
        <FormField
          label={`{t('minOrd')}`}
          type="number"
          value={CouponDetails.minOrderAmount}
          onChange={() => {}}
          placeholder={`${t('eAmo')}`}
          readOnly
        />

        {/* Minimum Order Quantity */}
        <FormField
          label={`${t('minOQn')}`}
          type="number"
          value={CouponDetails.minOrderQuantity}
          onChange={() => {}}
          placeholder={`${t('enQun')}`}
          readOnly
        />

        {/* Category */}
        <FormField
          label={`t('product_categories')`}
          type="select"
          value={categories}
          onChange={() => {}}
          placeholder={`${t('select_items')}`}
          options={category}
          disabled
        />

        {/* Product */}
        <FormField
          label={`${t('product')}`}
          type="select"
          value={products}
          onChange={() => {}}
          placeholder={`${t('select_items')}`}
          options={product}
          disabled
        />

        {/* Duration */}
        <div className="custom-datepicker">
          <label className="block text-[10px] tracking-[0.5px] font-medium mb-2 uppercase font-sans">
            {t('duration')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              type="input"
              value={dayjs(CouponDetails.startDate).format('YYYY-MM-DD HH:mm')}
              onChange={() => {}}
              placeholder={`${t('startdateLow')}`}
              readOnly
            />
            <FormField
              type="input"
              value={dayjs(CouponDetails.endDate).format('YYYY-MM-DD HH:mm')}
              onChange={() => {}}
              placeholder={`${t('enddateLow')}`}
              readOnly
            />
          </div>
        </div>

        {/* Assign Limit */}
        <FormField
          label={`${t('asTit')}`}
          type="number"
          value={CouponDetails.assignLimit}
          onChange={() => {}}
          placeholder={`${t('eclim')}`}
          readOnly
        />
      </div>
    </div>
  );
};

export default ViewCouponDetails;
