import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  nodejsPdfUrlPrefix,
  langMapping,
  StoreMaping,
  contractTypeMaping,
} from './constants';
import style_cn from './index.module.scss';
import style_en from './index.en.module.scss';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import {
  LogoSVG,
  getContractContent,
  getTimeFormat,
  getFooterData,
} from './utils';
import { thousands } from 'utils/tools';
import useProductFormData from 'commons/hooks/useProductFormData';
import { SHOP_MAP } from 'commons/options';

let printsCount = 0;

const Contract = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const lang = queryParams.get('lang') || 'ja';
  const type = Number(queryParams.get('type')) || 1;
  const prints = Number(queryParams.get('prints'));
  const { id, pwd } = useParams<{ id: string; pwd: string }>();

  const [dataSource, setDatasource] = useState<any>({});
  const [userInfo, setUserInfo] = useState<any>({});
  const [productInfo, setProductInfo] = useState<any>({});
  const [contractList, setContractList] = useState<any>([]);
  const [footerData, setFooterData] = useState<any>({});
  const [styles, setStyles] = useState<any>(style_cn);

  const { setProductInfo: setProductInfo_use, showData } = useProductFormData();

  useEffect(() => {
    if (
      prints &&
      Object.keys(productInfo).length &&
      Object.keys(showData).length &&
      printsCount === 0
    ) {
      window.print();
      printsCount++;
    }
  }, [prints, productInfo, showData]);

  /** 语言不同显示内容不同 */
  useEffect(() => {
    if (!lang) return;
    if (['zh_CN', 'ja', 'zh_TW'].includes(lang)) {
      setStyles(style_cn);
    } else {
      setStyles(style_en);
    }
  }, [lang]);

  /** 语言显示 */
  const getLang = useCallback(
    (text: string) => {
      if (text) return langMapping[`${text}_${lang.toUpperCase()}`];
      return text;
    },
    [lang]
  );

  useEffect(() => {
    if (Object.keys(dataSource).length === 0) return;

    const {
      RecycleOrder,
      RecycleOrderItem,
      RecycleOrderLogistics,
      Product,
      RecycleOrderContractLog = [],
      Country,
      City,
    } = dataSource;
    const { settlement_type = 0 } = RecycleOrder;

    let full_cname = RecycleOrderLogistics.country;
    if (Country) {
      const temp = JSON.parse(Country.name_i18n);
      if (['cn', 'ja', 'tc'].includes(lang)) {
        full_cname = temp.zh_CN + ' ';
      } else {
        full_cname = temp.en + ' ';
      }
    }
    /** 用户信息 */
    let cityName = '';
    if (City) {
      const temp = JSON.parse(City.name_i18n);
      if (['cn', 'ja', 'tc'].includes(lang)) {
        cityName = (temp.zh_CN || '') + ' ';
      } else {
        cityName = (temp.en || temp.zh_CN) + ' ';
      }
    }
    const settlement = settlement_type
      ? `[${
          ['', getLang('cash'), getLang('bankTransfer')][settlement_type || 0]
        }] `
      : '';

    let chargeName = getLang(StoreMaping[RecycleOrder.store_id || 1]);

    const user = {
      name: RecycleOrderLogistics.name,
      code: RecycleOrder.code,
      address: `${full_cname || ''}${cityName || ''}${
        RecycleOrderLogistics.detail_address || ''
      }`,
      phone: '',
      paymentInfo: '',
      time: getTimeFormat(
        RecycleOrderItem.agree_final_valuation_time,
        'YYYY-MM-DD'
      ),
      chargeName,
      idCard: RecycleOrder.member_credential_no,
      type: RecycleOrder.type === 1 ? getLang('ship') : chargeName,
    };
    // 预约和到店取值不同
    let phone = RecycleOrderLogistics.phone
      ? `+${RecycleOrderLogistics.phone}`
      : `+${RecycleOrder.phone}`;
    let name1 = RecycleOrderLogistics.name
      ? RecycleOrderLogistics.name
      : RecycleOrder.name;
    // let address = RecycleOrderLogistics.name ? RecycleOrderLogistics.name : RecycleOrder.name;

    user.phone = phone;
    user.name = name1;
    if (settlement_type === 1) {
      user.paymentInfo = settlement;
    } else {
      if (
        RecycleOrder.member_payment_bank_name &&
        RecycleOrder.member_payment_account_no
      ) {
        user.paymentInfo = `${settlement} ${
          RecycleOrder.member_payment_bank_name
        } ${RecycleOrder.member_payment_account_no || ''}`;
      }
    }
    setUserInfo(user);
    /** 产品信息 */
    const FinalPrice =
      RecycleOrder.type === 2
        ? thousands(RecycleOrderItem.final_recycle_price)
        : thousands(RecycleOrderItem.final_sale_price);
    let stampSelect: string;
    let colorSelect: string[];
    let materialSelect: string[];
    let hardwareSelect: string[];
    let rankSelect: string;
    let accessorySelect: string[];
    if (lang === 'tc') {
      stampSelect = showData.stampSelectLabel_TC!;
      colorSelect = showData.colorSelectLabelList_TC!;
      materialSelect = showData.materialSelectLabelList_TC!;
      hardwareSelect = showData.hardwareSelectLabel_TC!;
      rankSelect = showData.rankSelectLabel_TC!;
      accessorySelect = showData.accessorySelectLabel_TC!;
    } else if (lang === 'ja') {
      stampSelect = showData.stampSelectLabel_JA!;
      colorSelect = showData.colorSelectLabelList_JA!;
      materialSelect = showData.materialSelectLabelList_JA!;
      hardwareSelect = showData.hardwareSelectLabel_JA!;
      rankSelect = showData.rankSelectLabel_JA!;
      accessorySelect = showData.accessorySelectLabel_JA!;
    } else if (lang === 'en') {
      stampSelect = showData.stampSelectLabel_EN!;
      colorSelect = showData.colorSelectLabelList_EN!;
      materialSelect = showData.materialSelectLabelList_EN!;
      hardwareSelect = showData.hardwareSelectLabel_EN!;
      rankSelect = showData.rankSelectLabel_EN!;
      accessorySelect = showData.accessorySelectLabel_EN!;
    } else {
      stampSelect = showData.stampSelectLabel!;
      colorSelect = showData.colorSelectLabelList!;
      materialSelect = showData.materialSelectLabelList!;
      hardwareSelect = showData.hardwareSelectLabel!;
      rankSelect = showData.rankSelectLabel!;
      accessorySelect = showData.accessorySelectLabel!;
    }
    const name = (
      <>
        <span>{stampSelect}</span>
        &nbsp;&nbsp;&nbsp;
        <span>HERMES</span>
        &nbsp;&nbsp;&nbsp;
        <span>{colorSelect}</span>
        &nbsp;&nbsp;&nbsp;
        <span>{materialSelect}</span>
        &nbsp;&nbsp;&nbsp;
        <span>{hardwareSelect}</span>
        &nbsp;&nbsp;&nbsp;
        <span>{rankSelect}</span>
      </>
    );
    const product = {
      code: RecycleOrder.code,
      productId: Product.id,
      productDesc: name,
      // type (integer, optional): 回收类型 : 0-未确认，1-寄卖，2-回收
      price: FinalPrice,
      status:
        RecycleOrder.status === 9
          ? getLang('transactionComplete') // 交易完成
          : getLang('consigned'), // 寄卖中
      currency: RecycleOrder.currency,
      accessorySelectLabel: accessorySelect?.join('、'),
    };
    // console.log('🚀  product:', product);
    setProductInfo(product);
    /** 合同记录 */
    const list: any = [];
    RecycleOrderContractLog.forEach((d: any) => {
      // contractTypeMaping contractType[d.type]
      list.push({
        id: d.id,
        type: getLang(contractTypeMaping[d.type]),
        content: getContractContent(d, {
          settlement_type,
          currency: RecycleOrder.currency,
          final_sale_price: RecycleOrderItem.final_sale_price,
          lang,
        }),
        time: getTimeFormat(d.create_time, 'YYYY-MM-DD'),
        show: ![1].includes(d.type), // 显示签名
      });
    });
    setContractList(list);
    /** 尾页记录 */
    let storeId: number = 1;
    if (
      [SHOP_MAP.GINZA, SHOP_MAP.HONGKONG, SHOP_MAP.SINGAPORE].includes(
        RecycleOrder.store_id
      )
    ) {
      storeId = RecycleOrder.store_id;
    }
    const footer = getFooterData(storeId);
    setFooterData(footer);
  }, [dataSource, showData, lang, getLang]);

  const getDetail = useCallback(() => {
    axios
      .get(`${nodejsPdfUrlPrefix}/getOrderDetail?id=${id}&pwd=${pwd}`)
      .then(function (response) {
        setDatasource(response.data.data);
        const { Product } = response.data.data;
        const prod = {
          ...Product,
          attrColor: Product.color,
          attrHardware: Product.hardware,
          attrMaterial: Product.material,
          attrStamp: Product.stamp,
          productCategoryId: Product.product_category_id,
          attrAccessory: Product.accessory,
          albumPics: Product.album_pics,
        };
        setProductInfo_use(prod);
      })
      .catch(function (error) {
        console.error(error);
      })
      .finally(() => {
        getLoad();
      });
  }, [id, pwd, setProductInfo_use]);

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  /** 延迟100ms返回结果 确保页面已经渲染完成 */
  const getLoad = () => {
    axios.get(`${nodejsPdfUrlPrefix}/`).then(function (response) {});
  };

  /** 签名 */
  const Signature = () => (
    <div className="flex">
      <div className="text flex-shrink-0 self-end">{getLang('sign')}：</div>
      <div className="w-full border-b shrink-0">
        {!!dataSource?.RecycleOrder?.sign_url && (
          <img
            className="h-24"
            src={dataSource?.RecycleOrder?.sign_url}
            alt="sign"
          />
        )}
      </div>
    </div>
  );

  const orderType = useMemo(() => {
    return dataSource?.RecycleOrder?.type || 0;
  }, [dataSource]);

  // 寄卖合同 用户信息展示
  const userInfoRender = () => {
    return (
      <div className={styles['userInfo']}>
        <div className={`${styles['userArea']} ${styles['userInfo_left']}`}>
          <div className={styles['top']}>
            <div className={styles['label']}>
              {/* 寄賣方 */}
              <div>{getLang('consignor')}</div>
              <div className={'colon'}>:</div>
            </div>
            <div className={styles['text']}>{userInfo.name}</div>
          </div>

          <div className={styles['userDetail']}>
            <div className={styles['itemsWarp']}>
              <div className={styles['items']}>
                <div className={styles['label']}>
                  {/* 地址 */}
                  <div>{getLang('address')}</div>
                  <div className={'colon'}>:</div>
                </div>
                <div className={styles['text']}>{userInfo.address}</div>
              </div>
              <div className={styles['items']}>
                <div className={styles['label']}>
                  {/* 電話 */}
                  <div>{getLang('phone')}</div>
                  <div className={'colon'}>:</div>
                </div>
                <div className={styles['text']}>{userInfo.phone}</div>
              </div>
              <div className={styles['items']}>
                <div className={styles['label']}>
                  {/* ID / 護照號 */}
                  <div>{getLang('id/passportNumber')}</div>
                  <div className={'colon'}>:</div>
                </div>
                <div className={styles['text']}>{userInfo.idCard}</div>
              </div>
              {/* 結算方式 */}
              {/* <div className={styles['items']}>
          <div className={styles['label']}>
            <div>{getLang('transactionMethod')}</div>
            <div className={'colon'}>:</div>
          </div>
          <div className={styles['text']}>{userInfo.paymentInfo}</div>
        </div> */}
            </div>
          </div>
        </div>
        <div className={`${styles['userArea']} ${styles['userInfo_right']}`}>
          <div className={styles['top']}>
            <div className={styles['label']}>
              {/* 寄賣單號 */}
              <div>{getLang('consignmentNumber')}</div>
              <div className={'colon'}>:</div>
            </div>
            <div className={`${styles['text']} order_id`}>
              {userInfo.code || '123456'}
            </div>
          </div>
          <div className={styles['userDetail']}>
            <div className={styles['itemsWarp']}>
              <div className={styles['items']}>
                <div className={styles['label']}>
                  {/* 日期 */}
                  <div>{getLang('date')}</div>
                  <div className={'colon'}>:</div>
                </div>
                <div className={styles['text']}>{userInfo.time}</div>
              </div>
              <div className={styles['items']}>
                <div className={styles['label']}>
                  {/* 擔當 */}
                  <div>{getLang('representative')}</div>
                  <div className={'colon'}>:</div>
                </div>
                <div className={styles['text']}>{userInfo.chargeName}</div>
              </div>
              {/* 寄賣方式 */}
              {/* <div className={styles['items']}>
          <div className={styles['label']}>
            <div>{getLang('consignmentMethod')}</div>
            <div className={'colon'}>:</div>
          </div>
          <div className={styles['text']}>{userInfo.type}</div>
        </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 回收合同 信息展示
  const infoRender = () => {
    return (
      <div className={styles['userInfo']}>
        <div className={`${styles['userArea']} ${styles['userInfo_left']}`}>
          <div className={styles['userDetail']}>
            <div className={styles['itemsWarp']}>
              <div className={styles['items']}>
                <div className={styles['label']}>
                  {/* 寄賣單號 */}
                  <div>{getLang('RecoveryNumber')}</div>
                  <div className={'colon'}>:</div>
                </div>
                <div className={`${styles['text']} order_id`}>
                  {userInfo.code || '123456'}
                </div>
              </div>
              <div className={styles['items']}>
                <div className={styles['label']}>
                  {/* 擔當 */}
                  <div>{getLang('representative')}</div>
                  <div className={'colon'}>:</div>
                </div>
                <div className={styles['text']}>{userInfo.chargeName}</div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles['userArea']} ${styles['userInfo_right']}`}>
          <div className={styles['userDetail']}>
            <div className={styles['itemsWarp']}>
              <div className={styles['items']}>
                <div className={styles['label']}>
                  {/* 日期 */}
                  <div>{getLang('date')}</div>
                  <div className={'colon'}>:</div>
                </div>
                <div className={styles['text']}>{userInfo.time}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 寄卖合同 合同变更
  const contractContext = () => {
    return (
      <div className={styles['contract']}>
        <div className={styles['subTitle']}>
          {/* 合同变更记录 */}
          {getLang('contractModificationRecord')}
        </div>
        <div className={styles['table']}>
          <div className={styles['thead']}>
            <div className={styles['tr']}>
              <div className={styles['th']} style={{ width: '15%' }}>
                {/* 類型 */}
                {getLang('type')}
              </div>
              <div className={styles['th']} style={{ width: '70%' }}>
                {/* 變更內容 */}
                {getLang('modifiedDetails')}
              </div>
              <div className={styles['th']} style={{ width: '15%' }}>
                {/* 變更日期 */}
                {getLang('dateOfModification')}
              </div>
            </div>
          </div>
          <div className={styles['tbody']}>
            {contractList.map((d: any) => (
              <div className={styles['tr']} key={d.id}>
                <div className={styles['trWarp']}>
                  <div className={styles['td']} style={{ width: '15%' }}>
                    {d.type}
                  </div>
                  <div className={styles['td']} style={{ width: '70%' }}>
                    {d.content}
                  </div>
                  <div className={styles['td']} style={{ width: '15%' }}>
                    {d.time}
                  </div>
                </div>
                {/* {d.show && [2, 3].includes(type) && (
                      <div className={styles['signatureWarp']}>
                        <Signature />
                      </div>
                    )} */}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 条文细则
  const tipsContext = () => {
    return (
      <div className={styles['tips']}>
        <div className={styles['left']}>
          {orderType === 1 && (
            <ul>
              <li>{getLang('tips1')}</li>
              <li>{getLang('tips2')}</li>
              <li>{getLang('tips3')}</li>
              <li>{getLang('tips4')}</li>
              <li>{getLang('tips5')}</li>
            </ul>
          )}
        </div>
        <div
          className={styles['right']}
          style={{ height: orderType === 2 ? 300 : '' }}
        >
          <div className={styles['checkbox']}>
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.25"
                y="0.25"
                width="7.5"
                height="7.5"
                fill="white"
                stroke="black"
                strokeWidth="0.5"
              />
              <path
                d="M5.96071 2.5H5.61807C5.57004 2.5 5.52445 2.52097 5.49504 2.55685L3.47404 4.99049L2.50496 3.82329C2.4903 3.8056 2.47162 3.79129 2.45031 3.78145C2.429 3.7716 2.40562 3.76647 2.38193 3.76644H2.03929C2.00645 3.76644 1.98832 3.80232 2.00841 3.82655L3.35101 5.44339C3.41375 5.51887 3.53433 5.51887 3.59756 5.44339L5.99159 2.55964C6.01168 2.53588 5.99355 2.5 5.96071 2.5Z"
                fill="black"
                stroke="black"
                strokeWidth="0.5"
              />
            </svg>
            {/* 我已閱讀並同意GINZA XIAOMA寄賣服務條款 */}
            {getLang('iAgree')}
          </div>
          <div className={styles['signatureWarp']}>
            <Signature />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div id={styles['A4']}>
        <div className={styles['A4_Warp']}>
          {[1, 2].includes(type) && orderType === 1 && (
            <div className={styles['marker']}>
              {/* 寄賣方存本 */}
              {getLang('consignorsCopy')}
            </div>
          )}
          <div className={styles['head']}>
            <div className={styles['logo']}>
              <div className={styles['img']}>
                <LogoSVG />
              </div>
            </div>
            <div className={styles['title']}>
              {/* 寄賣合約 */}
              {orderType === 1
                ? getLang('consignmentContract')
                : getLang('recallContract')}
            </div>
          </div>
          {/* 寄卖合同 用户信息展示 */}
          {orderType === 1 && userInfoRender()}
          {/* 回收合同 信息展示 */}
          {orderType === 2 && infoRender()}
          {/* 产品信息 */}
          <div className={styles['product']}>
            <div className={styles['table']}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '16%' }}>
                      {/* 訂單編號 */}
                      {getLang('orderNumber')}
                    </th>
                    {[3].includes(type) && (
                      // 商品編號
                      <th style={{ width: '15%' }}>
                        {getLang('productNumber')}
                      </th>
                    )}
                    <th style={{ width: '34%' }}>
                      {/* 商品描述 */}
                      {getLang('itemDescription')}
                    </th>
                    {orderType === 1 && (
                      <th style={{ width: '15%' }}>
                        {/* 狀態 */}
                        {getLang('status')}
                      </th>
                    )}
                    <th style={{ width: '20%' }}>
                      {/* 寄賣金額 */}
                      {getLang('consignmentPrice')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{productInfo.code}</td>
                    {[3].includes(type) && <td>{productInfo.productId}</td>}
                    <td>
                      <div>{productInfo.productDesc}</div>
                      <div>
                        {/* 附屬品 */}
                        {getLang('extras')}：{productInfo.accessorySelectLabel}
                      </div>
                    </td>
                    {orderType === 1 && (
                      <td className={styles['status']}>{productInfo.status}</td>
                    )}
                    <td>
                      {productInfo.currency}&nbsp;&nbsp;
                      {productInfo.price}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles['bottom']}>
              <table>
                <tbody>
                  <tr>
                    <th style={{ width: '15%' }}>&nbsp;</th>
                    {/* <th style={{ width: '15%' }}>&nbsp;</th> */}
                    <th style={{ width: '55%' }}>&nbsp;</th>
                    <th style={{ width: '15%' }}>
                      {/* 總計 */}
                      {getLang('total')}：
                    </th>
                    <th style={{ width: '15%' }}>
                      {productInfo.currency}&nbsp;&nbsp;
                      {productInfo.price}
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* 寄卖合同 合同信息展示 */}
          {orderType === 1 && contractContext()}
          {/* 条文细则 */}
          {tipsContext()}

          <div className={styles['footer']}>
            <div className={styles['left']}>{getLang(footerData.address)}</div>
            <div className={styles['right']}>
              <div className={styles['tel']}>
                <div className={styles['icon']}>
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 8 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.81058 4.88339C5.71649 4.78953 5.58901 4.73681 5.4561 4.73681C5.32319 4.73681 5.19571 4.78953 5.10162 4.88339L4.74713 5.23787C4.54661 5.4384 3.89729 5.23881 3.32926 4.67071C2.76121 4.10261 2.56126 3.45361 2.76209 3.25284L2.76253 3.2524L3.11658 2.89835C3.21044 2.80426 3.26316 2.67678 3.26316 2.54387C3.26316 2.41096 3.21044 2.28348 3.11658 2.18938L1.55683 0.629701C1.46275 0.53584 1.33528 0.483128 1.20238 0.483128C1.06948 0.483128 0.94201 0.53584 0.847926 0.629701L0.493441 0.984186C0.23151 1.24612 0.0719698 1.59064 0.0191449 2.00822C-0.0298575 2.39554 0.0153226 2.82992 0.153369 3.29908C0.430277 4.24153 1.05478 5.23236 1.91132 6.08865C2.76786 6.94494 3.7585 7.56969 4.70063 7.8466C5.04772 7.94868 5.37564 8 5.67956 8C5.78392 8.00017 5.88819 7.99376 5.99174 7.98082C6.40933 7.928 6.75385 7.76846 7.01578 7.50653L7.37027 7.15204C7.46413 7.05796 7.51684 6.93049 7.51684 6.79759C7.51684 6.66469 7.46413 6.53722 7.37027 6.44313L5.81058 4.88339ZM7.08665 6.86849L6.73223 7.22298C6.332 7.62314 5.65073 7.70799 4.8138 7.46185C3.93489 7.20336 3.00485 6.61496 2.19493 5.80504C1.38501 4.99512 0.796605 4.06507 0.53812 3.18616C0.29198 2.3493 0.376825 1.66796 0.776991 1.26774L1.13148 0.913314C1.14079 0.904001 1.15184 0.896614 1.16401 0.891574C1.17617 0.886534 1.18921 0.88394 1.20238 0.88394C1.21555 0.88394 1.22859 0.886534 1.24075 0.891574C1.25292 0.896614 1.26397 0.904001 1.27328 0.913314L2.83296 2.473C2.84228 2.48231 2.84966 2.49336 2.8547 2.50553C2.85974 2.51769 2.86234 2.53073 2.86234 2.5439C2.86234 2.55707 2.85974 2.57011 2.8547 2.58227C2.84966 2.59444 2.84228 2.60549 2.83296 2.6148L2.47848 2.96922C2.2705 3.17701 2.2287 3.51057 2.36124 3.90773C2.47804 4.25808 2.72111 4.62973 3.04564 4.9542C3.37017 5.27867 3.74189 5.5218 4.09211 5.6386C4.24451 5.68942 4.38744 5.71455 4.51753 5.71455C4.72651 5.71455 4.90241 5.64957 5.03062 5.52136L5.38504 5.16688C5.39435 5.15757 5.4054 5.15018 5.41757 5.14514C5.42974 5.1401 5.44277 5.1375 5.45594 5.1375C5.46911 5.1375 5.48215 5.1401 5.49432 5.14514C5.50648 5.15018 5.51754 5.15757 5.52685 5.16688L7.08653 6.72656C7.09587 6.73586 7.10328 6.74692 7.10834 6.75909C7.1134 6.77126 7.11602 6.78432 7.11603 6.7975C7.11604 6.81068 7.11345 6.82374 7.10841 6.83592C7.10337 6.8481 7.09598 6.85917 7.08665 6.86849ZM4.5911 1.40365C4.5911 1.37732 4.59629 1.35124 4.60636 1.32692C4.61644 1.30259 4.63121 1.28048 4.64983 1.26186C4.66845 1.24324 4.69056 1.22847 4.71489 1.21839C4.73921 1.20832 4.76529 1.20313 4.79162 1.20313C5.05495 1.20313 5.3157 1.255 5.55898 1.35577C5.80227 1.45654 6.02332 1.60424 6.20952 1.79044C6.39572 1.97665 6.54343 2.1977 6.6442 2.44098C6.74497 2.68427 6.79684 2.94502 6.79684 3.20835C6.79684 3.26153 6.77571 3.31253 6.73811 3.35014C6.7005 3.38774 6.6495 3.40887 6.59632 3.40887C6.54313 3.40887 6.49213 3.38774 6.45453 3.35014C6.41692 3.31253 6.39579 3.26153 6.39579 3.20835C6.39579 2.3238 5.67617 1.60417 4.79162 1.60417C4.73844 1.60417 4.68744 1.58305 4.64983 1.54544C4.61223 1.50784 4.5911 1.45683 4.5911 1.40365ZM4.5911 2.60678C4.5911 2.58045 4.59629 2.55437 4.60636 2.53005C4.61644 2.50572 4.63121 2.48361 4.64983 2.46499C4.66845 2.44637 4.69056 2.4316 4.71489 2.42152C4.73921 2.41145 4.76529 2.40626 4.79162 2.40626C5.00428 2.40649 5.20816 2.49107 5.35853 2.64144C5.5089 2.79181 5.59348 2.99569 5.59371 3.20835C5.59371 3.26153 5.57258 3.31253 5.53498 3.35014C5.49737 3.38774 5.44637 3.40887 5.39319 3.40887C5.34 3.40887 5.289 3.38774 5.2514 3.35014C5.21379 3.31253 5.19266 3.26153 5.19266 3.20835C5.19255 3.10202 5.15026 3.00008 5.07507 2.92489C4.99989 2.84971 4.89795 2.80742 4.79162 2.8073C4.73844 2.8073 4.68744 2.78618 4.64983 2.74857C4.61223 2.71097 4.5911 2.65996 4.5911 2.60678ZM7.99997 3.20835C7.99997 3.26153 7.97884 3.31253 7.94124 3.35014C7.90363 3.38774 7.85263 3.40887 7.79945 3.40887C7.74626 3.40887 7.69526 3.38774 7.65766 3.35014C7.62005 3.31253 7.59892 3.26153 7.59892 3.20835C7.59892 1.66057 6.3394 0.401044 4.79162 0.401044C4.73844 0.401044 4.68744 0.379918 4.64983 0.342313C4.61223 0.304708 4.5911 0.253704 4.5911 0.200522C4.5911 0.147341 4.61223 0.0963374 4.64983 0.0587323C4.68744 0.0211272 4.73844 9.32279e-07 4.79162 9.32279e-07C5.21304 -0.000320437 5.63038 0.0824465 6.01978 0.243567C6.40918 0.404688 6.76299 0.641 7.06098 0.938987C7.35897 1.23697 7.59528 1.59079 7.7564 1.98019C7.91752 2.36958 8.00029 2.78693 7.99997 3.20835Z"
                      fill="#5C5C66"
                    />
                  </svg>
                </div>
                <div>&nbsp;&nbsp;{footerData.tel}</div>
              </div>
              <div className={styles['email']}>
                <div className={styles['icon']}>
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 8 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.0652 0.4H0.8C0.766 0.4 0.7328 0.4042 0.701 0.4124L3.7356 3.4468C3.77311 3.48429 3.82397 3.50536 3.877 3.50536C3.93003 3.50536 3.98089 3.48429 4.0184 3.4468L7.0652 0.4ZM7.4978 0.533L5.0538 2.977L7.5188 5.4418C7.5698 5.3746 7.6 5.2908 7.6 5.2V0.8C7.6 0.6974 7.5614 0.604 7.498 0.533H7.4978ZM7.1112 5.6L4.7712 3.2598L4.3012 3.7298C4.24548 3.78553 4.17934 3.82973 4.10653 3.85989C4.03373 3.89005 3.9557 3.90557 3.8769 3.90557C3.7981 3.90557 3.72007 3.89005 3.64727 3.85989C3.57446 3.82973 3.50832 3.78553 3.4526 3.7298L2.9828 3.2598L0.666 5.577C0.708 5.5918 0.753 5.6 0.8002 5.6H7.1114H7.1112ZM0.4062 5.2708L2.7 2.9768L0.4148 0.692C0.404966 0.727157 0.399987 0.763494 0.4 0.8V5.2C0.4 5.224 0.402 5.2478 0.4062 5.2708ZM0.8 0H7.2C7.30506 -1.23114e-09 7.40909 0.0206925 7.50615 0.0608963C7.60321 0.1011 7.6914 0.160028 7.76569 0.234315C7.83997 0.308601 7.8989 0.396793 7.9391 0.493853C7.97931 0.590914 8 0.694943 8 0.8V5.2C8 5.30506 7.97931 5.40909 7.9391 5.50615C7.8989 5.60321 7.83997 5.6914 7.76569 5.76569C7.6914 5.83997 7.60321 5.8989 7.50615 5.9391C7.40909 5.97931 7.30506 6 7.2 6H0.8C0.694942 6 0.590914 5.97931 0.493853 5.9391C0.396793 5.8989 0.308601 5.83997 0.234315 5.76569C0.160028 5.6914 0.1011 5.60321 0.0608964 5.50615C0.0206926 5.40909 0 5.30506 0 5.2V0.8C0 0.694943 0.0206926 0.590914 0.0608964 0.493853C0.1011 0.396793 0.160028 0.308601 0.234315 0.234315C0.308601 0.160028 0.396793 0.1011 0.493853 0.0608963C0.590914 0.0206925 0.694942 -1.23114e-09 0.8 0Z"
                      fill="#5C5C66"
                    />
                  </svg>
                </div>
                <div>&nbsp;&nbsp;{footerData.email}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contract;
