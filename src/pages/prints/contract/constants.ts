export const policy = [
  '由於市場⾏情變動，寄賣報價的有效期為3天，請及時確認簽約。報價逾期後，我們將根據最新市場⾏情重新為您的商品估值。',
  '郵寄商品給我們之前，請和客服⼈員確認商品詳細信息及所有配件。如果收到的實物狀態與先前描述的不符（例如尺⼨、顏⾊、⽪質、品相等），寄賣的報價會有所變動，敬請知悉。',
  '如果商品不符合本地法律及本公司的業務準則，我們將無法提供寄賣服務，因退貨產⽣的郵費和清關費將由客⼈負擔。如若發現寄賣商品為贓物、仿冒品或任何涉及不正⾏為的商品，我們將保留法律追究的權利。',
  '寄賣期限為3個⽉。寄賣1個⽉後，您可選擇降低價格或取消寄賣。3個⽉後商品還未售出的情況下，如果您沒有提出特別要求，寄賣合約將⾃動續約。',
  '商品寄賣期間，您可以隨時變更為回收。回收價格將根據當前的市場⾏情進⾏估值。',
  '若您有意向取消寄賣，我們將在1個⼯作⽇內為您處理，並盡快安排商品下架和退回。您可攜帶寄賣合約及身分證明⽂件前來⾨店取回商品，亦或聯繫客服安排郵寄退回。',
  '寄賣期間已經收取銷售定⾦的商品將無法退還，請您知悉。',
  '取回寄賣商品時，我們的店員或客服⼈員將協助您檢查商品的狀態無損及配件⿑全。請您務必當場確認，商品退回後恕不受理，敬請理解。',
  '假如您的寄賣商品在保管期間發⽣損壞或丟失，我們將以寄賣協議的全額進⾏賠償。',
  '寄賣商品的照⽚及視頻素材將發佈在公司網站、社交媒體平台、第三⽅電商平台上進⾏宣傳和販賣。',
  '您提供給我們的個⼈信息將得到嚴格保密，不會⽤於回收寄賣業務以外的任何其他⽤途。',
  '寄賣的商品會在賣出並收到全款後的1個⼯作⽇內，根據簽約時的幣種為您進⾏結算。',
];

interface Mapping {
  [key: string]: string;
}
export const langMapping: Mapping = {
  consignmentContract_ZH_CN: '寄卖合约',
  consignmentContract_ZH_TW: '寄賣合約',
  consignmentContract_EN: 'Consignment Contract',
  consignmentContract_JA: '委託販売契約書',
  recallContract_ZH_CN: '回收合约',
  recallContract_ZH_TW: '回收合約',
  recallContract_EN: 'Recovery Contract',
  recallContract_JA: '買取合约',
  consignorsCopy_ZH_CN: '寄卖方存本',
  consignorsCopy_ZH_TW: '寄賣方存本',
  consignorsCopy_EN: `Consignor's copy`,
  consignorsCopy_JA: '委託販売者控え',
  consignor_ZH_CN: '寄卖方',
  consignor_ZH_TW: '寄賣方',
  consignor_EN: 'Consignor',
  consignor_JA: '委託販売者',
  consignmentNumber_ZH_CN: '寄卖单号',
  consignmentNumber_ZH_TW: '寄賣單號',
  consignmentNumber_EN: 'Consignment Number',
  consignmentNumber_JA: '委託販売番号',
  RecoveryNumber_ZH_CN: '单号',
  RecoveryNumber_ZH_TW: '單號',
  RecoveryNumber_EN: 'Recovery Number',
  RecoveryNumber_JA: '番号',
  address_ZH_CN: '地址',
  address_ZH_TW: '地址',
  address_EN: 'Address',
  address_JA: '住所',
  phone_ZH_CN: '电话',
  phone_ZH_TW: '電話',
  phone_EN: 'Phone',
  phone_JA: '電話',
  'id/passportNumber_ZH_CN': 'ID / 护照号',
  'id/passportNumber_ZH_TW': 'ID / 護照號',
  'id/passportNumber_EN': 'ID/Passport number',
  'id/passportNumber_JA': 'ID /パスポート',
  transactionMethod_ZH_CN: '结算方式',
  transactionMethod_ZH_TW: '結算方式',
  transactionMethod_EN: 'Transaction method',
  transactionMethod_JA: '決済方法',
  date_ZH_CN: '日期',
  date_ZH_TW: '日期',
  date_EN: 'Date',
  date_JA: '日付',
  representative_ZH_CN: '担当',
  representative_ZH_TW: '擔當',
  representative_EN: 'Representative',
  representative_JA: '担当者',
  consignmentMethod_ZH_CN: '寄卖方式',
  consignmentMethod_ZH_TW: '寄賣方式',
  consignmentMethod_EN: 'Consignment method',
  consignmentMethod_JA: '委託販売方法',
  orderNumber_ZH_CN: '订单编号',
  orderNumber_ZH_TW: '訂單編號',
  orderNumber_EN: 'Order number',
  orderNumber_JA: '注文番号',
  productNumber_ZH_CN: '商品编号',
  productNumber_ZH_TW: '商品編號',
  productNumber_EN: 'Product SKU',
  productNumber_JA: '商品番号',
  itemDescription_ZH_CN: '商品描述',
  itemDescription_ZH_TW: '商品描述',
  itemDescription_EN: 'Item description',
  itemDescription_JA: '商品情報',
  status_ZH_CN: '状态',
  status_ZH_TW: '狀態',
  status_EN: 'Status',
  status_JA: '状態',
  consignmentPrice_ZH_CN: '寄卖金额',
  consignmentPrice_ZH_TW: '寄賣金額',
  consignmentPrice_EN: 'Consignment price',
  consignmentPrice_JA: '委託販売金額',
  total_ZH_CN: '总计',
  total_ZH_TW: '總計',
  total_EN: 'Total',
  total_JA: '合計',
  contractModificationRecord_ZH_CN: '合同记录',
  contractModificationRecord_ZH_TW: '合同記錄',
  contractModificationRecord_EN: 'Contract modification record',
  contractModificationRecord_JA: '契約記録',
  type_ZH_CN: '类型',
  type_ZH_TW: '類型',
  type_EN: 'Type',
  type_JA: 'タイプ',
  modifiedDetails_ZH_CN: '内容',
  modifiedDetails_ZH_TW: '內容',
  modifiedDetails_EN: 'Details',
  modifiedDetails_JA: 'コンテンツ',
  dateOfModification_ZH_CN: '日期',
  dateOfModification_ZH_TW: '日期',
  dateOfModification_EN: 'Date',
  dateOfModification_JA: '日付',
  //
  tips1_ZH_CN:
    '寄卖期限为3个月。到期日前若未提出特别要求，寄卖合约将自动续约。',
  tips1_ZH_TW:
    '寄賣期限為3個月。到期日前若未提出特別要求，寄賣合約將自動續約。',
  tips1_EN:
    'The consignment is valid for 3 months. If no special request is made before this expiration date, the consignment contact will be automatically renewed.',
  tips1_JA:
    '委託販売の期間は3ヶ月です。期限日までに申告がなければ、委託販売契約は自動更新されます。',
  //
  tips2_ZH_CN:
    '寄卖满1个月后，您可联系客服终止寄卖。合约未满1个月，恕无法受理。',
  tips2_ZH_TW:
    '寄賣滿1個月後，您可聯繫客服終止寄賣。合約未滿1個月，恕無法受理。',
  tips2_EN:
    'After 1 month of consignment, you have the option to cancel the consignment by contacting customer service.',
  tips2_JA:
    '委託販売から1ヶ月経過後、カスタマーサービスに連絡して委託販売を終了することができます。契約期間が1ヶ月未満の場合は、委託販売取消の対応ができませんので、予めご了承ください。',
  //
  tips3_ZH_CN: '寄卖期间已收取销售订金的商品将无法退还，敬请谅解。',
  tips3_ZH_TW: '寄賣期間已收取銷售訂金的商品將無法退還，敬請諒解。',
  tips3_EN:
    'Requests for cancellation will not be accepted before 1 month of the contract. For items which a sales deposit has been made during the consignment period, returns will not be accepted.',
  tips3_JA:
    '委託販売期間中に、頭金を受け取っている委託販売商品が返却できませんので、予めご了承ください。',
  //
  tips4_ZH_CN:
    '商品卖出并收到全款后，我们将根据签约的币种和金额汇款至您本人账户。',
  tips4_ZH_TW:
    '商品賣出並收到全款後，我們將根據簽約的幣種和金額匯款至您本人賬戶。',
  tips4_EN:
    'Once the item is sold and full payment is received, we will transfer the amount to your personal account according to the contracted currency and offer.',
  tips4_JA:
    '委託販売商品が売れ、全額を受け取った後、契約時に選択いただいた通貨と金額でお客様の口座に振り込みます。',
  //
  tips5_ZH_CN:
    '如若发现寄卖品为赃物、仿冒品等涉及不正行为的商品，我们将保留法律追究的权利。',
  tips5_ZH_TW:
    '如若發現寄賣品為贓物、仿冒品等涉及不正行為的商品，我們將保留法律追究的權利。',
  tips5_EN:
    'If it is found that the consigned item involves illegal activities such as stolen goods or counterfeit, we reserve the right to pursue legal action.',
  tips5_JA:
    '委託販売商品が盗品や模倣品などの不正行為に関連する商品であることが判明した場合、法的責任を追及する権利を留保します。',
  iAgree_ZH_CN: '我已阅读并同意GINZA XIAOMA寄卖服务条款',
  iAgree_ZH_TW: '我已閱讀並同意GINZA XIAOMA寄賣服務條款',
  iAgree_EN: `I have read and agree to the terms and conditions of GINZA XIAOMA's consignment service.`,
  iAgree_JA:
    'GINZA XIAOMAの委託販売サービス規約を読みました。以上は、同意しました。',
  //
  addressHk_ZH_CN: '香港中环皇后大道中16-18号新世界大厦1座1705',
  addressHk_ZH_TW: `Flat 1705, New World Tower 1, 16-18 Queen's Road Central, Central`,
  addressHk_EN: `Flat 1705, New World Tower 1, 16-18 Queen's Road Central, Central`,
  addressHk_JA: `Flat 1705, New World Tower 1, 16-18 Queen's Road Central, Central`,
  //
  addressJP_ZH_CN: '〒104-0061 日本东京都中央区银座7丁目6-11一楼',
  addressJP_ZH_TW: '〒104-0061 日本東京都中央區銀座7丁目6-11一樓',
  addressJP_EN: '〒104-0061 Ginza 7-6-11, Chuo-kuTokyo, Japan',
  addressJP_JA:
    'GINZA XIAOMA　銀座店　〒104−0061 日本·東京都中央区銀座 7-6-11 1階',
  //
  addressSG_ZH_CN: '新加坡乌节路391号义安城B座2305室',
  addressSG_ZH_TW: '#23-05, Ngee Ann City Tower B, 391B Orchard Road',
  addressSG_EN: '#23-05, Ngee Ann City Tower B, 391B Orchard Road',
  addressSG_JA: '#23-05, Ngee Ann City Tower B, 391B Orchard Road',
  //
  consignmentCompleted_ZH_CN: '寄卖完成',
  consignmentCompleted_ZH_TW: '寄賣完成  ',
  consignmentCompleted_EN: 'Consignment completed',
  consignmentCompleted_JA: '委託販売取引完了',
  //
  automaticRenewal_ZH_CN: '自动续约',
  automaticRenewal_ZH_TW: '自动续约',
  automaticRenewal_EN: 'Automatic renewal',
  automaticRenewal_JA: '自動更新',
  //
  priceAdjustment_ZH_CN: '价格调整',
  priceAdjustment_ZH_TW: '價格調整',
  priceAdjustment_EN: 'Price adjustment',
  priceAdjustment_JA: '価格調整',
  //
  consignmentCancelled_ZH_CN: '寄卖取消',
  consignmentCancelled_ZH_TW: '寄賣取消',
  consignmentCancelled_EN: 'Consignment cancelled',
  consignmentCancelled_JA: '委託販売取消',
  //
  consignmentToSellNow_ZH_CN: '寄卖转回收',
  consignmentToSellNow_ZH_TW: '寄賣轉回收',
  consignmentToSellNow_EN: 'Consignment to Sell Now',
  consignmentToSellNow_JA: '委託販売を買取に変更',
  //
  contractSigned_ZH_CN: '签订合同',
  contractSigned_ZH_TW: '簽訂合同',
  contractSigned_EN: 'Contract signed',
  contractSigned_JA: '契約',
  //
  hongKongStore_ZH_CN: '香港店',
  hongKongStore_ZH_TW: '香港店',
  hongKongStore_EN: 'Hong Kong store',
  hongKongStore_JA: '香港店',
  //
  ginzaStore_ZH_CN: '银座店',
  ginzaStore_ZH_TW: '銀座店',
  ginzaStore_EN: 'Ginza store',
  ginzaStore_JA: '銀座店',
  //
  singaporeStore_ZH_CN: '新加坡店',
  singaporeStore_ZH_TW: '新加坡店',
  singaporeStore_EN: 'Singapore store',
  singaporeStore_JA: 'シンガポール',
  //
  extras_ZH_CN: '附属品',
  extras_ZH_TW: '附屬品',
  extras_EN: 'Extras',
  extras_JA: '付属品',
  //
  ship_ZH_CN: '邮寄',
  ship_ZH_TW: '邮寄',
  ship_EN: 'Ship',
  ship_JA: '郵送',
  //
  cash_ZH_CN: '现金结算',
  cash_ZH_TW: '現金結算',
  cash_EN: 'Cash',
  cash_JA: '現金決済',
  //
  bankTransfer_ZH_CN: '银行汇款',
  bankTransfer_ZH_TW: '銀行匯款',
  bankTransfer_EN: 'Bank transfer',
  bankTransfer_JA: '銀行振込',
  //
  transactionComplete_ZH_CN: '交易完成',
  transactionComplete_ZH_TW: '交易完成',
  transactionComplete_EN: 'Transaction complete',
  transactionComplete_JA: '取引完了',
  //
  consigned_ZH_CN: '寄卖中',
  consigned_ZH_TW: '寄賣中',
  consigned_EN: 'Consigned',
  consigned_JA: '委託販売中',


  sign_EN: 'Sign',
  sign_JA: '署名',
  sign_ZH_CN: '签名',
  sign_ZH_TW: '簽名',
};

export const langMappingFunc = (text: string, lang: string, param: any) => {
  const {
    currency,
    finalSalePrice,
    settlement,
    newEndTime,
    newEndTime_EN,
    diff,
    diff_EN,
    newPrice,
    oldPrice,
    return_express_company,
    return_tracking_number,
  } = param;
  const langMapping: Mapping = {
    consignmentCompletedTips_ZH_CN: `寄卖商品已出卖结算，结算金额:${currency} ${finalSalePrice}（${settlement}），寄卖交易完成`,
    consignmentCompletedTips_ZH_TW: `寄賣商品已出賣結算，結算金額:${currency} ${finalSalePrice}（${settlement}），寄賣交易完成`,
    consignmentCompletedTips_EN: `The consigned item has been sold and settled, with a settlement of ${finalSalePrice} ${currency} (${settlement}), the consignment transaction is now complete.`,
    consignmentCompletedTips_JA: `委託いただいた商品が決済金額:${currency} ${finalSalePrice}（${settlement}）で販売し、当委託販売取引が完了しました。`,

    automaticRenewalTips_ZH_CN: `本次寄卖已期满3个月，自动续期至${newEndTime}`,
    automaticRenewalTips_ZH_TW: `本次寄賣已期满3个月，自勤续期至${newEndTime}`,
    automaticRenewalTips_EN: `This consignment has reached its 3 month expiration date and has been automatically renewed until ${newEndTime_EN}`,
    automaticRenewalTips_JA: `今回の委託販売は既に3ヶ月が経過し、自動的に〜に更新されました${newEndTime}`,

    priceAdjustmentTips_ZH_CN: `本次寄卖的契约价格由即日起${diff}调至 ${currency} ${newPrice}(原报价:${currency} ${oldPrice})`,
    priceAdjustmentTips_ZH_TW: `本次寄賣的契約價格由即日起${diff}調至 ${currency} ${newPrice}(原報價:${currency} ${oldPrice})`,
    priceAdjustmentTips_EN: `The contract price for this consignment has been ${diff_EN} to ${newPrice} ${currency} (original quote: ${oldPrice} ${currency})`,
    priceAdjustmentTips_JA: `委託販売の価格を即日より ${currency} ${newPrice}に調整しました。`,

    consignmentCancelledTips_ZH_CN: `寄商品已退回（${return_express_company} / ${return_tracking_number}），本次寄卖交易终止`,
    consignmentCancelledTips_ZH_TW: `寄商品已退回（${return_express_company} / ${return_tracking_number}），本次寄賣交易終止`,
    consignmentCancelledTips_EN: `The consigned item has been returned (${return_express_company} / ${return_tracking_number}), and the transaction for this item has been cancelled.`,
    consignmentCancelledTips_JA: `委託販売された商品が返却されました（${return_express_company} / ${return_tracking_number}），当委託販売取引は終了しました。`,

    consignmentToSellNowTips_ZH_CN: `本次寄卖转为即时回收，结算金额:${currency} ${newPrice}，回收交易完成`,
    consignmentToSellNowTips_ZH_TW: `本次寄賣轉爲即時回收，結算金額:${currency} ${newPrice}，回收交易完成`,
    consignmentToSellNowTips_EN: `This consignment has been converted to Sell Now, settlement amount: ${newPrice} ${currency}, Sell transaction is completed.`,
    consignmentToSellNowTips_JA: `当委託販売が即時買取に変更され、決済金額:${currency} ${newPrice}，で買取しました。買取取引が完了しました。`,

    contractSignedTips_ZH_CN: `与我司签订了寄卖合同`,
    contractSignedTips_ZH_TW: `與我司簽訂了寄賣合同`,
    contractSignedTips_EN: `You signed the consignment contract with our company`,
    contractSignedTips_JA: `弊社と委託販売契約を締結しました`,
  };
  return langMapping[`${text}_${lang.toUpperCase()}`];
};

export const StoreMaping: any = {
  '1': 'ginzaStore',
  '2': 'hongKongStore',
  '3': 'singaporeStore',
};

export const contractTypeMaping: any = {
  '1': 'automaticRenewal',
  '2': 'consignmentToSellNow',
  '3': 'consignmentCancelled',
  '4': 'consignmentCancelled',
  '5': 'consignmentCompleted',
  '6': 'priceAdjustment',
  '7': 'contractSigned',
};

/** PDF接口地址 */
export const nodejsPdfUrlPrefix =
  process.env.NODE_ENV === 'development'
    ? 'https://test-store2.ginzaxiaoma.com/nodejs-pdf'
    : `${window.location.origin}/nodejs-pdf`;
// process.env.NODE_ENV === 'development'
//   ? 'http://localhost:3333'
//   : `https://test-store2.ginzaxiaoma.com/nodejs-pdf`;

// const t = [
//   'tips1',
//   'tips2',
//   'tips3',
// ];
// const c = ['_ZH_CN', '_ZH_TW', '_EN', '_JA'];
// let a = {};

// t.map((d) => {
//   c.map((cc) => {
//     a[`${d}${cc}`] =000;
//   });
// });
// console.log('🚀  a:', JSON.stringify(a));
