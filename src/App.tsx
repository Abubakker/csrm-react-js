import { lazy, Suspense, useEffect } from 'react';
import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import XiaomaLayout from 'components/xiaoma-layout';
import Home from 'pages/home';
import ProductList from 'pages/product/list';
import LabelList from 'pages/product/label';
import LabelEdit from 'pages/product/label/edit';
import Login from 'pages/login';
import {
  getLocalStorageFirstPage,
  getLocalStorageLanguage,
  LOGIN_PAGE,
  getLocalStorageToken,
} from 'commons';
import { useAppDispatch } from 'store/hooks';
import {
  setAccessorySelectOptions,
  setCollectionSelectOptionsMap,
  setColorSelectOptions,
  setCountryCodeOptions,
  setCountryOptions,
  setHardwareSelectOptions,
  setHueSelectOptions,
  setLanguage,
  setMaterialCascaderOptionMap,
  setOrderStatusOptions,
  setOrderTypeOptions,
  setPayStatusOptions,
  setProductCategoryCascaderOptions,
  setRankSelectOptions,
  setStampSelectOptions,
  setTypeSelectOptions,
} from 'store/slices/globalInfoSlice';
import { useSelector } from 'react-redux';
import { selectUserInfo } from 'store/slices/userInfoSlice';
import ProductAddEdit from 'pages/product/add-edit';
import SellYourBag from 'pages/rrs/sell-your-bag';
import QuotationFormList from 'pages/rrs/quotation-form/list';
import SellYourBagEdit from 'pages/rrs/sell-your-bag-edit';
import QuotationFormAddEdit from 'pages/rrs/quotation-form/add-edit';
import BatchPrint from 'components/batch-print/v2';
import BatchPrintV3 from 'components/batch-print/v3';
import { ProductAttributeCodeNames } from 'types/pms';
import useProductAttributeCodeList from 'commons/hooks/useProductAttributeCodeList';
import { groupBy } from 'lodash-es';
import buildTreeFromProductAttributeCodeList from 'utils/buildTreeFromProductAttributeCodeList';
import useProductCategoryTree from 'commons/hooks/useProductCategoryTree';
import MemberList from 'pages/ums/member-list';
import MemberView from 'pages/ums/member-view';
import { getSysDictList } from 'apis/sys';
import { LANGUAGE_MAP } from 'commons/options';
import MemberEdit from 'pages/ums/member-edit';
import MemberAdd from 'pages/ums/member-add';
import OrderList from 'pages/oms/order-list';
import OrderView from 'pages/oms/order-view';
import { useCountryList } from 'apis/home';
import AdminList from 'pages/sys/admin-list';
// import OrderCreate from 'pages/oms/order-create';
import RecyclingConsignmentList from 'pages/rrs/recycling-consignment/list';
import RecyclingConsignmentDetail from 'pages/rrs/recycling-consignment-detail';
import RecyclingConsignmentIntention from 'pages/rrs/recycling-consignment-order/intention';
import Contract from 'pages/prints/contract';
// import SysSeoConfig from 'pages/sys/seo-config';
import Signature from 'pages/prints/signature';
import AppointmentManagementList from 'pages/rrs/appointment-management-list';
import AppointmentManagementConfig from 'pages/rrs/appointment-management-config';
import OrderListMobile from 'pages/oms/order-list-mobile';
import ProductListMobile from 'pages/product/product-list-mobile';
import AddSalesLink from 'pages/product/add-sales-link';
import MemberMailTemplate from 'pages/sys/member-mail-template';
import MemberMailSend from 'pages/sys/member-mail-send';
import OmsCheckoutCounter from 'pages/oms/checkout-counter';
import FmsAccountList from 'pages/fms/account-list';
import Receipt from 'pages/prints/receipt';
import OmsOrderCreateV2 from 'pages/oms/order-create-v2';
import ProductCate from 'pages/product/product-cate';
import CouponListPage from 'pages/sms/coupon-list';
import CouponHistoryListPage from 'pages/sms/coupon-history-list';
import DempyouPrint from 'pages/prints/dempyou';
import CmsArticleListPage from 'pages/cms/article-list';
import CmsArticleDetailPage from 'pages/cms/article-detail';
import ImChatUserList from 'pages/im-chat/user-list';
import { getGinzaxiaomaApiUrl } from 'apis';
import WantBookPage from 'pages/oms/want-book';
import IntegralList from 'pages/sys/integral-list';
import IntegralDetail from 'pages/sys/integral-list/detail';
import ConsignmentContractOrder from 'pages/rrs/recycling-consignment-order/contract/consignment-contract-order';
import RecyclingContractOrder from 'pages/rrs/recycling-consignment-order/contract/recycling-contract-order';
import CmsArticleCategoryPage from 'pages/cms/article-category/index';
import CmsSubjectCategoryPage from 'pages/cms/subject-category';
import CmsSubjectListPage from 'pages/cms/subject-list';
import CmsSubjectDetailPage from 'pages/cms/subject-detail';
import CmsSubjectProductRelationPage from 'pages/cms/subject-product-relation';
import Statement from 'pages/report/statement';
import RoleList from 'pages/sys/role';
import MenuList from 'pages/sys/menu';
import ADList from 'pages/sms/ad/ad-list';
import ADDetail from 'pages/sms/ad/ad-detail';
import PriceLabelPrinting from 'pages/prints/price-label';
import ResourceList from 'pages/sys/resource';
import SOP from 'pages/sop';
import ShopCash from 'pages/fms/shop-cash';
import StockTakingList from 'pages/product/stock-taking-list';
import StockTaking from 'pages/product/stock-taking';
import Attendance from './pages/report/attendance';
import DictPage from 'pages/sys/dict-page';
import SystemSummary from './pages/fms/sys-summary';
import StoreTransfer from 'pages/product/store-transfer';
import Messenger from 'pages/integration/messenger';
import EmailIntegration from 'pages/integration/email';
import WeChatIntegration from 'pages/integration/messenger/wechat';
import WhatsappIntegration from 'pages/integration/messenger/whatsapp';
import InstagramMessenger from 'pages/integration/messenger/instagram';
import LineIntegration from 'pages/integration/messenger/line';
import FacebookIntegration from 'pages/integration/messenger/facebook';
import { getImChatBaseUrl } from 'apis/im-chat';
import OffLineRes from 'pages/off-res/OffLineRes';

import Loading from 'components/shared/Loading';
import FallbackError from 'components/shared/FallbackError';

import { ErrorBoundary } from 'react-error-boundary';

// Lazy load the PushNotification component
const Tags = lazy(() => import('pages/tags/Tags'));
const Settings = lazy(() => import('pages/Settings/Settings'));
const ImChatInBox = lazy(() => import('pages/im-chat/in-box'));

const PushNotification = lazy(
  () => import('pages/push-notifi/PushNotification')
);

const CouponManagement = lazy(
  () => import('pages/couponManagement/CouponManagement')
);
const Reward = lazy(() => import('pages/reward'));

const names = [
  ProductAttributeCodeNames.COLOR,
  ProductAttributeCodeNames.MATERIAL,
  ProductAttributeCodeNames.STAMP,
  ProductAttributeCodeNames.RANK,
  ProductAttributeCodeNames.TYPE,
  ProductAttributeCodeNames.HUE,
  ProductAttributeCodeNames.HARDWARE,
  ProductAttributeCodeNames.ACCESSORIES,
  ProductAttributeCodeNames.COLLECTIONS,
];

function App() {
  const dispatch = useAppDispatch();
  const userInfo = useSelector(selectUserInfo);
  const [
    colorAttributeCodeList,
    materialAttributeCodeList,
    stampAttributeCodeList,
    rankAttributeCodeList,
    typeAttributeCodeList,
    hueAttributeCodeList,
    hardwareAttributeCodeList,
    accessoryAttributeCodeList,
    collectionAttributeCodeList,
  ] = useProductAttributeCodeList(names);
  const productCategoryCascaderOptions = useProductCategoryTree();
  const { countryList } = useCountryList();
  const language = getLocalStorageLanguage();
  const token = getLocalStorageToken().replace('Bearer ', '');

  useEffect(() => {
    getSysDictList().then(({ data: { records } }) => {
      const dictTypeList = ['orderStatus', 'payStatus', 'orderType'];
      const [orderStatusOptions, payStatusOptions, orderTypeOptions] =
        dictTypeList.map((dictType) => {
          const temp = records.find(({ type }) => type === dictType);
          if (!temp) return [];

          return temp.valueList.map(({ en, ja, zh, value }) => {
            const language = getLocalStorageLanguage();
            const labelMap = {
              [LANGUAGE_MAP.EN]: en,
              [LANGUAGE_MAP.JA]: ja,
              [LANGUAGE_MAP.ZH_CN]: zh,
            };

            return {
              value: +value,
              label: labelMap[language],
            };
          });
        });

      dispatch(setOrderStatusOptions(orderStatusOptions));
      dispatch(setPayStatusOptions(payStatusOptions));
      dispatch(setOrderTypeOptions(orderTypeOptions));
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(setLanguage(getLocalStorageLanguage()));
    dispatch(setColorSelectOptions(colorAttributeCodeList));
    dispatch(setStampSelectOptions(stampAttributeCodeList));
    dispatch(setRankSelectOptions(rankAttributeCodeList));
    dispatch(setProductCategoryCascaderOptions(productCategoryCascaderOptions));
    dispatch(setTypeSelectOptions(typeAttributeCodeList));
    dispatch(setHueSelectOptions(hueAttributeCodeList));
    dispatch(setHardwareSelectOptions(hardwareAttributeCodeList));
    dispatch(setAccessorySelectOptions(accessoryAttributeCodeList));

    const materialProductAttributeCodeListMap = groupBy(
      materialAttributeCodeList,
      (i) => i.categoryId
    );
    const materialCascaderOptionMap: any = {};
    Object.keys(materialProductAttributeCodeListMap).forEach((key) => {
      materialCascaderOptionMap[key] = buildTreeFromProductAttributeCodeList(
        materialProductAttributeCodeListMap[key]
      );
    });
    dispatch(setMaterialCascaderOptionMap(materialCascaderOptionMap));

    dispatch(
      setCollectionSelectOptionsMap(
        groupBy(collectionAttributeCodeList, (i) => i.categoryId)
      )
    );

    dispatch(
      setCountryOptions(
        countryList.map(({ code, name }) => {
          return {
            value: code,
            label: name,
          };
        })
      )
    );

    dispatch(
      setCountryCodeOptions(
        countryList.map(({ areaCode, name }) => {
          return {
            value: areaCode,
            label: `+ ${areaCode} ${name}`,
          };
        })
      )
    );
  }, [
    colorAttributeCodeList,
    materialAttributeCodeList,
    stampAttributeCodeList,
    rankAttributeCodeList,
    productCategoryCascaderOptions,
    typeAttributeCodeList,
    hueAttributeCodeList,
    hardwareAttributeCodeList,
    accessoryAttributeCodeList,
    collectionAttributeCodeList,
    dispatch,
    countryList,
  ]);

  let router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<XiaomaLayout />}>
          <Route path="home" element={<Home />} />

          <Route path="pms/product-list" element={<ProductList />} />
          <Route
            path="pms/product-list-mobile"
            element={<ProductListMobile />}
          />
          <Route
            path="pms/product-add"
            element={<ProductAddEdit key="add" mode="add" />}
          />
          <Route
            path="pms/product-view/:id"
            element={<ProductAddEdit key="view" mode="view" />}
          />
          <Route
            path="pms/product-edit/:id"
            element={<ProductAddEdit key="edit" mode="edit" />}
          />
          <Route path="pms/label" element={<LabelList />} />
          <Route
            path="pms/label-edit/:id"
            element={<LabelEdit key="edit" mode="edit" />}
          />
          <Route
            path="pms/label-add"
            element={<LabelEdit key="add" mode="add" />}
          />
          <Route path="pms/addSalesLink" element={<AddSalesLink />} />
          <Route path="pms/product-cate" element={<ProductCate />} />
          <Route path="pms/stock-taking-list" element={<StockTakingList />} />
          <Route path="pms/stock-taking/:id" element={<StockTaking />} />
          <Route path="pms/store-transfer" element={<StoreTransfer />} />

          <Route path="oms/checkout-counter" element={<OmsCheckoutCounter />} />
          <Route path="oms/order-create" element={<OmsOrderCreateV2 />} />
          <Route path="oms/order-list" element={<OrderList />} />
          <Route path="oms/order-list-mobile" element={<OrderListMobile />} />
          <Route path="oms/order-view/:id" element={<OrderView />} />
          <Route path="oms/wantBook" element={<WantBookPage />} />
          {/* <Route path="oms/order-create" element={<OrderCreate />} /> */}

          <Route path="ums/member-list" element={<MemberList />} />
          <Route path="ums/member-view/:id" element={<MemberView />} />
          <Route path="ums/member-add" element={<MemberAdd />} />
          <Route path="ums/member-edit/:id" element={<MemberEdit />} />

          <Route
            path="im-chat/in-box"
            element={
              <ErrorBoundary FallbackComponent={FallbackError}>
                <Suspense fallback={<Loading />}>
                  <ImChatInBox
                    baseUrl={getGinzaxiaomaApiUrl()}
                    authToken={token}
                    pluginKey="5d22e404-0151-4c49-b086-19540955f590"
                    locale={language.replace('_', '-')}
                  />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="im-chat/offline-response"
            element={
              <OffLineRes
                baseUrl={getGinzaxiaomaApiUrl()}
                authToken={token}
                pluginKey="5d22e404-0151-4c49-b086-19540955f590"
              />
            }
          ></Route>
          <Route path="im-chat/user-list" element={<ImChatUserList />} />
          <Route
            path="im-chat/settings"
            element={
              <ErrorBoundary FallbackComponent={FallbackError}>
                <Suspense fallback={<Loading />}>
                  <Settings
                    baseUrl={getGinzaxiaomaApiUrl()}
                    authToken={token}
                    pluginKey="5d22e404-0151-4c49-b086-19540955f590"
                  />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="im-chat/messenger-integration"
            element={<Messenger />}
          ></Route>
          <Route
            path="im-chat/integration-whatsapp"
            element={<WhatsappIntegration />}
          ></Route>
          <Route
            path="im-chat/integration-we-chat"
            element={<WeChatIntegration />}
          ></Route>
          <Route
            path="im-chat/integration-instagram"
            element={<InstagramMessenger />}
          ></Route>
          <Route
            path="im-chat/integration-line"
            element={<LineIntegration />}
          ></Route>
          <Route
            path="im-chat/integration-facebook"
            element={<FacebookIntegration />}
          ></Route>

          <Route
            path="im-chat/tags-management"
            element={
              <ErrorBoundary FallbackComponent={FallbackError}>
                <Suspense fallback={<Loading />}>
                  <Tags />
                </Suspense>
              </ErrorBoundary>
            }
          ></Route>

          <Route
            path="crm/coupon-management"
            element={
              <ErrorBoundary FallbackComponent={FallbackError}>
                <Suspense fallback={<Loading />}>
                  <CouponManagement
                    baseUrl={getImChatBaseUrl()}
                    authToken={token}
                  />
                </Suspense>
              </ErrorBoundary>
            }
          ></Route>
          <Route
            path="crm/reward"
            element={
              <ErrorBoundary FallbackComponent={FallbackError}>
                <Suspense fallback={<Loading />}>
                  <Reward />
                </Suspense>
              </ErrorBoundary>
            }
          ></Route>

          <Route
            path="crm/push-notification"
            element={
              <Suspense fallback={<Loading />}>
                <PushNotification
                  baseUrl={getImChatBaseUrl()}
                  authToken={token}
                  pluginKey="5d22e404-0151-4c49-b086-19540955f590"
                />
              </Suspense>
            }
          ></Route>
          <Route
            path="sms/member-mail-template"
            element={<MemberMailTemplate />}
          />
          <Route path="sms/member-mail-send" element={<MemberMailSend />} />
          <Route path="sms/coupon-list" element={<CouponListPage />} />
          <Route
            path="sms/coupon-history-list"
            element={<CouponHistoryListPage />}
          />
          <Route path="sms/integral-list" element={<IntegralList />} />
          <Route path="sms/integral-detail/:id" element={<IntegralDetail />} />

          <Route path="rrs/sell-your-bag" element={<SellYourBag />} />
          <Route
            path="rrs/sell-your-bag-edit/:id"
            element={<SellYourBagEdit />}
          />

          <Route path="rrs/quotation-form" element={<QuotationFormList />} />
          <Route
            path="rrs/quotation-form-add"
            element={<QuotationFormAddEdit />}
          />
          <Route
            path="rrs/quotation-form-detail/:id"
            element={<QuotationFormAddEdit />}
          />
          <Route
            path="rrs/quotation-form-edit/:id"
            element={<QuotationFormAddEdit isEdit={true} />}
          />

          <Route
            path="rrs/recycling-consignment-list"
            element={<RecyclingConsignmentList />}
          />
          <Route
            path="rrs/recycling-consignment-detail/:id"
            element={<RecyclingConsignmentDetail />}
          />

          <Route
            path="rrs/recycling-consignment-intention"
            element={<RecyclingConsignmentIntention />}
          />
          <Route
            path="rrs/recycling-contract-order"
            element={<RecyclingContractOrder />}
          />
          <Route
            path="rrs/consignment-contract-order"
            element={<ConsignmentContractOrder />}
          />

          <Route
            path="rrs/appointment-management-list"
            element={<AppointmentManagementList />}
          />
          <Route
            path="rrs/appointment-management-config"
            element={<AppointmentManagementConfig />}
          />

          <Route path="fms/account-list" element={<FmsAccountList />} />
          <Route path="fms/shop-cash" element={<ShopCash />} />
          <Route path="fms/sys-summary" element={<SystemSummary />} />

          <Route
            path="cms/article-list"
            element={<CmsArticleListPage />}
          ></Route>
          <Route
            path="cms/article-detail"
            element={<CmsArticleDetailPage />}
          ></Route>
          <Route
            path="cms/article-category"
            element={<CmsArticleCategoryPage />}
          ></Route>
          <Route
            path="cms/subject-category"
            element={<CmsSubjectCategoryPage />}
          ></Route>
          <Route
            path="cms/subject-list"
            element={<CmsSubjectListPage />}
          ></Route>
          <Route
            path="cms/subject-detail"
            element={<CmsSubjectDetailPage />}
          ></Route>
          <Route
            path="cms/subject-product-relation/:id"
            element={<CmsSubjectProductRelationPage />}
          ></Route>

          <Route path="report/statement" element={<Statement />}></Route>

          <Route path="sys/admin-list" element={<AdminList />}></Route>
          {/* <Route path="sys/seoConfig" element={<SysSeoConfig />}></Route> */}
          <Route path="sys/role" element={<RoleList />}></Route>
          <Route path="sys/menu" element={<MenuList />}></Route>
          <Route path="sys/resource" element={<ResourceList />}></Route>
          <Route path="sys/dict" element={<DictPage />}></Route>

          <Route path="report/attendance" element={<Attendance />}></Route>

          <Route path="sms/ad-list" element={<ADList />}></Route>
          <Route path="sms/ad-detail" element={<ADDetail />}></Route>

          <Route path="sop" element={<SOP />}></Route>

          <Route
            path="*"
            element={
              <Navigate to={getLocalStorageFirstPage(userInfo.username)} />
            }
          />
        </Route>
        <Route path="/prints/cash-register" element={<BatchPrint />}></Route>
        <Route path="/prints/price-tag" element={<BatchPrintV3 />}></Route>
        <Route
          path="/prints/price-label"
          element={<PriceLabelPrinting />}
        ></Route>
        <Route path="/prints/receipt" element={<Receipt />}></Route>
        <Route path="/prints/dempyou" element={<DempyouPrint />}></Route>
        <Route path="rrs/signature" element={<Signature />} />
        <Route path="/prints/contract/:id/:pwd" element={<Contract />}></Route>
        <Route path={LOGIN_PAGE} element={<Login />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
