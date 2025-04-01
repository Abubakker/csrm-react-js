import { OmsRecycleOrder } from 'types/oms';
import i18n from '../i18n';
import LOCALS from '../commons/locals';

interface Info {
  label: string;
  value?: string;
}

const GetPaymentInfo = (data: OmsRecycleOrder) => {
  let paymentInfo: Info[] = [];
  const {
    memberPaymentAccountAddress,
    memberPaymentAccountName,
    memberPaymentAccountNo,
    memberPaymentAccountType,
    memberPaymentBankAddress,
    memberPaymentBankCountry,
    memberPaymentBangGo,
    memberPaymentKiGo,
    memberPaymentBankName,
    memberPaymentBankNo,
    memberPaymentSwiftCode,
    memberPaymentPayNowNo,
    memberPaymentPayNowAccountName,
    memberPaymentFpsNo,
    memberPaymentFpsAccountName,
    memberPaymentRoutingNo,
    memberPaymentBankPhone,
    memberPaymentAccountSubType,
  } = data;
  const payment = {
    AccountName: { label: i18n.t(LOCALS.account_holder_name), value: memberPaymentAccountName },
    AccountNo: { label: i18n.t(LOCALS.account_number), value: memberPaymentAccountNo },
    AccountAddress: { label: i18n.t(LOCALS.account_holder_address), value: memberPaymentAccountAddress },
    AccountType: {
      label: '账户类型',
      value: ['', i18n.t(LOCALS.bank_transfer), 'FPS转账', 'PayNow转账'][
        memberPaymentAccountSubType || 0
      ],
    },
    AccountSubType: {
      label: i18n.t(LOCALS.payment_type),
      value: ['', '海外账户', '香港账户'][memberPaymentAccountType || 0],
    },
    BankName: { label: i18n.t(LOCALS.bank_name), value: memberPaymentBankName },
    BankAddress: { label:  i18n.t(LOCALS.bank_address), value: memberPaymentBankAddress },
    BankCountry: { label: i18n.t(LOCALS.location), value: memberPaymentBankCountry },
    BankPhone: { label: '银行预留电话', value: memberPaymentBankPhone || '-' },
    BankNo: { label: '银行编号', value: memberPaymentBankNo || '-' },
    BangGo: { label: '番号（日本专用）', value: memberPaymentBangGo || '-' },
    KiGo: { label: '记号（日本专用）', value: memberPaymentKiGo || '-' },
    PayNowNo: { label: 'PayNow账号', value: memberPaymentPayNowNo || '-' },
    PayNowAccountName: {
      label: 'PayNow账户人名字',
      value: memberPaymentPayNowAccountName || '-',
    },
    FpsNo: { label: 'FPS账号', value: memberPaymentFpsNo || '-' },
    FpsAccountName: {
      label: 'FPS账户人名字',
      value: memberPaymentFpsAccountName || '-',
    },
    SwiftCode: { label: 'SWIFT Code', value: memberPaymentSwiftCode || '-' },
    RoutingNo: { label: 'Routing No', value: memberPaymentRoutingNo || '-' },
  };
  // 香港
  if (memberPaymentAccountType === 2) {
    // 银行转账
    if (memberPaymentAccountSubType === 1) {
      paymentInfo = [
        {
          label: i18n.t(LOCALS.receiving_account),
          value: '香港账户',
        },
        {
          label: i18n.t(LOCALS.payment_type),
          value: '银行F转账',
        },
        payment.BankName,
        payment.BankNo,
        payment.AccountName,
        payment.AccountNo,
      ];
    }
    // FPS转账
    if (memberPaymentAccountSubType === 2) {
      paymentInfo = [
        {
          label: i18n.t(LOCALS.receiving_account),
          value: '香港账户',
        },
        {
          label: i18n.t(LOCALS.payment_type),
          value: 'FPS转账',
        },
        payment.AccountSubType,
        payment.FpsAccountName,
        payment.FpsNo,
      ];
    }
  } else if (memberPaymentAccountType === 3) {
    // 日本 银行
    const JP_Payment = [
      {
        label: i18n.t(LOCALS.receiving_account),
        value: '日本账户',
      },
      {
        label: i18n.t(LOCALS.payment_type),
        value: i18n.t(LOCALS.bank_transfer),
      },
      payment.BankName,
      payment.BankAddress,
      payment.AccountName,
      payment.AccountNo,
      payment.KiGo,
      payment.BangGo,
    ];
    // 日本
    paymentInfo = JP_Payment;
  } else if (memberPaymentAccountType === 4) {
    // 新加坡 银行
    const SG_Payment = [
      {
        label: i18n.t(LOCALS.receiving_account),
        value: '新加坡账户',
      },
      {
        label: i18n.t(LOCALS.payment_type),
        value: i18n.t(LOCALS.bank_transfer),
      },
      payment.BankName,
      payment.BankAddress,
      payment.SwiftCode,
      payment.AccountName,
      payment.AccountNo,
      payment.AccountAddress,
      payment.BankPhone,
    ];
    // 新加坡 PayNow
    const SG_PayNow = [
      {
        label: i18n.t(LOCALS.receiving_account),
        value: 'PayNow转账',
      },
      payment.PayNowAccountName,
      payment.PayNowNo,
    ];
    // 新加坡 银行
    if (memberPaymentAccountSubType === 1) {
      paymentInfo = SG_Payment;
    }
    // 新加坡 PayNow
    if (memberPaymentAccountSubType === 3) {
      paymentInfo = SG_PayNow;
    }
  } else {
    if (memberPaymentBankCountry === 'USA') {
      paymentInfo = [
        {
          label: i18n.t(LOCALS.receiving_account),
          value: i18n.t(LOCALS.overseas_account)||'海外账户',
        },
        {
          label: i18n.t(LOCALS.payment_type),
          value: i18n.t(LOCALS.bank_transfer)||'银行转账',
        },
        payment.BankCountry,
        payment.BankName,
        payment.BankAddress,
        payment.SwiftCode,
        payment.AccountName,
        payment.RoutingNo,
        payment.AccountNo,
        payment.AccountAddress,
      ];
    } else {
      paymentInfo = [
        {
          label: i18n.t(LOCALS.receiving_account),
          value: i18n.t(LOCALS.overseas_account)||'海外账户',
        },
        {
          label: i18n.t(LOCALS.payment_type),
          value: i18n.t(LOCALS.bank_transfer)||'银行转账',
        },
        payment.BankCountry,
        payment.BankName,
        payment.BankAddress,
        payment.SwiftCode,
        payment.AccountName,
        payment.AccountNo,
        payment.AccountAddress,
      ];
    }
  }

  return paymentInfo;
};

export default GetPaymentInfo;
