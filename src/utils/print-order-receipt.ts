import { financialManagementAccountList } from 'apis/fms';
import { getOmsOrderDetailById } from 'apis/oms';
import { printReceiptProductName } from 'apis/pms';
import { getMemberById } from 'apis/ums';
import {
  CURRENCY_MAP,
  ORDER_STATUS_MAP,
  PAY_STATUS_MAP,
} from 'commons/options';
import dayjs from 'dayjs';
import { sumBy } from 'lodash-es';
import { OmsOrderDetail } from 'types/oms';
import { CURRENCY_ENUM } from 'types/pms';
import connectToPosPrinter, {
  posPrinterSetting,
} from './connect-to-pos-printer';

const weekDetail = {
  hk: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
  jp: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  sg: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
};

const currencySymbolMap = {
  [CURRENCY_MAP.JPY]: '￥',
  [CURRENCY_MAP.SGD]: 'S$',
  [CURRENCY_MAP.HKD]: 'HK$',
};

export const getReceiptXmlString = async ({
  omsOrderDetail,
  count = 1,
  addSign = false,
}: {
  omsOrderDetail: OmsOrderDetail;
  count?: number;
  addSign?: boolean;
}) => {
  // 防止 count 设置过大，一次性打印太多了
  if (count > 3) {
    count = 3;
  }

  const [{ actualCurrency }] = omsOrderDetail.orderItemList;
  if (!actualCurrency) return '';

  const { status, orderType } = omsOrderDetail;
  const lang = actualCurrency === CURRENCY_MAP.JPY ? 'ja' : 'en';
  const currencySymbol = currencySymbolMap[actualCurrency || CURRENCY_MAP.JPY];

  const addressInfo = (() => {
    if (actualCurrency === CURRENCY_MAP.JPY) {
      return `<text>東京都中央区銀座1-8-21&#10;</text>
<text>第21中央ビル1F・2F&#10;</text>
<text>03-6264-5267&#10;</text>
<text>登録番号: T6011101072905&#10;</text>`;
    }

    if (actualCurrency === CURRENCY_MAP.HKD) {
      return `<text>Flat 1705, New World Tower 1, 16-18&#10;</text>
<text>Queen's Road Central, Central&#10;</text>
<text>(+852)2662-9721&#10;</text>`;
    }

    if (actualCurrency === CURRENCY_MAP.SGD) {
      return `<text>#23-05, Ngee Ann City Tower B, 391B&#10;</text>
<text>Orchard Road&#10;</text>
<text>(+65)6530-3529&#10;</text>`;
    }
  })();

  const footerInfo = (() => {
    if (lang === 'ja') {
      return `<text>店頭でお買い上げいただきました商品の返品 · 交換はできません。ご了承ください。&#10;</text>
<feed/>
<text>Please note the products purchased in store&#10;cannot be returned or exchanged.&#10;</text>
<feed/>`;
    }

    return `<text>Please note the products purchased in store&#10;cannot be returned or exchanged.&#10;</text>
<feed/>`;
  })();

  // 是否打印的是定金小票
  const isDepositReceipt =
    orderType === 2 && status === ORDER_STATUS_MAP.TO_BE_PAID;

  if (
    ![CURRENCY_ENUM.JPY as string, CURRENCY_ENUM.HKD].includes(actualCurrency)
  )
    return '';

  let xmlString = `<text align="center"/>
<image width="358" height="105" color="color_1" mode="mono">P/wAAAAAD/8Af/AAAAP///AAAAAAH///+AAAAP//+AAAD///gAAAH///gAAAH/4AAAAAD/8Af+AAAAP///AAAAAAf/6//gAAAP/f/AAAD///wAAAH///gAAAH/4AAAAAH/4Af/AAAAP/P/AAAAAB//AH/4AAAP/f/AAAH/z/gAAAH/n/gAAAD/8AAAAAP/wAf/AAAAf/P/gAAAAD/8AD/+AAAP/P/gAAP/n/gAAAP/n/wAAAD/+AAAAAP/wAf+AAAAf/P/gAAAAH/4AA/+AAAP/P/gAAP/n/wAAAP/n/wAAAB/+AAAAAf/gAP/AAAAf+H/gAAAAP/wAAf/gAAP/H/wAAf/H/gAAAP/H/wAAAA/+AAAAAf/gAf/AAAA/+P/gAAAAf/gAAP/wAAP/H/wAAf/H/gAAAf/D/wAAAA//AAAAA//AAf+AAAA/+H/wAAAA//AAAH/wAAP/D/4AA/+H/wAAAf/D/4AAAAf/gAAAB//AAf/AAAA/+H/wAAAB/+AAAH/8AAP/D/8AA/+H/gAAAf/D/4AAAAf/gAAAB/+AAf/AAAA/8D/wAAAB/8AAAB/8AAP/B/8AB/8H/gAAAf+B/4AAAAP/wAAAD/8AAf+AAAB/8D/4AAAD/8AAAB/+AAP/A/8AB/8H/wAAA/+B/8AAAAP/4AAAD/8AAf/AAAB/8D/4AAAH/4AAAA/+AAP/A/+AD/4H/gAAA/+B/8AAAAH/4AAAH/4AAf+AAAB/4B/4AAAH/wAAAA//AAP/Af/AD/wH/gAAA/8B/8AAAAD/8AAAH/4AAf/AAAD/4B/4AAAP/wAAAAf/gAP/Af/AH/wD/wAAB/8A/8AAAAD/8AAAP/wAAf+AAAD/4B/8AAAP/gAAAAf/gAP/AP/gH/gH/gAAB/8A/+AAAAB/+AAAf/gAAf/AAAD/4B/8AAAf/gAAAAP/gAP/AP/gP/gH/gAAB/8A/+AAAAB/+AAAf/gAAf+AAAD/wA/8AAAf/AAAAAP/wAP/AH/wf/AH/wAAB/4Af+AAAAA//AAA//AAAf/AAAH/wA/+AAA//AAAAAH/wAP/AH/wf/AH/gAAD/4Af/AAAAAf/gAA//AAAf+AAAH/wA/+AAA//AAAAAH/4AP/AD/4/+AD/gAAD/4Af/AAAAAf/gAB/+AAAf/AAAH/gA/+AAA/+AAAAAH/4AP/AB/4/+AH/gAAD/wAf/AAAAAP/gAB/8AAAf+AAAP/gAf+AAB/+AAAAAD/4AP/AB/9/8AH/wAAH/wAP/AAAAAP/wAD/8AAAf/AAAP/gAf/AAB/+AAAAAD/8AP/AA///4AH/gAAH/wAP/gAAAAH/4AH/4AAAf+AAAP/gAf/AAB/8AAAAAD/8AP/AA///4AH/gAAH/wAP/gAAAAD/4AH/4AAAf/AAAP/AAP/AAB/8AAAAAD/8AP/AAf//wAH/gAAP/gAH/gAAAAD/8AP/wAAAf+AAAf/AAP/gAD/8AAAAAB/8AP/AAf//wAH/wAAH/gAH/wAAAAB/+AP/wAAAf/AAAf/AAP/gAD/8AAAAAB/+AP/AAP//gAD/gAAP/gAH/wAAAAB/+Af/gAAAf+AAAf+AAP/gAD/4AAAAAB/+AP/AAH//gAH/gAAP/AAH/wAAAAA//Af/AAAAf/AAA/+AAH/gAD/4AAAAAB/+AP/AAH//AAH/gAAf/AAD/wAAAAA//A//AAAAf+AAA/+AAH/wAH/4AAAAAB/+AP/AAD/+AAH/wAAf/AAD/4AAAAAf/h/+AAAAf/AAA/+AAH/wAD/4AAAAAA/+AP/AAD/+AAH/gAAf/AAD/4AAAAAP/h/+AAAAf+AAA/8AAD/wAH/4AAAAAB/+AP/AAB/8AAH/gAA/+AAB/4AAAAAP/z/8AAAAf/AAB/8AAD/4AH/4AAAAAA//AP/AAB/8AAD/gAAf+AAB/8AAAAAH/7/4AAAAf+AAB/8AAD/4AH/4AAAAAA/+AP/AAA/4AAH/wAA/+AAB/8AAAAAH///4AAAAf/AAB/4AAB/4AH/wAAAAAA//AP/AAAf4AAH/gAA/8AAB/8AAAAAH///4AAAAf+AAD/4AAD/4AH/4AAAAAA/+AP/AAAfwAAH/gAB/8AAA/8AAAAAH/z/4AAAAf/AAD/4AAB/8AH/4AAAAAA//AP/AAAPgAAH/gAB/8AAA/+AAAAAP/z/8AAAAf+AAD/4AAA/8AH/wAAAAAA/+AP/AAAPgAAH/wAB/8AAA/+AAAAAP/h/+AAAAf/AAD/7////8AH/4AAAAAA//AP/AAAHAAAH/gAD//////+AAAAAf/g/+AAAAf+AAH//////+AH/4AAAAAA/+AP/AAAHAAAH/gAD///////AAAAA//A//AAAAf/AAH//////+AH/wAAAAAA//AP/AAAAAAAD/gAD///////AAAAA//A//AAAAf+AAH//////+AH/4AAAAAB/+AP/AAAAAAAH/wAD///////AAAAB/+Af/gAAAf/AAP//////+AH/4AAAAAA/+AP/AAAAAAAH/gAH///////AAAAB/+AP/gAAAf+AAP///////AH/4AAAAAB/+AP/AAAAAAAH/gAH///////gAAAD/8AP/wAAAf/AAP///////AD/4AAAAAA/+AP/AAAAAAAH/gAH///////gAAAD/8AH/4AAAf+AAP///////AH/4AAAAAB/+AP/AAAAAAAH/wAP///////gAAAH/4AH/4AAAf/AAf///////gD/4AAAAAB/+AP/AAAAAAAH/gAP///////wAAAH/wAD/4AAAf+AAf/AAAAP/gD/8AAAAAB/8AP/AAAAAAAD/gAP/gAAAH/wAAAP/wAD/8AAAf/AAf+AAAAH/gD/4AAAAAB/+AP/AAAAAAAH/gAP/AAAAD/wAAAP/gAB/+AAAf+AA/+AAAAH/gD/8AAAAAD/8AP/AAAAAAAH/wAf/AAAAD/wAAAf/gAB/+AAAf/AA/+AAAAH/wB/8AAAAAD/8AP/AAAAAAAH/gAf/AAAAD/4AAA//AAA//AAAf+AA/+AAAAH/wB/8AAAAAD/8AP/AAAAAAAH/gAf+AAAAD/4AAA//AAAf/AAAf/AA/8AAAAD/wB/+AAAAAD/4AP/AAAAAAAH/gA/+AAAAB/4AAB/+AAAf/gAAf+AB/8AAAAD/4A/+AAAAAH/4AP/AAAAAAAH/wA/+AAAAB/8AAB/+AAAP/wAAf/AB/8AAAAD/4A/+AAAAAH/4AP/AAAAAAAH/gA/+AAAAB/8AAD/8AAAP/wAAf+AB/4AAAAB/4A//AAAAAH/wAP/AAAAAAAH/gA/8AAAAA/8AAD/8AAAH/4AAf/AD/4AAAAB/4Af/AAAAAP/wAP/AAAAAAAH/gB/8AAAAA/8AAH/4AAAH/4AAf+AD/4AAAAB/8Af/AAAAAP/wAP/AAAAAAAH/wB/8AAAAA/+AAP/4AAAD/8AAf/AD/4AAAAB/8Af/gAAAAP/gAP/AAAAAAAH/gB/4AAAAA/+AAP/wAAAD/8AAf+AD/wAAAAA/8AP/gAAAAf/gAP/AAAAAAAH/gB/4AAAAAf+AAf/gAAAB/+AAf/AH/wAAAAA/+AH/wAAAA//AAP/AAAAAAAH/gD/4AAAAAf/AAf/gAAAB/+AAf+AH/wAAAAA/+AH/wAAAA/+AAP/AAAAAAAH/gD/4AAAAAf/AA//AAAAA//AAf/AH/gAAAAAf+AH/4AAAB/+AAP/AAAAAAAH/wD/wAAAAAP/AA//AAAAAf/gAf+AH/gAAAAAf+AD/8AAAB/8AAP/AAAAAAAH/gH/wAAAAAP/AB/+AAAAAf/gAf/AP/gAAAAAf/AB/8AAAD/8AAP/AAAAAAAH/gH/wAAAAAP/gB/+AAAAAf/wAf+AP/AAAAAAf/AA/+AAAH/4AAP/AAAAAAAH/gH/gAAAAAP/gD/8AAAAAP/wAf/AP/AAAAAAP/AA//AAAP/wAAP/AAAAAAAH/gH/wAAAAAH/gH/8AAAAAH/4Af+Af/AAAAAAP/gAP/gAAf/gAAP/AAAAAAAH/gP/gAAAAAH/wH/4AAAAAH/4Af/Af/AAAAAAP/gAP/wAA//AAAP/AAAAAAAH/gP/gAAAAAH/wP/wAAAAAD/8Af+Af+AAAAAAH/gAH/4AB//AAAP/AAAAAAAH/gP/AAAAAAD/wP/wAAAAAD/8Af/Af+AAAAAAH/gAB/+AD/8AAAP/AAAAAAAH/gf/AAAAAAD/wf/gAAAAAB/+Af+A/+AAAAAAH/wAA//AP/4AAAP/AAAAAAAH/gf/AAAAAAD/4f/gAAAAAA//Af/A/+AAAAAAH/wAAP////gAAAP/AAAAAAAH/gf/AAAAAAD/4//AAAAAAA/+AKqA/8AAAAAAD/wAAB/9/8AAAAP/AAAAAAACqg/+AAAAAAB/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/wA4DwBwH//ADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/4B4DwB4H//AD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/8A4D4BwH//AH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfA4B4D8BwAAeAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAAA4D8B4AAcAHcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8AAB4D+BwAA4AOcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAA4DvBwAB4AOeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AAB4Dnh4ADwAeOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4H+A4DnxwAHgAcPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4H+B4DjxwAPAA8PAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4H+A4Dh5wAOAA4HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AOB4Dg94AcAA9XgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AOA4DgfwA8AB//gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8AOB4DgfwB4AB//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAeA4DgPwDwADwDwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfA+B4DgH4HgADgB4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/+A4DgDwH//HgA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/4B4DgDwP//HAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/gA4DgAwH//HAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</image>
<text lang="mul"/>
<text align="center"/>
${lang === 'ja' ? `<text>ASU BRAND株式会社&#10;</text>` : ''}
<feed/>
<text align="left"/>
<text>${lang === 'ja' ? 'GINZA XIAOMA' : 'ASU Company Limited'}&#10;</text>
${addressInfo}
<text align="center"/>
<text>----------------------------------------------&#10;</text>
<text width="2" height="2"/>
<feed/>
<text>【${lang === 'ja' ? '領収書' : 'Receipt'}】&#10;</text>
<text align="left"/>
<text width="1" height="1"/>
<feed/>`;

  const { createTime, orderItemList, paymentTime } = omsOrderDetail;
  if (paymentTime || createTime) {
    const dayjsObj = dayjs(paymentTime || createTime);
    const day = dayjsObj.format(
      lang === 'ja' ? 'YYYY年MM月DD日' : 'YYYY-MM-DD'
    );
    const time = dayjsObj.format(lang === 'ja' ? 'HH時mm分' : 'HH:mm');
    const weekDay = dayjsObj.day();
    const week =
      lang === 'ja' ? weekDetail.jp[weekDay] : weekDetail.hk[weekDay];
    const createTimeString = `${day} ${week} ${time}`;

    // 下单日期
    xmlString = `${xmlString}
<text>${createTimeString}&#10;</text>
<feed/>`;
  }

  const productNameMap = await printReceiptProductName(
    orderItemList.map((i) => i.productId)
  );

  // 商品列表
  orderItemList.forEach(
    ({ productId, isTaxFree, productPriceActualCurrency }, index) => {
      const productNameArr = productNameMap[productId];

      xmlString = `${xmlString}
<text align="left"/>
${
  isTaxFree
    ? `<text>${productId}</text>
<text x="400"/>
<text>${lang === 'ja' ? '免税' : 'Tax Free'}&#10;</text>`
    : `<text>${productId}&#10;</text>`
}
<text>${productNameArr[0].slice(0, lang === 'ja' ? 20 : 30)}</text>
<text x="400"/>
<text>${currencySymbol}${productPriceActualCurrency.toLocaleString()}&#10;</text>
${productNameArr[1] ? `<text>${productNameArr[1]}&#10;</text>` : ''}
${productNameArr[2] ? `<text>${productNameArr[2]}&#10;</text>` : ''}
<text align="center"/>
${
  index === orderItemList.length - 1
    ? `<text>----------------------------------------------&#10;</text>`
    : `<feed/>`
}`;
    }
  );

  // 订单合计金额
  xmlString = `${xmlString}
<text align="left"/>
<text>${lang === 'ja' ? '合計' : 'Total'}</text>
<text x="400"/>
<text>${currencySymbol}${omsOrderDetail.totalAmountActualCurrency?.toLocaleString()}&#10;</text>`;

  // 消费税
  if (omsOrderDetail.totalTaxAmount) {
    xmlString = `${xmlString}
<text>（内消費税 10%）</text>
<text x="400"/>
<text>￥${omsOrderDetail.totalTaxAmount?.toLocaleString()}&#10;</text>`;
  }

  // 优惠金额
  if (omsOrderDetail.promotionAmountActualCurrency) {
    xmlString = `${xmlString}
<text>${lang === 'ja' ? '割引額' : 'Discount'}</text>
<text x="400"/>
<text>-${currencySymbol}${omsOrderDetail.promotionAmountActualCurrency.toLocaleString()}&#10;</text>`;
  }

  // 优惠券
  if (omsOrderDetail.couponAmount) {
    xmlString = `${xmlString}
<text>${lang === 'ja' ? 'クーポン' : 'Coupon'}</text>
<text x="400"/>
<text>-￥${omsOrderDetail.couponAmount.toLocaleString()}&#10;</text>`;
  }

  // 使用积分
  if (omsOrderDetail.integrationAmount) {
    xmlString = `${xmlString}
<text>${lang === 'ja' ? '利用ポイント' : 'Use points'}</text>
<text x="400"/>
<text>-P${omsOrderDetail.integrationAmount.toLocaleString()}&#10;</text>`;
  }

  // お預かり
  const receivedAmount = (() => {
    if (omsOrderDetail.payList && omsOrderDetail.payList.length) {
      return sumBy(
        omsOrderDetail.payList.filter(
          (i) => i.payStatus === PAY_STATUS_MAP.CONFIRMED
        ),
        (i) => i.payAmount
      );
    }

    return 0;
  })();
  xmlString = `${xmlString}
<text>${lang === 'ja' ? 'お預かり' : 'Paid'}</text>
<text x="400"/>
<text>${currencySymbol}${receivedAmount.toLocaleString()}&#10;</text>`;

  // 支付记录
  const paymentAccountList = await financialManagementAccountList(
    omsOrderDetail.createdFrom
  );
  paymentAccountList.push({
    id: '99999',
    accountCode: 'CRYPTO_CURRENCY_TRIPLE_A',
    accountName: lang === 'en' ? 'Crypto Currency' : '暗号通貨',
    accountDescribe: 'Crypto Currency',
    status: 0,
    storeId: 1,
    deleteStatus: 0,
    sort: 0,
    isCash: 0,
  });
  const payList = omsOrderDetail.payList
    ?.filter((i) => i.payStatus === PAY_STATUS_MAP.CONFIRMED)
    .map((i) => ({
      name:
        paymentAccountList.find((d) => d.accountCode === i.payType)
          ?.accountName || i.payType,
      amount: i.payAmount,
    }));
  payList?.forEach(({ name, amount }) => {
    xmlString = `${xmlString}
<text>（${name}）</text>
<text x="400"/>
<text>${currencySymbol}${amount.toLocaleString()}&#10;</text>`;
  });

  // お釣り
  const changeAmount =
    receivedAmount - (omsOrderDetail.payAmountActualCurrency || 0);
  xmlString = `${xmlString}
<text>${
    isDepositReceipt
      ? `${lang === 'ja' ? '未払い残額' : 'Unpaid balance'}`
      : `${lang === 'ja' ? 'お釣り' : 'Change'}`
  }</text>
<text x="400"/>
<text>${currencySymbol}${(isDepositReceipt
    ? -changeAmount
    : changeAmount
  ).toLocaleString()}&#10;</text>`;

  // 获得积分
  if (omsOrderDetail.integration) {
    xmlString = `${xmlString}
<text>${lang === 'ja' ? '獲得ポイント' : 'Earn points'}</text>
<text x="400"/>
<text>P${omsOrderDetail.integration.toLocaleString()}&#10;</text>`;
  }

  // 客人剩下的积分
  if (omsOrderDetail.memberId) {
    const memberDetail = await getMemberById(omsOrderDetail.memberId);
    if (memberDetail.data) {
      xmlString = `${xmlString}
<text>【${lang === 'ja' ? '累計ポイント' : 'Cumulative points'}】</text>
<text x="400"/>
<text>【P${memberDetail.data.integration?.toLocaleString()}】&#10;</text>`;
    }
  }

  // 担当者
  xmlString = `${xmlString}
<text align="center"/>
<text>----------------------------------------------&#10;</text>
<text align="right"/>
<text>${lang === 'ja' ? '担当者' : 'Accountable'}：${
    omsOrderDetail.staffName || ''
  }&#10;</text>
<text align="center"/>
<text>----------------------------------------------&#10;</text>`;

  const getFooter = (addSign: boolean) => {
    return `<text align="left"/>
${footerInfo}
<text align="center"/>
<barcode type="code39" hri="none" font="font_a" width="2" height="64">${
      omsOrderDetail.id
    }</barcode>
<feed/>
<text>${lang === 'ja' ? '受注No' : 'Order No'}.${omsOrderDetail.id}${
      isDepositReceipt ? `（${lang === 'ja' ? '内金注文' : 'Deposit'}）` : ''
    }&#10;</text>
<feed/>
${
  addSign
    ? `<text align="left"/>
<text>Sign:&#10;</text>
<text align="center"/>
<text>----------------------------------------------&#10;</text>
<feed/>`
    : ''
}
<feed/>
<cut type="feed"/>`;
  };

  let outXmlString = '';
  for (let i = 0; i < count; i++) {
    /**
     * 1. 选择了需要打印 sign
     * 2. 第一张小票
     * 3. 不是日本的小票（日本小票不需要签名位置）
     */
    outXmlString += xmlString + getFooter(addSign && i === 0 && lang === 'en');
  }

  return outXmlString;
};

const printOrderReceipt = async ({
  orderId,
  count = 1,
  addSign = false,
}: {
  orderId: number;
  count?: number;
  addSign?: boolean;
}) => {
  if (posPrinterSetting.communicationType.get() === 'socket') {
    const printer = await connectToPosPrinter();

    const { data: omsOrderDetail } = await getOmsOrderDetailById(orderId);
    const xmlString = await getReceiptXmlString({
      omsOrderDetail,
      count,
      addSign,
    });
    if (!xmlString) return;

    printer.setXmlString(xmlString);
    printer.send();
    return;
  }

  if (posPrinterSetting.communicationType.get() === 'http') {
    const { data: omsOrderDetail } = await getOmsOrderDetailById(orderId);
    const xmlString = await getReceiptXmlString({
      omsOrderDetail,
      count,
      addSign,
    });
    if (!xmlString) return;

    const printerXmlUrl = `https://${posPrinterSetting.host.get()}/cgi-bin/epos/service.cgi?devid=local_printer&timeout=10000`;
    const reqXmlString = `
        <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
            <s:Body>
                <epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">
                    ${xmlString}
                </epos-print>
                </s:Body>
        </s:Envelope>
`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', printerXmlUrl, true);
      xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
      xhr.setRequestHeader(
        'If-Modified-Since',
        'Thu, 01 Jan 1970 00:00:00 GMT'
      );
      xhr.setRequestHeader('SOAPAction', '""');
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const success =
              xhr?.responseXML
                ?.getElementsByTagName('response')[0]
                ?.getAttribute('success') === 'true';
            if (success) {
              resolve(true);
            } else {
              reject('Print failed.');
            }
          } else {
            reject('Network error occured.');
          }
        }
      };

      xhr.send(reqXmlString);
    });
  }
};

export default printOrderReceipt;
