import { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './index.module.scss';
import {
  Card,
  Input,
  Select,
  Form,
  Modal,
  InputNumber,
  message,
  Col,
  Row,
  Cascader,
  Radio,
  Checkbox,
  Button,
  Popconfirm,
  Steps,
} from 'antd';
import {
  OmsRecycleOrderDetail,
  OmsRecycleOrderItem,
  OmsRecycleOrder,
  OmsRecycleOrderValuationPayload,
  OmsRecycleOrderFirstValuationSaveInfo,
} from 'types/oms';
import {
  SelectOption,
  SelectOptionWarp,
  CascaderOption,
  CascaderOptionWarp,
} from 'types/base';
import {
  fetchFinalValuation,
  fetchterminationFinalValuation,
  fetchFirstValuationSaveInfo,
  modifyOmsRecycleOrderDetails,
  fetchRecycleOrderDetail,
} from 'apis/oms';
import { thousands } from 'utils/tools';
import BriefProductInfo from '../components/brief-product-info';
import useProductFormData from 'commons/hooks/useProductFormData';
import i18n from 'i18n';
import LOCALS from 'commons/locals';
import {
  CurrencyOption,
  LANGUAGE_NAME_MAPPING,
  LANGUAGE_PLACEHOLDER_MAPPING,
} from 'constants/RecyclingConsignment';
import { RenderLabel } from 'components/recycling-consignment/render-label';
import { OMS_RECYCLE_ORDER_TYPE_MAP } from 'commons/options';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { MallCity } from 'types/home';
import { getCityListByCountryCode } from 'apis/home';
import MemberBankPaymentInfo from 'components/member-bank-payment-info';
import dayjs from 'dayjs';
import classNames from 'classnames';
import useMember from 'commons/hooks/useMember';
import { CURRENCY_MAP } from 'commons/options';
import findCascaderOptionById from 'utils/findCascaderOptionById';
import { OmsRecycleOrderProductI18n } from 'types/oms';
import getCascaderFilter from 'utils/getCascaderFilter';
import useBrandList from 'commons/hooks/use-brand-list';

interface Props {
  open: boolean;
  onClose: () => void;
  data: OmsRecycleOrderDetail;
  reload: () => void;
}

const FinalValuationModal = ({ open, onClose, data, reload }: Props) => {
  const [country, setCountry] = useState('');
  const { countryOptions } = useAppSelector(selectGlobalInfo);
  const [cityList, setCityList] = useState<MallCity[]>([]);
  const { BrandList, DefaultBrand } = useBrandList();

  useEffect(() => {
    if (!country) return;

    getCityListByCountryCode(country).then((res) => {
      setCityList(res.data.cityList || []);
    });
  }, [country]);

  const [form] = Form.useForm<OmsRecycleOrderValuationPayload>();
  const [form_saveCopy] = Form.useForm<OmsRecycleOrderFirstValuationSaveInfo>(); //
  const [formMemberPaymentInfo] = Form.useForm();
  const [formBankInfo] = Form.useForm();
  const [detailDatasource, setDetailDatasource] =
    useState<OmsRecycleOrderDetail>();
  const [info, setInfo] = useState<OmsRecycleOrderItem & OmsRecycleOrder>({});
  const [isPrice, setIsPrice] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [current, setCurrent] = useState(0);
  // 币种
  const [currency, setCurrency] = useState<string>(CURRENCY_MAP.JPY);

  const { memberData } = useMember(data);

  const {
    omsAppointmentStoreRecord,
    omsRecycleOrder,
    omsRecycleOrderLogistics,
    omsRecycleOrderLogList,
  } = data;
  const lang = LANGUAGE_NAME_MAPPING[memberData?.language || 'en'];
  const lang_placeholder =
    LANGUAGE_PLACEHOLDER_MAPPING[memberData?.language || 'en'];

  // 预约ID
  const AppointmentID = useMemo(() => {
    return omsAppointmentStoreRecord?.id;
  }, [omsAppointmentStoreRecord?.id]);

  // 收款人信息的样式
  const AppointmentClassName = useMemo(() => {
    if (AppointmentID) {
      if (current === 1) return true;
    }
    return false;
  }, [AppointmentID, current]);

  // 最终报价的样式
  const FinalValuationClassName = useMemo(() => {
    if (AppointmentID) {
      if (current === 2) return true;
    } else {
      if (current === 1) return true;
    }
    return false;
  }, [AppointmentID, current]);

  // 是否是寄卖转回收
  const isSaleToRecycle = omsRecycleOrder?.isSaleToRecycle;

  // 历史报价信息
  const finalPriceHistoryEl = useMemo(() => {
    if (!omsRecycleOrderLogList) return false;
    const regex = /寄卖报价：(-|\d+)\n回收报价：(-|\d+)/;
    const logs = omsRecycleOrderLogList
      .map(({ createTime, shopRemark }) => {
        if (!shopRemark || !createTime) return null;
        const matches = shopRemark.match(regex);
        if (matches) {
          const sellPrice = matches[1]; // 匹配到的寄卖报价
          const recyclePrice = matches[2]; // 匹配到的回收报价
          return {
            createTime,
            sellPrice,
            recyclePrice,
          };
        } else {
          return null;
        }
      })
      .filter((i) => !!i);

    return (
      <div>
        {logs.map((value) => {
          return (
            <div key={value?.createTime}>
              <div>
                {dayjs(value?.createTime).format('YYYY-MM-DD')}
                <span style={{ marginLeft: 12 }}>
                  {`寄卖报价：${value?.sellPrice}，回收报价：${value?.recyclePrice}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [omsRecycleOrderLogList]);

  const getDetail = useCallback(() => {
    setLoading(true);
    fetchRecycleOrderDetail({ id: data.omsRecycleOrder?.id })
      .then((data) => {
        setDetailDatasource(data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data.omsRecycleOrder?.id]);

  useEffect(() => {
    if (data?.omsRecycleOrder?.currency) {
      setCurrency(data?.omsRecycleOrder?.currency);
    }
  }, [data?.omsRecycleOrder?.currency]);

  useEffect(() => {
    setCountry(omsRecycleOrderLogistics?.country || '');
    formMemberPaymentInfo.setFieldsValue({
      logisticsName: omsRecycleOrderLogistics?.name,
      logisticsCountry: omsRecycleOrderLogistics?.country,
      logisticsCity: omsRecycleOrderLogistics?.city,
      logisticsDetailAddress: omsRecycleOrderLogistics?.detailAddress,
      memberCredentialNo: omsRecycleOrder?.memberCredentialNo,
    });
  }, [
    formMemberPaymentInfo,
    omsRecycleOrder?.memberCredentialNo,
    omsRecycleOrderLogistics?.city,
    omsRecycleOrderLogistics?.country,
    omsRecycleOrderLogistics?.detailAddress,
    omsRecycleOrderLogistics?.name,
  ]);

  const [
    handleSaveMemberPaymentInfoLoading,
    setHandleSaveMemberPaymentInfoLoading,
  ] = useState(false);

  const {
    productCategoryChange,
    setProductInfo,
    fillData,
    showData,
    colorList,
    rankList,
    stampList,
    hardwareList,
    materialList,
    accessoryList,
    productCategoryList,
    materialCascaderOptionsMap,
  } = useProductFormData();

  // 排序后 刻印
  const stampListSort = useMemo((): SelectOption[] => {
    if (stampList && stampList.length) {
      let temp = [...stampList];
      return temp.sort((a: any, b: any) => b.sort - a.sort);
    }
    return [];
  }, [stampList]);
  const rankListSort = useMemo((): SelectOption[] => {
    if (rankList && rankList.length) {
      return [...rankList].sort(
        (a: SelectOption, b: SelectOption) => b.sort! - a.sort!
      );
    }
    return [];
  }, [rankList]);
  const hardwareListSort = useMemo((): SelectOption[] => {
    if (hardwareList && hardwareList.length) {
      return [...hardwareList].sort(
        (a: SelectOption, b: SelectOption) => b.sort! - a.sort!
      );
    }
    return [];
  }, [hardwareList]);
  // 排序后 附属品
  const accessoryListSort = useMemo((): SelectOption[] => {
    if (accessoryList && accessoryList.length) {
      let temp = [...accessoryList];
      return temp.sort((a: any, b: any) => b.sort - a.sort);
    }
    return [];
  }, [accessoryList]);

  useEffect(() => {
    if (data?.omsRecycleOrderItem && data?.omsRecycleOrder) {
      setProductInfo(data.omsRecycleOrderProduct || {});
      const {
        maxRecyclePrice,
        minRecyclePrice,
        maxSalePrice,
        minSalePrice,
        firstValuationProductAccessories,
        firstValuationShopRemark,
        firstValuationStock,
        firstValuationStockRemark,
      } = data.omsRecycleOrderItem;
      const { currency } = data?.omsRecycleOrder;
      const info = {
        maxRecyclePrice,
        minRecyclePrice,
        maxSalePrice,
        minSalePrice,
        currency,
      };
      setInfo(info);
      form_saveCopy.setFieldsValue({
        firstValuationProductAccessories,
        firstValuationShopRemark,
        firstValuationStock,
        firstValuationStockRemark,
        currency,
      });
    }
  }, [data, form_saveCopy, setProductInfo]);

  /** 保存商品信息 */
  const handleSaveCopy = useCallback(() => {
    form_saveCopy
      .validateFields()
      .then((values: OmsRecycleOrderFirstValuationSaveInfo) => {
        setLoadingSave(true);
        const {
          color = [],
          firstValuationShopRemark,
          firstValuationStock,
          firstValuationStockRemark,
          hardware = '',
          material = [] as any,
          rank,
          stamp = '',
          productCategoryId = [] as any,
          firstValuationProductAccessories = '',
          accessory = '',
        } = values;
        // color
        const colorStr: string[] = [];
        const colorSelectOption: SelectOptionWarp[] = [];
        if (color && color.length && color instanceof Array) {
          color.forEach((d: string) => {
            const t = colorList.find((dd) => dd.value === d);
            if (t) {
              colorSelectOption.push(t);
              colorStr.push(t.label);
            }
          });
        }
        // productCategoryId
        let prodCateId = 0;
        let materialList: CascaderOption[] = [];
        let productCategoryData: CascaderOption | undefined = undefined;
        if (productCategoryId) {
          prodCateId = productCategoryId[productCategoryId.length - 1];
          productCategoryData = findCascaderOptionById(
            prodCateId,
            productCategoryList
          );
          materialList = materialCascaderOptionsMap[productCategoryId[0]];
        }
        // material
        let facebookEnabled = 1;
        const material_: string[] = [];
        const materialStr: string[] = [];
        const materialSelectOption: CascaderOptionWarp[] = [];
        if (material && material instanceof Array) {
          facebookEnabled = material.map((d) => d[0]).includes('exotic-skin')
            ? 0
            : 1;
          // 提交内容
          material.forEach((d: any) => {
            material_.push(d[d.length - 1]);
          });
          // 显示值
          material.forEach((d: string[]) => {
            const t = findCascaderOptionById(d[d.length - 1], materialList);
            if (t) {
              materialSelectOption.push(t);
              materialStr.push(t.label);
            }
          });
        }

        // hardware
        const hardwareStr: string[] = [];
        const hardwareSelectOption: SelectOptionWarp[] = [];
        if (hardware && hardware instanceof Array) {
          hardware.forEach((d: string) => {
            const t = hardwareList.find((dd) => dd.value === d);
            if (t) {
              hardwareSelectOption.push(t);
              hardwareStr.push(t.label);
            }
          });
        }
        // rank
        let rankSelectOption: SelectOptionWarp | undefined = undefined;
        if (rank) {
          rankSelectOption = rankList.find((d) => d.value === rank);
        }
        // Stamp
        let stampSelectOption: SelectOptionWarp | undefined = undefined;
        if (rank) {
          stampSelectOption = stampList.find((d) => d.value === stamp);
        }
        const brand =
          BrandList.find(
            (d) => d.value === data.omsRecycleOrderProduct?.brandName
          ) || DefaultBrand;

        const i18nList = data.i18nList?.length
          ? data.i18nList
          : detailDatasource?.i18nList;

        const nameZh = productCategoryData?.nameZh;
        const sizeZh = productCategoryData?.sizeZh;
        const colorZh = colorSelectOption.map((d) => d.labelCn)?.join(' ');
        const materialZh = materialSelectOption.map((d) => d.labelCn).join(' ');
        const hardwareZh = hardwareSelectOption.map((d) => d.labelCn).join(' ');
        const rankZh = rankSelectOption?.labelCn;
        const stampZh = stampSelectOption?.labelCn;
        const I18nCnData = i18nList?.find((d) => d.lang === 'zh_CN');
        const I18nCn: OmsRecycleOrderProductI18n = {
          id: I18nCnData?.id,
          name: nameZh,
          attrSize: sizeZh,
          subTitle: `${nameZh} ${colorZh}`,
          note: `${materialZh} ${hardwareZh}`,
          detailTitle: `${rankZh} ${brand?.descZh} ${nameZh} ${colorZh} ${materialZh} ${hardwareZh} ${stampZh}`,
          // attrRankDesc: attrRankDesc ? attrRankDesc.zh : '',
        };

        const nameTw = productCategoryData?.nameTw;
        const sizeTw =
          productCategoryData?.sizeTw || productCategoryData?.sizeZh;
        const colorTw = colorSelectOption.map((d) => d.labelTw)?.join(' ');
        const materialTw = materialSelectOption.map((d) => d.labelTw).join(' ');
        const hardwareTw = hardwareSelectOption.map((d) => d.labelTw).join(' ');
        const rankTw = rankSelectOption?.labelTw;
        const stampTw = stampSelectOption?.labelTw;
        const I18nTwData = i18nList?.find((d) => d.lang === 'zh_TW');
        const I18nTw: OmsRecycleOrderProductI18n = {
          id: I18nTwData?.id,
          name: nameTw,
          attrSize: sizeTw,
          subTitle: `${nameTw} ${colorTw}`,
          note: `${materialTw} ${hardwareTw}`,
          detailTitle: `${rankTw} ${brand?.descZhTw} ${nameTw} ${colorTw} ${materialTw} ${hardwareTw} ${stampTw}`,
          // attrRankDesc: attrRankDesc ? attrRankDesc.zh_TW : '',
        };

        const nameJa = productCategoryData?.nameJa;
        const sizeJa = productCategoryData?.sizeJa;
        const colorJa = colorSelectOption.map((d) => d.labelJa)?.join(' ');
        const materialJa = materialSelectOption.map((d) => d.labelJa).join(' ');
        const hardwareJa = hardwareSelectOption.map((d) => d.labelJa).join(' ');
        const rankJa = rankSelectOption?.labelJa;
        const stampJa = stampSelectOption?.labelJa;
        const I18nJaData = i18nList?.find((d) => d.lang === 'ja');
        const I18nJa: OmsRecycleOrderProductI18n = {
          id: I18nJaData?.id,
          name: nameJa,
          attrSize: sizeJa,
          subTitle: `${nameJa} ${colorJa}`,
          note: `${materialJa} ${hardwareJa}`,
          detailTitle: `${rankJa} ${brand?.descJa} ${nameJa} ${colorJa} ${materialJa} ${hardwareJa} ${stampJa}`,
          // attrRankDesc: attrRankDesc ? attrRankDesc.ja : '',
        };

        const nameEn = productCategoryData?.nameEn;
        const sizeEn = productCategoryData?.sizeEn;
        const colorEn = colorSelectOption.map((d) => d.labelEn)?.join(' ');
        const materialEn = materialSelectOption.map((d) => d.labelEn).join(' ');
        const hardwareEn = hardwareSelectOption.map((d) => d.labelEn).join(' ');
        const rankEn = rankSelectOption?.labelEn;
        const stampEn = stampSelectOption?.labelEn;
        const I18nEnData = i18nList?.find((d) => d.lang === 'ja');
        const I18nEn: OmsRecycleOrderProductI18n = {
          id: I18nEnData?.id,
          name: nameEn,
          attrSize: sizeEn,
          subTitle: `${nameEn} ${colorEn}`,
          note: `${materialEn} ${hardwareEn}`,
          detailTitle: `${rankEn} ${brand?.descEn} ${nameEn} ${colorEn} ${materialEn} ${hardwareEn} ${stampEn}`,
          // attrRankDesc: attrRankDesc ? attrRankDesc.en : '',
        };

        const omsRecycleOrderItemId = data?.omsRecycleOrderItem?.id;
        const payload = {
          firstValuationShopRemark,
          firstValuationStock,
          firstValuationStockRemark,
          rank,
          color: color.toString(),
          hardware: hardware.toString(),
          stamp: stamp,
          productCategoryId: productCategoryId[productCategoryId.length - 1],
          omsRecycleOrderItemId,
          material: material_.toString(),
          firstValuationProductAccessories:
            firstValuationProductAccessories.toString(),
          accessory: accessory.toString(),
          facebookEnabled,
          i18nJa: I18nJa,
          i18nCn: I18nCn,
          i18nTw: I18nTw,
          ...I18nEn,
        };
        fetchFirstValuationSaveInfo(payload)
          .then(() => {
            getDetail();
            message.success(i18n.t(LOCALS.save_success));
            setCurrent((curr) => curr + 1);
          })
          .finally(() => setLoadingSave(false));
      })
      .catch(() => {});
  }, [
    form_saveCopy,
    BrandList,
    DefaultBrand,
    data.i18nList,
    data?.omsRecycleOrderItem?.id,
    data.omsRecycleOrderProduct?.brandName,
    detailDatasource?.i18nList,
    colorList,
    productCategoryList,
    materialCascaderOptionsMap,
    hardwareList,
    rankList,
    stampList,
    getDetail,
  ]);

  /** 保存收款信息 */
  const handleSaveMemberPaymentInfo = useCallback(() => {
    formMemberPaymentInfo
      .validateFields()
      .then(async (res) => {
        setHandleSaveMemberPaymentInfoLoading(true);
        await modifyOmsRecycleOrderDetails({
          ...res,
          ...formBankInfo.getFieldsValue(),
          id: omsRecycleOrder?.id,
        }).finally(() => {
          setHandleSaveMemberPaymentInfoLoading(false);
        });
        message.success(i18n.t(LOCALS.save_success));
        setCurrent((curr) => curr + 1);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [formBankInfo, formMemberPaymentInfo, omsRecycleOrder?.id]);

  /** 保存最终报价 */
  const onFinish = useCallback(() => {
    form.validateFields().then((values: any) => {
      setLoading(true);
      const {
        finalSalePrice,
        finalRecyclePrice,
        remark,
        omsRecycleOrderType,
        settlementType,
        emailRemark,
      } = values;
      const omsRecycleOrderItemId = data?.omsRecycleOrderItem?.id;
      const id = data?.omsRecycleOrder?.id;
      if (isPrice === 1) {
        let payload = {
          finalSalePrice,
          finalRecyclePrice,
          omsRecycleOrderItemId,
          omsRecycleOrderType,
          settlementType,
          emailRemark: emailRemark?.replace(/\n/g, '<br/>'),
          currency,
        };
        fetchFinalValuation(payload)
          .then(() => {
            message.success(i18n.t(LOCALS.final_quote_successful));
            onClose();
            reload();
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        fetchterminationFinalValuation({
          remark,
          id,
        })
          .then(() => {
            message.success(i18n.t(LOCALS.final_quote_rejection_successful));
            onClose();
            reload();
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  }, [data, isPrice, form, onClose, reload, currency]);

  /** 填充数据改变 */
  useEffect(() => {
    if (Object.keys(fillData).length === 0) return;
    form_saveCopy.setFieldsValue({ ...fillData });
  }, [fillData, form_saveCopy]);

  /** 步骤条数据 */
  const StepsItems = useMemo(() => {
    if (AppointmentID) {
      const steps = [
        {
          title: i18n.t(LOCALS.basic_info),
          content: 'First-content',
          key: 'First-content',
        },
        {
          title: i18n.t(LOCALS.payee_information),
          content: 'Second-content',
          key: 'Second-content',
        },
        {
          title: i18n.t(LOCALS.final_quote),
          content: 'Last-content',
          key: 'Last-content',
        },
      ];
      return steps;
    }
    const steps = [
      {
        title: i18n.t(LOCALS.basic_info),
        content: 'First-content',
        key: 'First-content',
      },
      {
        title: i18n.t(LOCALS.final_quote),
        content: 'Last-content',
        key: 'Last-content',
      },
    ];
    return steps;
  }, [AppointmentID]);

  const next = useCallback(() => {
    if (current === 0) {
      handleSaveCopy();
    }
    if (current === 1 && AppointmentClassName) {
      handleSaveMemberPaymentInfo();
    }
    if ((current === 1 && FinalValuationClassName) || current === 2) {
      onFinish();
    }
  }, [
    current,
    handleSaveCopy,
    AppointmentClassName,
    handleSaveMemberPaymentInfo,
    FinalValuationClassName,
    onFinish,
  ]);

  const prev = useCallback(() => {
    setCurrent(current - 1);
  }, [current]);

  /** 步骤条按钮 */
  const footerBtn = useMemo(() => {
    let nextBtnText = i18n.t(LOCALS.save_basic_information);
    if (current === 1 && AppointmentClassName) {
      nextBtnText = i18n.t(LOCALS.save_payee_info);
    }
    return (
      <div className="mt-8 text-center">
        {current < StepsItems.length - 1 && (
          <Button
            type="primary"
            onClick={() => next()}
            loading={loadingSave || handleSaveMemberPaymentInfoLoading}
          >
            {nextBtnText}
          </Button>
        )}
        {current === StepsItems.length - 1 && (
          <Popconfirm
            title={i18n.t(LOCALS.caution)}
            description={
              <div className={styles.Popconfirm}>
                {i18n.t(LOCALS.confirm_submission)}
              </div>
            }
            onConfirm={() => onFinish()}
            okText={i18n.t(LOCALS.confirm)}
            cancelText={i18n.t(LOCALS.cancel)}
          >
            <Button
              type="primary"
              onClick={() => {
                form.validateFields();
              }}
              loading={loading}
            >
              {i18n.t(LOCALS.submit_final_quote)}
            </Button>
          </Popconfirm>
        )}
        {current > 0 && (
          <Button className="mx-4" onClick={() => prev()}>
            {i18n.t(LOCALS.previous)}
          </Button>
        )}
      </div>
    );
  }, [
    current,
    AppointmentClassName,
    next,
    prev,
    loadingSave,
    handleSaveMemberPaymentInfoLoading,
    form,
    loading,
    onFinish,
    StepsItems,
  ]);

  return (
    <Modal
      open={open}
      width={'70%'}
      title={i18n.t(LOCALS.final_quote)}
      onCancel={() => onClose()}
      className={styles.FinalValuationModal}
      destroyOnClose
      confirmLoading={loading}
      footer={[]}
    >
      <BriefProductInfo data={data} showData={showData} />

      <div className="flex justify-center">
        <Steps current={current} items={StepsItems} className="w-[70%]" />
      </div>

      <div className="mt-4">
        {/* 基础信息 */}
        <Card
          title={i18n.t(LOCALS.basic_info)}
          size="small"
          className={classNames(
            {
              block: current === 0,
            },
            { hidden: current !== 0 }
          )}
        >
          <Form
            form={form_saveCopy}
            layout="horizontal"
            initialValues={{ isPirce: 1 }}
            className="renderLabel"
          >
            <Row gutter={[48, 0]}>
              <Col span={12}>
                <Form.Item
                  label={
                    <RenderLabel required>{i18n.t(LOCALS.rank)}</RenderLabel>
                  }
                  name="rank"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={rankListSort}
                    placeholder={i18n.t(LOCALS.please_select) || ''}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <RenderLabel required>
                      {i18n.t(LOCALS.bag_style)}
                    </RenderLabel>
                  }
                  name="productCategoryId"
                  rules={[{ required: true }]}
                >
                  <Cascader
                    allowClear={false}
                    options={productCategoryList}
                    onChange={(value, e) => {
                      // 设置材质内容
                      productCategoryChange(value[0]);
                      form_saveCopy.setFieldValue('material', '');
                    }}
                    showSearch={{
                      filter: getCascaderFilter,
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <RenderLabel required>{i18n.t(LOCALS.color)}</RenderLabel>
                  }
                  name="color"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder={i18n.t(LOCALS.please_select)}
                    mode="tags"
                    showSearch
                    options={colorList}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <RenderLabel required>
                      {i18n.t(LOCALS.material)}
                    </RenderLabel>
                  }
                  name="material"
                  rules={[{ required: true }]}
                >
                  <Cascader options={materialList} multiple />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <RenderLabel required>
                      {i18n.t(LOCALS.hardware)}
                    </RenderLabel>
                  }
                  name="hardware"
                  rules={[{ required: true }]}
                >
                  <Select mode="tags" options={hardwareListSort} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <RenderLabel required>{i18n.t(LOCALS.stamp)}</RenderLabel>
                  }
                  name="stamp"
                  rules={[{ required: true }]}
                >
                  <Select options={stampListSort} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={
                    <RenderLabel required>
                      {i18n.t(LOCALS.accessories)}
                    </RenderLabel>
                  }
                  name="accessory"
                  rules={[{ required: true }]}
                >
                  <Checkbox.Group onChange={() => {}}>
                    {accessoryListSort.map((d) => (
                      <Checkbox value={d.value} key={d.value}>
                        {d.label}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={
                    <RenderLabel>{i18n.t(LOCALS.service_comments)}</RenderLabel>
                  }
                  name="firstValuationShopRemark"
                >
                  <Input maxLength={100} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <RenderLabel required>
                      {i18n.t(LOCALS.stock_availability)}
                    </RenderLabel>
                  }
                  name="firstValuationStock"
                  rules={[{ required: true }]}
                >
                  <Radio.Group>
                    <Radio value={2}>{i18n.t(LOCALS.available)}</Radio>
                    <Radio value={1}>{i18n.t(LOCALS.unavailable)}</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <RenderLabel>{i18n.t(LOCALS.inventory_notes)}</RenderLabel>
                  }
                  name="firstValuationStockRemark"
                >
                  <Input maxLength={100} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={<RenderLabel>{i18n.t(LOCALS.currency)}</RenderLabel>}
                  name="currency"
                >
                  <Select
                    options={CurrencyOption}
                    onChange={(e) => setCurrency(e)}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* 收款人信息 */}
        <Card
          title={i18n.t(LOCALS.payee_information)}
          size="small"
          className={classNames(
            {
              block: AppointmentClassName,
            },
            {
              hidden: !AppointmentClassName,
            }
          )}
        >
          <Form form={formMemberPaymentInfo} className="renderLabel">
            <Form.Item
              label={<RenderLabel required>{i18n.t(LOCALS.name)}</RenderLabel>}
              name={'logisticsName'}
              rules={[{ required: true }]}
            >
              <Input></Input>
            </Form.Item>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Form.Item
                label={
                  <RenderLabel required>
                    {i18n.t(LOCALS.shipping_address)}
                  </RenderLabel>
                }
                name={'logisticsCountry'}
                style={{
                  flexShrink: 0,
                }}
                rules={[{ required: true }]}
              >
                <Select
                  onChange={(value) => {
                    setCountry(value);
                    formMemberPaymentInfo.setFieldValue('logisticsCity', '');
                  }}
                  placeholder={i18n.t(LOCALS.location)}
                  style={{ width: 150 }}
                  options={countryOptions}
                  showSearch
                  filterOption={(input: string, option?: any) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                ></Select>
              </Form.Item>

              <Form.Item
                name="logisticsCity"
                style={{ marginLeft: 8, flexShrink: 0 }}
                rules={[{ required: !!cityList.length }]}
              >
                <Select
                  style={{ width: 150 }}
                  placeholder={i18n.t(LOCALS.state_province_city)}
                  showSearch
                  filterOption={(input: string, option?: any) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={cityList.map(({ name, code }) => {
                    return {
                      value: code,
                      label: name,
                    };
                  })}
                />
              </Form.Item>

              <Form.Item
                name="logisticsDetailAddress"
                style={{ marginLeft: 8, width: '100%' }}
                rules={[{ required: true }]}
              >
                <Input
                  placeholder={i18n.t(LOCALS.detail_address) || '详细地址'}
                  style={{ width: '100%' }}
                ></Input>
              </Form.Item>
            </div>

            <Form.Item
              name="memberCredentialNo"
              style={{ width: '100%' }}
              label={
                <RenderLabel>
                  {i18n.t(LOCALS.id_passport_number) || 'ID/护照信息'}
                </RenderLabel>
              }
            >
              <Input
                placeholder={i18n.t(LOCALS.id_passport_number) || 'ID/护照信息'}
                style={{ width: '100%' }}
              ></Input>
            </Form.Item>
          </Form>

          <MemberBankPaymentInfo
            data={data}
            form={formBankInfo}
          ></MemberBankPaymentInfo>
        </Card>

        {/* 最终报价 */}
        <Card
          title={i18n.t(LOCALS.final_quote)}
          size="small"
          className={classNames(
            {
              block: FinalValuationClassName,
            },
            { hidden: !FinalValuationClassName }
          )}
        >
          <Form
            form={form}
            layout="horizontal"
            className="renderLabel"
            initialValues={{ isPirce: 1 }}
            onValuesChange={(changedValues) => {
              const field = Object.keys(changedValues)[0];
              // 单独验证价格，可以只填一项，即使抛出异常
              if (['finalSalePrice', 'finalRecyclePrice'].includes(field))
                form.validateFields();
            }}
          >
            <Row gutter={[24, 0]}>
              <Col span={24}>
                <Form.Item
                  label={
                    <RenderLabel required>{i18n.t(LOCALS.quote)}</RenderLabel>
                  }
                  name="isPirce"
                >
                  <Radio.Group onChange={(e) => setIsPrice(e.target.value)}>
                    <Radio value={1}>{i18n.t(LOCALS.yes)}</Radio>
                    <Radio value={2}>{i18n.t(LOCALS.no)}</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              {isPrice === 1 ? (
                <>
                  {!isSaleToRecycle && (
                    <>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <RenderLabel>
                              {i18n.t(LOCALS.consignment_confirmation_quote)}
                            </RenderLabel>
                          }
                          name="finalSalePrice"
                          rules={[
                            {
                              validator: (_, value) => {
                                const finalRecyclePrice =
                                  form.getFieldValue('finalRecyclePrice');
                                if (
                                  value &&
                                  finalRecyclePrice &&
                                  value < finalRecyclePrice
                                ) {
                                  return Promise.reject(
                                    i18n.t(LOCALS.consignment_valuation_w)
                                  );
                                }
                                if (
                                  !value &&
                                  !form.getFieldValue('finalRecyclePrice')
                                ) {
                                  return Promise.reject(
                                    i18n.t(LOCALS.filled_in_at_least_one)
                                  );
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <InputNumber
                            inputMode="numeric"
                            max={1000000000}
                            addonBefore={currency}
                            style={{ width: '100%' }}
                            min={1}
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(value) =>
                              value!.replace(/\$\s?|(,*)/g, '') as any
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item className={styles.gray}>
                          {i18n.t(LOCALS.consignment_preliminary_valuation)}：
                          {info.minSalePrice && (
                            <>{`${currency} ${thousands(
                              info.minSalePrice
                            )}~${thousands(info.maxSalePrice)}`}</>
                          )}
                        </Form.Item>
                      </Col>
                    </>
                  )}

                  {!!isSaleToRecycle && (
                    <Col span={24} style={{ marginBottom: 12 }}>
                      <Form.Item
                        label={<RenderLabel>历史报价记录</RenderLabel>}
                      >
                        <div style={{ marginLeft: 12 }}>
                          {finalPriceHistoryEl}
                        </div>
                      </Form.Item>
                    </Col>
                  )}

                  <Col span={12}>
                    <Form.Item
                      label={
                        <RenderLabel>
                          {i18n.t(LOCALS.recycling_confirmation_quote)}
                        </RenderLabel>
                      }
                      name="finalRecyclePrice"
                      rules={[
                        {
                          validator: (_, value) => {
                            if (isSaleToRecycle) {
                              if (!value) {
                                return Promise.reject(
                                  i18n.t(
                                    LOCALS.fill_recycling_confirmation_quote
                                  )
                                );
                              }
                            } else {
                              if (
                                !value &&
                                !form.getFieldValue('finalSalePrice')
                              ) {
                                return Promise.reject(
                                  i18n.t(LOCALS.filled_in_at_least_one)
                                );
                              }
                            }

                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <InputNumber
                        inputMode="numeric"
                        max={1000000000}
                        addonBefore={currency}
                        style={{ width: '100%' }}
                        min={1}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        parser={(value) =>
                          value!.replace(/\$\s?|(,*)/g, '') as any
                        }
                      />
                    </Form.Item>
                  </Col>

                  {!isSaleToRecycle && (
                    <Col span={12}>
                      <Form.Item className={styles.gray}>
                        {i18n.t(LOCALS.instant_sale)}：
                        {info.minRecyclePrice && (
                          <>{`${currency} ${thousands(
                            info.minRecyclePrice
                          )}~${thousands(info.maxRecyclePrice)}`}</>
                        )}
                      </Form.Item>
                    </Col>
                  )}

                  {omsAppointmentStoreRecord?.id && !isSaleToRecycle && (
                    <Col span={12}>
                      <Form.Item
                        name="omsRecycleOrderType"
                        label={
                          <RenderLabel required>
                            {i18n.t(LOCALS.contract_type)}
                          </RenderLabel>
                        }
                        rules={[
                          {
                            validator: (_, value) => {
                              if (!value) {
                                return Promise.reject(
                                  i18n.t(LOCALS.select_contract_type)
                                );
                              }

                              return Promise.resolve();
                            },
                          },
                          {
                            validator: (_, value) => {
                              if (
                                value ===
                                  OMS_RECYCLE_ORDER_TYPE_MAP.CONSIGNMENT &&
                                !form.getFieldValue('finalSalePrice')
                              ) {
                                return Promise.reject(
                                  i18n.t(
                                    LOCALS.must_include_consignment_confirmation_quote
                                  )
                                );
                              }

                              if (
                                value === OMS_RECYCLE_ORDER_TYPE_MAP.RECYCLE &&
                                !form.getFieldValue('finalRecyclePrice')
                              ) {
                                return Promise.reject(
                                  i18n.t(
                                    LOCALS.must_include_recycling_confirmation_quote
                                  )
                                );
                              }

                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Select placeholder={i18n.t(LOCALS.please_select)}>
                          <Select.Option
                            value={OMS_RECYCLE_ORDER_TYPE_MAP.CONSIGNMENT}
                          >
                            {i18n.t(LOCALS.consignment)}
                          </Select.Option>
                          <Select.Option
                            value={OMS_RECYCLE_ORDER_TYPE_MAP.RECYCLE}
                          >
                            {i18n.t(LOCALS.sell)}
                          </Select.Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                        name="settlementType"
                        style={{ width: '100%' }}
                        rules={[
                          {
                            validator: (_, value) => {
                              if (!value) {
                                return Promise.reject('请选择收款方式');
                              }

                              return Promise.resolve();
                            },
                          },
                        ]}
                        label={
                          <RenderLabel required>
                            {i18n.t(LOCALS.payment_method)}
                          </RenderLabel>
                        }
                      >
                        <Select placeholder={i18n.t(LOCALS.please_select)}>
                          <Select.Option value={1}>
                            {i18n.t(LOCALS.cash)}
                          </Select.Option>
                          <Select.Option value={2}>
                            {i18n.t(LOCALS.accounting_settlement)}
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  )}

                  <Col span={24}>
                    <Form.Item
                      style={{ width: '100%' }}
                      label={
                        <RenderLabel>
                          <div>{i18n.t(LOCALS.email_notes)}</div>
                          <div className="text-xs text-right">({lang})</div>
                        </RenderLabel>
                      }
                      name="emailRemark"
                    >
                      <Input.TextArea rows={5} placeholder={lang_placeholder} />
                    </Form.Item>
                  </Col>
                </>
              ) : (
                <>
                  <Col span={24}>
                    <Form.Item
                      label={
                        <RenderLabel required>
                          {i18n.t(LOCALS.reason_for_rejection)}
                        </RenderLabel>
                      }
                      name="remark"
                      rules={[{ required: true }]}
                    >
                      <Input.TextArea maxLength={100} />
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>
          </Form>
        </Card>
      </div>

      {footerBtn}
    </Modal>
  );
};

export default FinalValuationModal;
