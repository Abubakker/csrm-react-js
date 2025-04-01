import { useRef, useState, useEffect, useMemo } from 'react';
import JsBarcode from 'jsbarcode';
import xiaomaLogo from 'assets/logo-new.svg';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { ReceiptDto } from 'types/oms';
import dayjs from 'dayjs';
import { addressDetail, weekDetail, dictionaries } from './utils';
import { thousands } from 'utils/tools';
import { STOCK_PLACE_MAP } from 'commons/options';

const HR = () => <div className="border-black border-b border-dashed"></div>;

function Receipt() {
  const barCodeRef = useRef(null);
  const location = useLocation();
  const [state, setState] = useState<ReceiptDto>();

  useEffect(() => {
    setTimeout(() => {
      window.print();
      window.close();
    }, 666);
  }, []);

  const stockPlace = state?.stockPlace;
  const cumulativePoints = state?.cumulativePoints;

  // 获取URL传递参数
  useEffect(() => {
    // 获取参数
    const body = decodeURIComponent(
      queryString.parse(window.location.search).body as string
    );
    const bodyParse = JSON.parse(body) as ReceiptDto;
    console.log('🚀  useEffect  bodyParse:', bodyParse);
    setState(bodyParse);
  }, [location]);

  const lang = useMemo(() => {
    if (stockPlace === STOCK_PLACE_MAP.JAPAN) {
      return 'ja';
    } else {
      return 'en';
    }
  }, [stockPlace]);

  // 条形码
  useEffect(() => {
    const orderId = state?.id;
    const options = {
      fontSize: 0,
      height: 50,
    };
    if (orderId) {
      JsBarcode(barCodeRef.current, `${orderId}`, options);
    }
  }, [state]);

  // 格式化时间
  const getDateTimeEle = useMemo(() => {
    const createTime = state?.paymentTime || state?.createTime;
    const weekDay = dayjs(createTime).day();
    const week = weekDetail[lang][weekDay];
    const day = dayjs(createTime).format(
      lang === 'ja' ? 'YYYY年MM月DD日' : 'YYYY-MM-DD'
    );
    const time = dayjs(createTime).format(lang === 'ja' ? 'HH時mm分' : 'HH:mm');

    return (
      <div>
        {day}
        <span className="mx-2">{week}</span>
        {time}
      </div>
    );
  }, [lang, state?.createTime, state?.paymentTime]);

  // 价格符号
  const currency = useMemo(() => {
    if (stockPlace === STOCK_PLACE_MAP.HONGKONG) {
      return 'HK$';
    } else if (
      stockPlace === STOCK_PLACE_MAP.SINGAPORE_GX ||
      stockPlace === STOCK_PLACE_MAP.SINGAPORE_ASU
    ) {
      return 'SG$';
    } else {
      return '￥';
    }
  }, [stockPlace]);

  // 总价格
  const total = useMemo(() => {
    return thousands(state?.totalAmountActualCurrency || 0);
  }, [state]);

  // 实际价格
  const amountActual = useMemo(() => {
    if (state?.receivedAmount !== undefined)
      return state?.receivedAmount.toLocaleString();

    return thousands(state?.payAmountActualCurrency || 0);
  }, [state]);

  // 总税
  const totalTaxAmount = useMemo(() => {
    if (!state?.totalTaxAmount) {
      return '';
    }

    return thousands(state.totalTaxAmount);
  }, [state]);

  // 担当
  const staffName = useMemo(() => {
    return state?.staffName || '';
  }, [state]);

  // 优惠金额
  const discountAmount = useMemo(() => {
    return thousands(state?.promotionAmount) || 0;
  }, [state]);

  // 使用积分
  const usePoints = useMemo(() => {
    return state?.useIntegration || 0;
  }, [state]);

  // 获得积分
  const earnPoints = useMemo(() => {
    return Math.floor(state?.integration || 0);
  }, [state]);

  // 公司信息
  const CompanyEle = useMemo(() => {
    let address: string[] = [];
    if (stockPlace === STOCK_PLACE_MAP.HONGKONG) {
      address = addressDetail.hk;
    } else if (
      stockPlace === STOCK_PLACE_MAP.SINGAPORE_GX ||
      stockPlace === STOCK_PLACE_MAP.SINGAPORE_ASU
    ) {
      address = addressDetail.sg;
    } else {
      address = addressDetail.jp;
    }

    return (
      <div>
        {Object.values(address).map((value, i) => (
          <div key={i} className="leading-4">
            {value}
          </div>
        ))}
      </div>
    );
  }, [stockPlace]);

  // 根据店铺输出不同文本
  const receiptDict = useMemo(() => {
    let dict = {
      receipt: '',
      total: '',
      tax: '',
      paid: '',
      change: '',
      accountable: '',
      footer: '',
      use_points: '',
      earn_points: '',
      remaining_points: '',
      discount_amount: '',
      email: '',
      coupon: '',
    };
    if (stockPlace === STOCK_PLACE_MAP.HONGKONG) {
      dict = {
        receipt: dictionaries.receipt_hk,
        total: dictionaries.total_hk,
        tax: dictionaries.tax_hk,
        paid: dictionaries.paid_hk,
        change: dictionaries.change_hk,
        accountable: dictionaries.accountable_hk,
        footer: dictionaries.footer_hk,
        use_points: dictionaries.use_points_hk,
        earn_points: dictionaries.earn_points_hk,
        remaining_points: dictionaries.remaining_points_hk,
        discount_amount: dictionaries.discount_amount_hk,
        email: dictionaries.email_hk,
        coupon: dictionaries.coupon_hk,
      };
    } else if (
      stockPlace === STOCK_PLACE_MAP.SINGAPORE_GX ||
      stockPlace === STOCK_PLACE_MAP.SINGAPORE_ASU
    ) {
      dict = {
        receipt: dictionaries.receipt_sg,
        total: dictionaries.total_sg,
        tax: dictionaries.tax_sg,
        paid: dictionaries.paid_sg,
        change: dictionaries.change_sg,
        accountable: dictionaries.accountable_sg,
        footer: dictionaries.footer_sg,
        use_points: dictionaries.use_points_sg,
        earn_points: dictionaries.earn_points_hk,
        remaining_points: dictionaries.remaining_points_sg,
        discount_amount: dictionaries.discount_amount_sg,
        email: dictionaries.email_sg,
        coupon: dictionaries.coupon_sg,
      };
    } else {
      dict = {
        receipt: dictionaries.receipt_jp,
        total: dictionaries.total_jp,
        tax: dictionaries.tax_jp,
        paid: dictionaries.paid_jp,
        change: dictionaries.change_jp,
        accountable: dictionaries.accountable_jp,
        footer: `${dictionaries.footer_jp} \n\n ${dictionaries.footer_hk}`,
        use_points: dictionaries.use_points_jp,
        earn_points: dictionaries.earn_points_jp,
        remaining_points: dictionaries.remaining_points_jp,
        discount_amount: dictionaries.discount_amount_jp,
        email: dictionaries.email_jp,
        coupon: dictionaries.coupon_jp,
      };
    }
    return dict;
  }, [stockPlace]);

  // 渲染商品
  const getProductEle = useMemo(() => {
    if (!state) return;
    const { omsOrderItems } = state;

    return (
      <div>
        <div className="mb-2">{getDateTimeEle}</div>
        {omsOrderItems.map((d) => {
          return (
            <div className="prouct mb-3 last-of-type:mb-0" key={d.productId}>
              <div className="flex justify-between">
                <div>{d.productId}</div>
                {!!d.isTaxFree && (
                  <div>{lang === 'ja' ? '免税' : 'Tax Free'}</div>
                )}
              </div>

              <div className="flex justify-between">
                <div className="whitespace-pre-line">{d.productName}</div>
                <div className="shrink-0">
                  {currency}
                  {thousands(d.productPriceActualCurrency)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [state, getDateTimeEle, lang, currency]);

  return (
    <div className="w-[80mm] py-6 px-4 bg-white text-black relative">
      <div className="mb-4">
        <img
          alt="logo"
          src={xiaomaLogo}
          className="h-full w-3/4 mx-auto block text-black"
        />

        {stockPlace === STOCK_PLACE_MAP.JAPAN && (
          <p className="text-center text-[8pt] mt-2">ASU BRAND株式会社</p>
        )}
      </div>

      <div className="mb-[4pt]">{CompanyEle}</div>

      <HR />

      <div className="my-3">
        <div className="text-3xl text-center mb-3">
          【{lang === 'ja' ? '領 収 書' : 'Receipt'}】
        </div>
        {getProductEle}
      </div>

      <HR />

      <div className="my-3">
        <div className="flex justify-between my-[4px]">
          <div>{receiptDict.total}</div>
          <div>
            {currency}
            {total}
          </div>
        </div>

        {!!totalTaxAmount && (
          <div className="flex justify-between my-[4px]">
            <div>{receiptDict.tax}</div>
            <div>
              {currency}
              {totalTaxAmount}
            </div>
          </div>
        )}

        {/* 优惠金额 */}
        <div className="flex justify-between my-[4px]">
          <div>{receiptDict.discount_amount}</div>
          <div>
            -{currency}
            {discountAmount}
          </div>
        </div>

        {/* 使用积分 */}
        {!!usePoints && (
          <div className="flex justify-between my-[4px]">
            <div>{receiptDict.use_points}</div>
            <div>-P{thousands(usePoints)}</div>
          </div>
        )}

        {/* 使用优惠券 */}
        {!!state?.couponAmount && (
          <div className="flex justify-between my-[4px]">
            <div>{receiptDict.coupon}</div>
            <div>-￥{thousands(state?.couponAmount)}</div>
          </div>
        )}

        {/* 购买商品的总金额 */}
        <div className="flex justify-between my-[4px]">
          <div>{receiptDict.paid}</div>
          <div>
            {currency}
            {amountActual}
          </div>
        </div>

        {/* 支付方式 */}
        {!!state?.payList &&
          !!state?.payList?.length &&
          state?.payList?.map((d) => (
            <div key={d.name} className="flex justify-between my-[4px]">
              <div>（{d.name}）</div>
              <div>
                {currency}
                {d.amount.toLocaleString()}
              </div>
            </div>
          ))}

        <div className="flex justify-between my-[4px]">
          <div>{receiptDict.change}</div>
          <div>
            {currency}
            {state?.changeAmount?.toLocaleString()}
          </div>
        </div>

        {/* 获得积分 */}
        {!!earnPoints && (
          <div className="flex justify-between my-[4px]">
            <div>{receiptDict.earn_points}</div>
            <div>P{thousands(earnPoints)}</div>
          </div>
        )}

        {
          <div className="flex justify-between my-[4px]">
            <div>
              【{lang === 'ja' ? '累計ポイント' : 'Cumulative points'}】
            </div>
            <div>【P{thousands(cumulativePoints)}】</div>
          </div>
        }
      </div>
      <HR />

      <div className="my-3 text-right">
        {receiptDict.accountable}：{staffName}
      </div>

      <HR />

      <div className="mt-4">
        <div className="mb-1 whitespace-pre-line">{receiptDict.footer}</div>
        <div className="barCode flex justify-center items-center">
          <svg
            ref={barCodeRef}
            width={200}
            height={100}
            style={{ width: 200, height: 100 }}
          />
        </div>
        <div className="text-center">
          {lang === 'ja' ? '受注No.' : 'Order No.'}
          {state?.id}
        </div>
      </div>
    </div>
  );
}

export default Receipt;
