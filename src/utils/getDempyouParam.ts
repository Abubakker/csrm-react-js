import { OmsRecycleOrderDetail } from 'types/oms';
import { SelectOption } from 'types/base';
import { MallCity } from 'types/home';
import { getCityListByCountryCode } from 'apis/home';
import { SysUser } from 'types/sys';
import { DempyouType, DempyouPrintDto } from 'pages/prints/dempyou';
import dayjs from 'dayjs';
import i18n from 'i18n';
import LOCALS from 'commons/locals';
import { CURRENCY_MAP } from 'commons/options';

export interface ProductType {
  productName: string;
  productPrice: string | number;
  guestRemarks: string;
  type: number;
  code: string;
  productSn: string;
  brandName: string;
  productId: number;
  submissionId?: number;
}

export type PrintParamType = Pick<
  DempyouPrintDto,
  | 'code'
  | 'date'
  | 'payType'
  | 'staff'
  | 'userInfo'
  | 'memberId'
  | 'submissionId'
> &
  Partial<Pick<DempyouPrintDto, 'dempyouType' | 'totalPrice'>> & {
    type: number;
  };

const getDempyouProduct = (
  data: OmsRecycleOrderDetail,
  { name }: { name?: string },
): ProductType | undefined => {
  if (data) {
    const { omsRecycleOrderProduct, omsRecycleOrderItem, omsRecycleOrder } =
      data;
    const { productSn, brandName } = omsRecycleOrderProduct || {};
    const {
      finalSalePrice = '',
      finalRecyclePrice = '',
      guestRemarks = '',
      productId,
    } = omsRecycleOrderItem || {};
    const { type, code, submissionId } = omsRecycleOrder || {};
    return {
      productName: name || '',
      productPrice: finalSalePrice || finalRecyclePrice || '',
      productSn: productSn || '',
      brandName: brandName || '',
      guestRemarks,
      type: type!,
      code: code!,
      productId: productId || 0,
      submissionId,
    };
  }
  return;
};

const getDempyouOrderInfo = async (
  data: OmsRecycleOrderDetail,
  {
    staffSelectOptions,
    countryOptions,
    idCertificate,
  }: {
    staffSelectOptions: (SelectOption & Pick<SysUser, 'shop'>)[];
    countryOptions: SelectOption[];
    idCertificate?: string;
  },
): Promise<PrintParamType | undefined> => {
  let countryStr: SelectOption | undefined = undefined;
  let cityStr: MallCity | undefined = undefined;
  let [staff, code, payType] = ['', '', '', '', 0];
  if (data) {
    const { omsRecycleOrderLogistics, omsRecycleOrder } = data;
    const {
      code: orderCode,
      settlementType,
      createBy,
      type,
      createTime,
      submissionId,
    } = omsRecycleOrder || {};
    const { name, phone, postCode, country, city, detailAddress } =
      omsRecycleOrderLogistics || {};
    const cityData = await getCityListByCountryCode(country || '');
    countryStr = countryOptions.find((d) => d.value === country);
    const countryIsJP = countryStr?.value === 'JPN';
    const countryLabel = countryIsJP ? '' : countryStr?.label;
    const nameStr = countryIsJP ? `${name || '-'}  様` : `${name || '-'}`;
    cityStr = cityData.data.cityList?.find((d) => d.code === city);
    [staff, code, payType] = [
      staffSelectOptions.find((d) => d.value === createBy)?.label || '',
      orderCode || '',
      ['', i18n.t(LOCALS.iJVtIJxKRd), i18n.t(LOCALS.XLtWNsvkPj)][
        settlementType || 1
      ],
    ];

    const userInfo = (() => {
      const arr = [
        nameStr,
        // 香港需要展示用户的身份证信息
        data.omsRecycleOrder?.currency === CURRENCY_MAP.HKD
          ? `+${phone}        ${idCertificate || ''}`
          : `+${phone}`,
        `${countryLabel} ${cityStr?.name || ''} ${detailAddress?.replace(
          /\n/g,
          ' ',
        )} ${postCode || ''}`,
      ];

      return arr
        .map((i) => i?.trim())
        .filter(Boolean)
        .join('\n');
    })();

    return {
      userInfo,
      staff,
      code,
      payType,
      type: type!,
      date: dayjs(createTime).format('YYYY/MM/DD'),
      memberId: data.omsRecycleOrder?.memberId || 0,
      submissionId,
    };
  }
  return;
};

const getDempyouToPrint = ({
  productList,
  printParam,
  prints,
}: {
  productList: ProductType[];
  printParam: PrintParamType;
  prints?: boolean; // 是否弹窗打印
}) => {
  const payload = {
    productList,
    ...printParam,
    totalPrice: productList.reduce((total, product) => {
      const price = Number(product.productPrice) || 0;
      return total + price;
    }, 0),
    prints,
    memberId: printParam.memberId,
  };
  const [t1, t2] =
    printParam.type === 1
      ? [DempyouType.sell_customer, DempyouType.sell_store]
      : [DempyouType.recycle_customer, DempyouType.recycle_store];
  let encode = '';
  if (printParam.type === 2) {
    // 回收类型 = 2 张
    const printList = [
      { ...payload, dempyouType: t1 },
      { ...payload, dempyouType: t2 },
    ];
    encode = encodeURIComponent(JSON.stringify(printList));
    // console.log('🚀', printList);
  } else {
    //寄卖类型 = 商品数 * 2 张
    const printList: DempyouPrintDto[] = [];
    productList.forEach((d) => {
      printList.push({
        productList: [d],
        ...printParam,
        totalPrice: d.productPrice,
        dempyouType: t1,
        code: d.code,
        prints: '1',
        memberId: printParam.memberId,
        submissionId: d.submissionId,
      });
      printList.push({
        productList: [d],
        ...printParam,
        totalPrice: d.productPrice,
        dempyouType: t2,
        code: d.code,
        prints: '1',
        memberId: printParam.memberId,
        submissionId: d.submissionId,
      });
    });
    encode = encodeURIComponent(JSON.stringify(printList));
    // console.log('🚀  printList:', printList);
  }
  window.open(`/prints/dempyou?body=${encode}`);
};

export { getDempyouProduct, getDempyouOrderInfo, getDempyouToPrint };
