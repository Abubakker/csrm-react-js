import queryString from 'query-string';
import { useCallback, useEffect, useState } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import useBrandList from 'commons/hooks/use-brand-list';
import i18n from 'i18n';
import LOCALS from 'commons/locals';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { useSelector } from 'react-redux';
import { LANGUAGE_MAP } from 'commons/options';

export enum DempyouType {
  // 買取伝票（お客様控え）
  recycle_customer = 'recycle_customer',
  // 買取伝票
  recycle_store = 'recycle_store',

  // 委託伝票（お客様控え）
  sell_customer = 'sell_customer',
  // 委託伝票
  sell_store = 'sell_store',
}

export const DempyouTypeNameMap = {
  [DempyouType.recycle_customer]: [
    '買取伝票（お客様控え）',
    'Repurchase Receipt(Copy)',
  ],
  [DempyouType.recycle_store]: ['買取伝票', 'Repurchase Receipt'],
  [DempyouType.sell_customer]: [
    '委託伝票（お客様控え）',
    'Consignment Receipt(Copy)',
  ],
  [DempyouType.sell_store]: ['委託伝票', 'Consignment Receipt'],
};

export type DempyouPrintDto = {
  code: string;
  date: string;
  payType: string;
  staff: string;
  userInfo: string;
  memberId: number;
  dempyouType: DempyouType;
  totalPrice: string | number;
  prints?: string; // 是否打印
  productList: {
    productName: string;
    productPrice: string | number;
    guestRemarks: string;
    code: string;
    productSn: string;
    brandName: string;
    productId: number;
  }[];
  submissionId?: number;
};

const DempyouPrint = () => {
  const { language } = useSelector(selectGlobalInfo);
  const [state, setState] = useState<DempyouPrintDto[]>([]);
  const { SourceBrandList } = useBrandList();
  useEffect(() => {
    const body = decodeURIComponent(
      queryString.parse(window.location.search).body as string,
    );
    const bodyParse = JSON.parse(body) as DempyouPrintDto[];
    setState(bodyParse);
    if (bodyParse[0].prints) {
      setTimeout(() => {
        window.print();
        window.close();
      }, 666);
    }
  }, []);

  const A4Render = useCallback(
    (data: DempyouPrintDto, i: number) => {
      const len = state[0].productList.length;
      const headList = () => {
        let list = [
          [
            i18n.t(LOCALS.cGWwPIcXWq),
            data.submissionId ? data.submissionId.toString() : data.code,
          ],
          [language === LANGUAGE_MAP.EN ? 'Date' : '受付日', data.date],
          [language === LANGUAGE_MAP.EN ? 'Accountable' : '担当者', data.staff],
          [
            language === LANGUAGE_MAP.EN ? 'Transaction' : 'ご清算区分',
            data.payType,
          ],
        ];
        // 当多个商品且没有submissionId时，移除第一项
        if (len > 1 && !data.submissionId) {
          list.shift();
        }
        return list;
      };

      const isStore = [
        DempyouType.recycle_store,
        DempyouType.sell_store,
      ].includes(data.dempyouType);

      const priceArr = (() => {
        const el1 = [
          language === LANGUAGE_MAP.EN ? 'Sub Total' : '小計',
          Number(data.totalPrice).toLocaleString(),
        ];
        const el2 = [
          '消費税10%対象 内税額',
          Math.floor(Number(data.totalPrice) / 11).toLocaleString(),
        ];
        const el3 = [
          language === LANGUAGE_MAP.EN ? 'Total' : '総合計',
          Number(data.totalPrice).toLocaleString(),
        ];

        if (language === LANGUAGE_MAP.EN) return [el1, el3];

        return [el1, el2, el3];
      })();

      return (
        <div
          key={i}
          className={classNames(
            'w-[594.3pt] h-[840.51pt] bg-white py-4 px-10 flex flex-col text-black',
            styles.dempyou,
          )}
        >
          <div
            className="bg-black text-white px-1 mb-12 shrink-0"
            // https://blog.csdn.net/weixin_45122120/article/details/103269099
            // https://developer.mozilla.org/zh-CN/docs/Web/CSS/print-color-adjust
            style={{ printColorAdjust: 'exact' }}
          >
            ASU BRAND
          </div>

          <div className="mb-6 shrink-0">
            <div className="flex items-center relative">
              <div>
                {headList().map(([label, value], index) => {
                  return (
                    <div key={index} className="border-b mb-1">
                      <span className="italic w-24 inline-block font-semibold">
                        {label}
                      </span>
                      <span>{value}</span>
                    </div>
                  );
                })}
              </div>

              <h1
                className={classNames(
                  'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                  language === LANGUAGE_MAP.EN ? 'text-[22px]' : '',
                )}
              >
                {language === LANGUAGE_MAP.EN
                  ? DempyouTypeNameMap[data.dempyouType][1]
                  : DempyouTypeNameMap[data.dempyouType][0]}
              </h1>

              {isStore && (
                <div className="absolute right-4 -top-4 border px-4 py-2">
                  {language === LANGUAGE_MAP.EN
                    ? 'Consignment method'
                    : '買取方法'}
                  : 店頭
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center mb-4 justify-between shrink-0">
            <div className="border p-px basis-[68%] shrink-0">
              <div className="border p-2">
                {[0, 1, 2, 3].map((index) => {
                  let text = data.userInfo.split('\n')[index] || '';

                  if (isStore && index === 0) {
                    text = `${text} 、${
                      language === LANGUAGE_MAP.EN ? 'Customer' : '顧客'
                    } NO.${data.memberId}`;
                  }

                  return (
                    <div
                      key={index}
                      className="border-b mb-2 h-4"
                      dangerouslySetInnerHTML={{
                        __html: text.replaceAll(' ', '&nbsp;'),
                      }}
                    ></div>
                  );
                })}
              </div>
            </div>

            {[DempyouType.recycle_customer, DempyouType.sell_customer].includes(
              data.dempyouType,
            ) &&
              (language === LANGUAGE_MAP.EN ? (
                <div className="text-right">
                  ASU Company Limited
                  <br />
                  HONGKONG
                  <br />
                  Room 1705,17/F,New World Tower 1
                  <br />
                  16-18 Queen's Road Central,Central
                  <br />
                  Email &nbsp;&nbsp;info.hk@asubrand.jp
                  <br />
                  TEL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+852 2662
                  9721
                </div>
              ) : (
                <div className="ml-8">
                  ASU BRAND 株式会社
                  <br />
                  GINZA XIAOMA
                  <br />
                  東京都中央区銀座1丁目8-21
                  <br />
                  第21中央ビル1F・2F
                  <br />
                  TEL 03-6264-5267
                  <br />
                  登録番号:T6011101072905
                </div>
              ))}
          </div>

          <div className="flex-1 flex flex-col">
            <table className="flex-1">
              <thead>
                <tr
                  className="bg-black text-white"
                  style={{ printColorAdjust: 'exact' }}
                >
                  <th className="p-2 w-10 font-normal">
                    {len === 1 || (data.submissionId && len > 1)
                      ? ''
                      : '伝票番号'}
                  </th>
                  <th className="p-2 w-32 font-normal">
                    {i18n.t(LOCALS.brand)}
                  </th>
                  <th className="p-2 font-normal">
                    {language === LANGUAGE_MAP.EN ? 'Description' : '商品名'}
                  </th>
                  <th className="p-2 w-32 font-normal">
                    {language === LANGUAGE_MAP.EN ? 'Cost' : '金額(税込)'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.productList.map((d, i) => (
                  <tr className="h-8" key={i}>
                    <td className="p-2">
                      {len === 1 || (data.submissionId && len > 1)
                        ? i + 1
                        : d.code}
                    </td>
                    <td className="p-2">
                      {/* 仅显示日文 */}
                      {language === LANGUAGE_MAP.EN
                        ? SourceBrandList.find((dd) => dd.value === d.brandName)
                            ?.nameEn || SourceBrandList[0].nameEn
                        : SourceBrandList.find((dd) => dd.value === d.brandName)
                            ?.nameJa || SourceBrandList[0].nameJa}
                    </td>
                    <td className="p-2">
                      {[
                        DempyouType.recycle_store,
                        DempyouType.sell_store,
                      ].includes(data.dempyouType) && <>{d.productId}:</>}
                      {d.productName}
                      {d.guestRemarks && (
                        <>
                          <div className="border-b my-1" />
                          {d.guestRemarks}
                        </>
                      )}
                    </td>
                    <td className="p-2 text-right">
                      {Number(d.productPrice).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {Array.from({ length: 12 - data.productList.length }).map(
                  (value, index) => {
                    return (
                      <tr className="h-8" key={index}>
                        <td className="p-2"></td>
                        <td className="p-2"></td>
                        <td className="p-2"></td>
                        <td className="p-2"></td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>

            {language === LANGUAGE_MAP.EN && (
              <div className="border-l border-r px-2 py-2 border-b shrink-0">
                -In event of any disputes, ASU Company Limited reserves the
                right of final decision.
              </div>
            )}
            <div className="border-l border-r px-2 py-2 shrink-0">
              <div className="flex justify-between">
                <div className="text-[10px]">
                  {[
                    DempyouType.recycle_customer,
                    DempyouType.recycle_store,
                  ].includes(data.dempyouType) &&
                    (language === LANGUAGE_MAP.EN ? (
                      <>
                        No refund after repurchase.
                        <br />
                        If the product was found to be counterfeit or stolen
                        item,
                        <br />
                        the customer is responsible to refund Asubrand Company
                        Limited
                        <br />
                        reserve the right to pursue legal action.
                      </>
                    ) : (
                      <>
                        ご契約後のお買戻しはお受付できませんのでご了承ください。
                        <br />
                        ご契約後、商品が不正商品と発覚した場合、全額返金いただく場合があります。
                      </>
                    ))}

                  {[DempyouType.sell_customer, DempyouType.sell_store].includes(
                    data.dempyouType,
                  ) &&
                    (language === LANGUAGE_MAP.EN ? (
                      <>
                        Consignment period is 1 months.
                        <br />
                        Please contact us if you want to cancel consignment in
                        advance.
                        <br />
                        Once the consignment is sold, we will contact you
                        immediately and transfer
                        <br />
                        the agreement amount to your designated account.
                      </>
                    ) : (
                      <>
                        ○
                        本商品は、お預かり日より１か月以上お預かりするものとし、
                        <br />
                        １か月未満での委託販売中止は基本出来ないものとします（要ご相談）
                        <br />
                        ○
                        本商品の売却が成立した場合、決済確定後にお知らせいたします。
                        <br />
                        お知らせ後はご相談によりお振込みまたは現金にて表記の金額をお支払いいたします。
                      </>
                    ))}
                </div>

                <div className="basis-1/3">
                  {priceArr.map(([title, value], index) => {
                    return (
                      <div key={index} className="flex justify-between mb-1">
                        <span>{title}</span>
                        <span>{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {[DempyouType.recycle_store, DempyouType.sell_store].includes(
                data.dempyouType,
              ) && (
                <div className="mt-3">
                  <div
                    className={classNames(
                      'mb-1 w-1/2 flex justify-between pb-1',
                      styles.borderBottomDouble,
                    )}
                  >
                    <span>
                      {language === LANGUAGE_MAP.EN ? 'Signature' : '名前'}
                    </span>
                    {language !== LANGUAGE_MAP.EN && <span>印</span>}
                  </div>
                  {language !== LANGUAGE_MAP.EN && (
                    <div className="text-[11px]">
                      <span>
                        適格請求書（インボイス）発行事業者ではありません。
                      </span>
                      <span className="ml-2">口はい</span>
                      <span className="ml-2">口いいえ</span>
                      <span className="ml-4">適格請求畫発行事業者</span>
                      <span className="ml-2">登録番号：</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div
              className="bg-black text-white text-lg px-1 shrink-0"
              style={{ printColorAdjust: 'exact' }}
            >
              ASU BRAND
            </div>
          </div>
        </div>
      );
    },
    [SourceBrandList, language, state],
  );

  return <>{state.map((d, i) => A4Render(d, i))}</>;
};

export default DempyouPrint;
