import { useState, useEffect, useCallback } from 'react';
import { fetchRecycleOrderDetail } from 'apis/oms';
import { getMemberById } from 'apis/ums';
import {
  OmsRecycleOrderDetail,
  OmsRecycleOrderBaseInfo,
  OmsRecycleOrderCustomerInfo,
  OmsRecycleOrderUserProductInfo,
  OmsRecycleOrderValuationInfo,
  OmsRecycleOrderProductInfo,
  OmsRecycleOrderLogisticsInfo,
  OmsRecycleOrderLogInfo,
  OmsRecycleOrderContractInfo,
  OmsRecycleOrderCollectionInfo,
} from 'types/oms';
import {
  OrderType,
  StatusMapping,
  ShopMaping,
  ProductImageSort,
  AccessoriesMapping,
  getRecycleOrderStatusText,
  createdFromList,
  OMS_RECYCLE_ORDER_STATUS_MAP,
} from 'constants/RecyclingConsignment';
import dayjs from 'dayjs';
import { thousands } from 'utils/tools';
import { UmsMember } from 'types/ums';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { useAppSelector } from 'store/hooks';
import { getCityListByCountryCode } from 'apis/home';
import { MallCity } from 'types/home';
import useProductFormDataV2 from 'commons/hooks/useProductFormDataV2';
import GetPaymentInfo from 'utils/getPaymentInfo';
import i18n from '../../../i18n';
import LOCALS from '../../../commons/locals';
import { getLocalStorageLanguage } from '../../../commons';

const timeFormat = 'YYYY-MM-DD HH:mm';

const getTimeFormat = (date?: string): string => {
  if (!date) return '-';
  return dayjs(date).format(timeFormat);
};

const useHandleDetailData = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(false);
  /** 城市国家相关 */
  const { countryOptions, staffSelectOptions } =
    useAppSelector(selectGlobalInfo);

  const { setProdInfo, LabelData } = useProductFormDataV2();
  const [fullStamp, setFullStamp] = useState('');

  const [cityList, setCityList] = useState<MallCity[]>([]);
  /** 源数据 */
  const [dataSource, setDataSource] = useState<OmsRecycleOrderDetail>({});
  /** 客户数据 */
  const [memberData, setMemberData] = useState<UmsMember>();
  /** 当前步骤 */
  const [currentStep, setCurrentStep] = useState(0);
  /** 基础信息 */
  const [baseInfo, setBaseInfo] = useState<OmsRecycleOrderBaseInfo>({});
  /**客户信息 */
  const [customerInfo, setCustomerInfo] = useState<OmsRecycleOrderCustomerInfo>(
    {}
  );
  /** 用户提交商品信息 */
  const [userProductInfo, setUserProductInfo] =
    useState<OmsRecycleOrderUserProductInfo>({});
  /** 商品信息 */
  const [productInfo, setProductInfo] = useState<OmsRecycleOrderProductInfo>(
    {}
  );
  /* 估值信息 */
  const [valuationInfo, setValuationInfo] =
    useState<OmsRecycleOrderValuationInfo>({});
  /** 物流信息 */
  const [logisticsInfo, setLogisticsInfo] =
    useState<OmsRecycleOrderLogisticsInfo>({});
  /** 退货信息 */
  const [returnGoodsInfo, setReturnGoods] =
    useState<OmsRecycleOrderLogisticsInfo>({});
  /** 收款信息 */
  const [collectionInfo, setCollectionInfo] =
    useState<OmsRecycleOrderCollectionInfo>({});
  /** 日志信息 */
  const [logList, setLogList] = useState<OmsRecycleOrderLogInfo[]>([]);
  /** 合同信息 */
  const [contractList, setContractList] = useState<
    OmsRecycleOrderContractInfo[]
  >([]);

  useEffect(() => {
    if (
      Object.keys(dataSource).length > 0 &&
      memberData &&
      Object.keys(memberData).length > 0
    ) {
      const {
        omsRecycleOrder,
        omsRecycleOrderItem,
        omsRecycleOrderLogList,
        omsRecycleOrderLogistics,
        omsRecycleOrderProduct,
        umsMember,
        umsAdmin,
      } = dataSource;
      const emailMember = memberData?.email;
      if (omsRecycleOrder && omsRecycleOrderItem) {
        const {
          code,
          type,
          status = 0,
          createTime,
          memberId,
          storeId = 0,
          socialAccount,
          socialName,
          email,
          phone,
          currency,
          phaseType,
          financialPaymentVoucher = '',
          settlementType = 0,
          returnExpressCompany,
          returnTrackingNumber,
          returnVoucher = '',
          returnType = -1,
          createdFrom = 0,
          financialPaymentTime,
          orderId,
          orderSn,
          returnTime,
          completeTime,
          memberCredentialNo,
          contractExpirationTime,
          contractLinkShopAdmin,
          contractLinkShopMember,
          contractLinkWebsite,
          firstValuationTime,
          goodsReceivedTime,
          receiverName,
          orderCancelType,
          memberRemark,
        } = omsRecycleOrder || {};
        const {
          productAccessories,
          productPics,
          storeReceiptPics,
          productTitle,
          finalRecyclePrice,
          finalSalePrice,
          maxRecyclePrice,
          maxSalePrice,
          minRecyclePrice,
          minSalePrice,
          agreeFinalValuationTime,
          agreeFirstValuationTime,
          productId,
          firstValuationShopRemark,
          firstValuationStock = 0,
          firstValuationStockRemark,
          productStatus = 0,
          finalValuationTime,
        } = omsRecycleOrderItem;
        const {
          shippingDocument = '[]',
          name,
          city,
          country,
          detailAddress,
          postCode,
          phone: LogisticsPhone,
          receiptPics,
        } = omsRecycleOrderLogistics || {};
        /** 步骤条处理 */
        if (status) {
          let stop = phaseType || 1;
          // 阶段类型 : 1-咨询，2-意向，3-合同 4-交易完成 5-取消订单 ,  下标从0开始
          if ([4, 5].includes(stop) || orderCancelType) {
            stop = 4;
          }
          setCurrentStep(stop - 1);
        }
        /** 基础信息 */
        const baseInfo = {
          code,
          type: OrderType.find((d) => d.value === type)?.label,
          status: getRecycleOrderStatusText(omsRecycleOrder),
          store: ShopMaping[storeId],
          intentionTime: getTimeFormat(agreeFirstValuationTime),
          contractTime: getTimeFormat(agreeFinalValuationTime),
          tradingTime: getTimeFormat(completeTime),
          relatedSalesOrder: orderSn,
          orderId,
          associatedProductId: productId ? `${productId}` : '',
          channel: createdFromList[createdFrom]?.label || '-',
          postStore: ShopMaping[storeId],
          productId,
          createTime: getTimeFormat(createTime),
          createId: '',
          createBy: '',
          createOwner: '',
        };
        // umsAdmin umsMember 都表示订单创建人
        // umsMember 表示订单用户
        if (umsAdmin) {
          baseInfo.createBy = umsAdmin.username;
          // baseInfo.createId = umsAdmin.id + ''; // 不让跳转
          baseInfo.createOwner = 'admin';
        } else {
          const { lastName = '', firstName = '', email = '' } = umsMember || {};
          baseInfo.createBy = lastName + firstName || email || '-';
          baseInfo.createId = umsMember?.id + '';
          baseInfo.createOwner = 'member';
        }
        setBaseInfo(baseInfo);
        /** 客户提交的信息 */
        const customerInfo = {
          name:
            dataSource.omsRecycleOrder?.name ||
            dataSource.omsRecycleOrderLogistics?.name,
          memberId,
          emailMember,
          socialAccount,
          socialName,
          social: `${socialName || ''} ${socialAccount || ''}`,
          email,
          phone: phone ? `+${phone.replace('+', '')}` : '-',
          code: memberCredentialNo,
        };
        setCustomerInfo(customerInfo);
        /** 用户提交商品信息 */
        let picList: string[] = [];
        if (productPics) {
          const picListParse = JSON.parse(productPics);
          // 处理图片顺序
          ProductImageSort.forEach((d) => {
            if (picListParse[d]) picList.push(picListParse[d]);
          });
        }
        const storeReceiptPicsList = storeReceiptPics
          ? JSON.parse(storeReceiptPics)
          : '';
        const accessoriesList = productAccessories
          ? JSON.parse(productAccessories).map(
              (d: string) => AccessoriesMapping[d]
            )
          : [];
        const userProductInfo = {
          rank: ['', i18n.t(LOCALS.unused), i18n.t(LOCALS.secondhand)][
            productStatus
          ],
          productAccessories,
          accessoriesList: accessoriesList.join('、'),
          productPics,
          picList,
          productTitle,
          memberRemark,
          storeReceiptPics,
          storeReceiptPicsList,
        };
        setUserProductInfo(userProductInfo);

        /** 实际商品信息 */
        if (LabelData) {
          const language = getLocalStorageLanguage();
          const { i18nList } = dataSource;
          const attrRankDesc =
            i18nList?.find((i) => i.lang === language)?.attrRankDesc ||
            omsRecycleOrderProduct?.attrRankDesc ||
            '';

          const color = LabelData.colorSelectLabelList?.join(',') || '';
          const rank = LabelData.rankSelectLabel;
          const material = LabelData.materialSelectLabelList?.join(',') || '';
          const hardware = LabelData.hardwareSelectLabel?.join(',') || '';
          const stamp = LabelData.stampSelectLabel;
          const info = [
            { label: i18n.t(LOCALS.color), value: color },
            {
              label: i18n.t(LOCALS.rank),
              value: rank,
            },
            { label: i18n.t(LOCALS.rank_desc), value: attrRankDesc },
            { label: i18n.t(LOCALS.material), value: material },
            { label: i18n.t(LOCALS.hardware), value: hardware },
            {
              label: i18n.t(LOCALS.stamp),
              value: stamp,
            },
            {
              label: i18n.t(LOCALS.ZPgEroRALL),
              value: omsRecycleOrderProduct?.fullStamp,
            },
          ];
          const category = LabelData.productCategorySelectLabelList;
          const accessory = LabelData.accessorySelectLabel?.join(',') || '';
          const attrSize = LabelData.productCategorySelectList?.size || '';
          const productInfo = {
            picList,
            category,
            accessoriesList: accessory,
            attrSize,
            info,
            firstValuationShopRemark,
            firstValuationStock: [
              '',
              i18n.t(LOCALS.unavailable),
              i18n.t(LOCALS.available),
            ][firstValuationStock],
            firstValuationStockRemark,
            fullStamp,
          };
          setProductInfo(productInfo);
        }
        /** 估值信息 */
        const valuationInfo = {
          createTime: getTimeFormat(firstValuationTime),
          finalRecyclePrice: thousands(finalRecyclePrice),
          finalSalePrice: thousands(finalSalePrice),
          maxRecyclePrice,
          maxSalePrice,
          minRecyclePrice,
          minSalePrice,
          currency,
          modifyTime: getTimeFormat(finalValuationTime),
          RecyclePrice: '',
          SalePrice: '',
        };
        if (minRecyclePrice && maxRecyclePrice) {
          valuationInfo.RecyclePrice = `${thousands(
            minRecyclePrice
          )}~${thousands(maxRecyclePrice)}`;
        }
        if (minSalePrice && maxSalePrice) {
          valuationInfo.SalePrice = `${thousands(minSalePrice)}~${thousands(
            maxSalePrice
          )}`;
        }
        setValuationInfo(valuationInfo);
        /** 物流信息 */
        const imgList = JSON.parse(shippingDocument) || [];
        const logisticsInfo: OmsRecycleOrderLogisticsInfo = {
          name,
          phone: LogisticsPhone ? `+${LogisticsPhone}` : '-',
          postCode,
          country:
            countryOptions.find((d) => d.value === country)?.label || country,
          city: cityList.find((d) => d.code === city)?.name || city,
          detailAddress,
          mailingInfoPhoto:
            imgList.length === 2 ? [imgList[1]].filter((i) => !!i) : '',
          cargoInfoPhoto:
            imgList.length === 2 ? [imgList[0]].filter((i) => !!i) : '',
          status:
            status > 3 || receiptPics ? i18n.t(LOCALS.goods_received) : '-',
          receivingPhoto: JSON.parse(receiptPics || '[]'),
          createTime: getTimeFormat(goodsReceivedTime),
          memberId,
          receiverName,
        };
        setLogisticsInfo(logisticsInfo);
        /** 退货信息*/
        const returnGoodsInfo = {
          returnExpressCompany,
          returnTrackingNumber,
          returnVoucher: JSON.parse(returnVoucher),
          cargoInfoPhoto: JSON.parse(shippingDocument),
          returnType: [
            i18n.t(LOCALS.normal_transaction),
            i18n.t(LOCALS.in_store_pickup),
            i18n.t(LOCALS.mail),
          ][returnType],
          time: getTimeFormat(returnTime),
        };
        setReturnGoods(returnGoodsInfo);
        /** 收款信息 */
        const price =
          type === 2 ? thousands(finalRecyclePrice) : thousands(finalSalePrice);
        let PaymentInfo = GetPaymentInfo({
          ...omsRecycleOrder,
        });
        let collectionInfoStatus = '';
        // 交易完成
        if (status === OMS_RECYCLE_ORDER_STATUS_MAP.COMPLETE) {
          collectionInfoStatus = i18n.t(LOCALS.payment_completed);
        } else {
          // 现金打款 直接已打款
          if (settlementType === 1) {
            collectionInfoStatus = i18n.t(LOCALS.payment_completed);
          } else {
            collectionInfoStatus = financialPaymentVoucher
              ? i18n.t(LOCALS.payment_completed)
              : i18n.t(LOCALS.pending_payment_r);
          }
        }
        const collectionInfo = {
          financialPaymentInfo: PaymentInfo,
          financialPaymentAmount: type ? `${currency} ${price}` : '-',
          financialPaymentVoucher: JSON.parse(financialPaymentVoucher),
          settlementType: [
            '',
            i18n.t(LOCALS.cash),
            i18n.t(LOCALS.accounting_settlement),
          ][settlementType],
          time: getTimeFormat(financialPaymentTime),
          status: collectionInfoStatus,
        };
        setCollectionInfo(collectionInfo);
        /** 合同信息 */
        let contractStatus = '-';
        if ([1, 2, 3, 4, 5, 10, 11, 12, 13, 14].includes(status))
          contractStatus = '-';
        if ([6, 7, 8, 9].includes(status))
          contractStatus = i18n.t(LOCALS.in_effect);
        const contract = {
          time: getTimeFormat(contractExpirationTime),
          url: contractLinkWebsite,
          contractLinkShopAdmin,
          contractLinkShopMember,
          status: contractStatus,
          type,
        };
        console.log('🚀  useEffect  contract.status:', status);
        setContractList([contract]);
      }
      /** 日志信息 */
      if (omsRecycleOrderLogList) {
        const logList: OmsRecycleOrderLogInfo[] = [];

        omsRecycleOrderLogList.forEach((d) => {
          const {
            createTime,
            memberRemark,
            createBy,
            shopRemark,
            memberId,
            id,
            beforeStatus,
            afterStatus,
            name,
          } = d;
          // const createByName =
          //   staffSelectOptions.find((d) => d.value === createBy)?.label ||
          //   createBy;
          const personnel = createBy
            ? `${i18n.t(LOCALS.shop)}：${name}`
            : memberId
            ? i18n.t(LOCALS.user)
            : i18n.t(LOCALS.system);
          const remark = memberRemark || shopRemark || '-';
          logList.push({
            time: getTimeFormat(createTime),
            personnel,
            remark,
            id,
            statusChage: `${
              beforeStatus ? StatusMapping[beforeStatus] : '-'
            } -> ${afterStatus ? StatusMapping[afterStatus] : '-'}`,
          });
        });
        setLogList(logList);
      }
    }
  }, [
    dataSource,
    memberData,
    countryOptions,
    cityList,
    staffSelectOptions,
    LabelData,
    fullStamp,
  ]);

  /** 加载接口 */
  const getDetail = useCallback(() => {
    setLoading(true);
    fetchRecycleOrderDetail({ id })
      .then((data) => {
        setDataSource(data.data);
        /** 加载会员信息 */
        getMemberDetail(data.data?.omsRecycleOrder?.memberId || 0);
        /** 城市信息 */
        getCityList(data.data?.omsRecycleOrderLogistics?.country || '');
        //
        setProdInfo(data.data?.omsRecycleOrderProduct || {});
        setFullStamp(data.data.omsRecycleOrderProduct?.fullStamp || '');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, setProdInfo]);

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  /** 获取会员 */
  const getMemberDetail = (memberId: number) => {
    getMemberById(memberId).then((data) => {
      const { data: memberData } = data;
      setMemberData(memberData);
    });
  };

  /** 城市信息 */
  const getCityList = (country: string) => {
    if (!country) return;
    getCityListByCountryCode(country).then((res) => {
      setCityList(res.data.cityList || []);
    });
  };

  return {
    loading,
    dataSource,
    currentStep,
    baseInfo,
    customerInfo,
    userProductInfo,
    productInfo,
    valuationInfo,
    logisticsInfo,
    returnGoodsInfo,
    collectionInfo,
    logList,
    contractList,
    getDetail,
    RecycleOrderStatus: dataSource?.omsRecycleOrder?.status || 0,
  };
};

export default useHandleDetailData;
