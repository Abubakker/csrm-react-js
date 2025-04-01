import { useState, useCallback, useEffect, useMemo } from 'react';
import styles from './index.module.scss';
import {
  Input,
  Select,
  Form,
  Modal,
  message,
  Radio,
  Button,
  Cascader,
  Row,
  Col,
  Card,
  Space,
  Popconfirm,
} from 'antd';
import {
  OmsRecycleOrderDetail,
  OmsRecycleOrderValuationPayload,
  OmsRecycleOrderFirstValuationSaveInfo,
} from 'types/oms';
import {
  SelectOption,
  DefaultOptionType,
  SelectOptionWarp,
  CascaderOption,
  CascaderOptionWarp,
} from 'types/base';
import {
  fetchFirstValuation,
  fetchTerminationFirstValuation,
  fetchFirstValuationSaveInfo,
  fetchRecycleOrderDetail,
} from 'apis/oms';
import {
  CurrencyOption,
  OMS_RECYCLE_ORDER_STATUS_MAP,
  LANGUAGE_PLACEHOLDER_MAPPING,
  LANGUAGE_NAME_MAPPING,
} from 'constants/RecyclingConsignment';
import MinMaxValuation from '../input-components/min-max-valuation';
import BriefProductInfo from '../components/brief-product-info';
import i18n from 'i18n';
import LOCALS from 'commons/locals';
import ClipboardJS from 'clipboard';
import useProductFormData from 'commons/hooks/useProductFormData';
import { RenderLabel } from 'components/recycling-consignment/render-label';
import dayjs from 'dayjs';
import useMember from 'commons/hooks/useMember';
import findCascaderOptionById from 'utils/findCascaderOptionById';
import { OmsRecycleOrderProductI18n } from 'types/oms';
import getCascaderFilter from 'utils/getCascaderFilter';
import useBrandList from 'commons/hooks/use-brand-list';

interface Props {
  mode: 'firstValuation' | 'updateValuation';
  open: boolean;
  title: string;
  onClose: () => void;
  data: OmsRecycleOrderDetail;
  reload: () => void;
}

const ValuationModal = ({ open, title, onClose, data, reload }: Props) => {
  const [form_saveCopy] = Form.useForm<OmsRecycleOrderFirstValuationSaveInfo>();
  const [form_onFinish] = Form.useForm<OmsRecycleOrderValuationPayload>();
  const [isPrice, setIsPrice] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingFinish, setLoadingFinish] = useState(false);
  const [copyText, setCopyText] = useState('');
  const [detailDatasource, setDetailDatasource] =
    useState<OmsRecycleOrderDetail>();
  const { BrandList, DefaultBrand } = useBrandList();

  const [prodPayload, setProdPayload] =
    useState<OmsRecycleOrderFirstValuationSaveInfo>({});
  const { memberData } = useMember(data);
  const lang = LANGUAGE_NAME_MAPPING[memberData?.language || 'en'];
  const lang_placeholder =
    LANGUAGE_PLACEHOLDER_MAPPING[memberData?.language || 'en'];

  const {
    setProductInfo,
    productCategoryChange,
    getShowData,
    productInfo,
    fillData,
    showData,
    colorList,
    rankList,
    stampList,
    hardwareList,
    materialList,
    productCategoryList,
    materialCascaderOptionsMap,
  } = useProductFormData();

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
    new ClipboardJS('.copy-btn');
  }, []);

  useEffect(() => {
    if (Object.keys(data).length === 0) return;
    const { omsRecycleOrderItem, omsRecycleOrderProduct } = data;
    const {
      firstValuationProductAccessories,
      firstValuationShopRemark,
      firstValuationStock,
      firstValuationStockRemark,
    } = omsRecycleOrderItem || {};
    setProductInfo(omsRecycleOrderProduct!);
    form_saveCopy.setFieldsValue({
      firstValuationProductAccessories,
      firstValuationShopRemark,
      firstValuationStock,
      firstValuationStockRemark,
    });
  }, [data, form_saveCopy, setProductInfo]);

  /** 填充数据改变 */
  useEffect(() => {
    if (Object.keys(fillData).length === 0) return;
    form_saveCopy.setFieldsValue({ ...fillData });
  }, [fillData, form_saveCopy]);

  // 历史报价信息
  const valuationHistory = useMemo(() => {
    const { omsRecycleOrderLogList } = data;

    if (!omsRecycleOrderLogList) {
      return [];
    }

    // 筛选出操作记录里的初步估值操作记录
    const list = omsRecycleOrderLogList.filter(
      ({ beforeStatus, afterStatus }) => {
        return (
          (beforeStatus === OMS_RECYCLE_ORDER_STATUS_MAP.WAIT_FIRST_VALUATION &&
            afterStatus ===
              OMS_RECYCLE_ORDER_STATUS_MAP.HAS_BEEN_FIRST_VALUATION) ||
          (beforeStatus === OMS_RECYCLE_ORDER_STATUS_MAP.VALUATION_EXPIRED &&
            afterStatus ===
              OMS_RECYCLE_ORDER_STATUS_MAP.HAS_BEEN_FIRST_VALUATION)
        );
      }
    );

    const outList: string[] = [];
    // 使用正则表达式进行匹配
    const patterns = [
      {
        title: '回收估值',
        pattern: /回收估值：(\d+ ~ \d+)/,
      },
      {
        title: '寄卖估值',
        pattern: /寄卖估值：(\d+ ~ \d+)/,
      },
    ];
    list.forEach(({ createTime, shopRemark }) => {
      patterns.forEach(({ title, pattern }) => {
        const match = shopRemark?.match(pattern);
        if (match) {
          const matchedValue = match[1]; // 获取匹配的估值范围
          outList.push(
            `${dayjs(createTime).format(
              'YYYY-MM-DD'
            )}  ${title} ${matchedValue.replace('~', '-')}`
          );
        }
      });
    });

    return outList;
  }, [data]);

  /** 处理复制内容,点击保存时才触发 */
  const handleCopyData = useCallback(() => {
    const formData = form_saveCopy.getFieldsValue();
    const { color, hardware, material, rank, stamp, productCategoryId } =
      formData;
    const fillObject = getShowData({
      color,
      hardware,
      material,
      rank,
      stamp,
      productCategoryId,
    } as any);
    const copyStr = `-----------商品信息------------
包款: ${fillObject.productCategorySelectList?.label}
成色: ${fillObject.rankSelectLabel}
颜色: ${fillObject.colorSelectLabelList}
材质: ${fillObject.materialSelectLabelList}
金属配件: ${fillObject.hardwareSelectLabel}
刻印: ${fillObject.stampSelectLabel}
客服备注：${formData.firstValuationShopRemark || ''}
有无库存：${['', '无', '有'][formData.firstValuationStock || 0]}
库存备注：${formData.firstValuationStockRemark || ''}
币种：${formData.currency}
---------历史估值记录----------
${valuationHistory.join('\n') || '无'}
-----------用户信息------------
订单号：${data.omsRecycleOrder?.code}
id：${data.omsRecycleOrder?.memberId}
手机号：+${
      data.omsRecycleOrder?.phone?.split(' ')[0]
    }  尾号${data.omsRecycleOrder?.phone?.split(' ')[1].slice(-4)}
`;
    setCopyText(copyStr);
  }, [form_saveCopy, data, getShowData, valuationHistory]);

  /** 保存并复制 */
  const handleSaveCopy = useCallback(() => {
    handleCopyData();
    form_saveCopy
      .validateFields()
      .then((values: OmsRecycleOrderFirstValuationSaveInfo) => {
        setLoadingFinish(true);
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
          facebookEnabled,
          i18nJa: I18nJa,
          i18nCn: I18nCn,
          i18nTw: I18nTw,
          ...I18nEn,
        };

        setProdPayload(payload);
        fetchFirstValuationSaveInfo(payload)
          .then((data) => {
            message.success(i18n.t(LOCALS.successful_operation));
            getDetail();
            reload();
          })
          .finally(() => setLoadingFinish(false));
      });
  }, [
    handleCopyData,
    form_saveCopy,
    data.omsRecycleOrderProduct?.brandName,
    data.i18nList,
    data?.omsRecycleOrderItem?.id,
    BrandList,
    DefaultBrand,
    detailDatasource?.i18nList,
    colorList,
    productCategoryList,
    materialCascaderOptionsMap,
    hardwareList,
    rankList,
    stampList,
    getDetail,
    reload,
  ]);

  /** 最终提交 */
  const onFinish = useCallback(() => {
    form_onFinish
      .validateFields()
      .then((values: OmsRecycleOrderValuationPayload) => {
        setLoading(true);
        const {
          RecyclePrice = [],
          SalePrice = [],
          remark,
          emailRemark,
        } = values;
        const omsRecycleOrderItemId = data?.omsRecycleOrderItem?.id;
        const id = data?.omsRecycleOrder?.id;
        if (isPrice === 1) {
          let payload = {
            minRecyclePrice: RecyclePrice[0],
            maxRecyclePrice: RecyclePrice[1],
            minSalePrice: SalePrice[0],
            maxSalePrice: SalePrice[1],
            omsRecycleOrderItemId,
            emailRemark: emailRemark?.replace(/\n/g, '<br/>'),
          };
          fetchFirstValuation(payload)
            .then(() => {
              message.success(i18n.t(LOCALS.successful_operation));
              onClose();
              reload();
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          let payload = {
            remark,
            id,
          };
          fetchTerminationFirstValuation(payload)
            .then(() => {
              message.success(i18n.t(LOCALS.successful_operation));
              onClose();
              reload();
            })
            .finally(() => {
              setLoading(false);
            });
        }
      });
  }, [
    form_onFinish,
    data?.omsRecycleOrderItem?.id,
    data?.omsRecycleOrder?.id,
    isPrice,
    onClose,
    reload,
  ]);

  /** 产品属性都已经填写好 */
  const attrExist = useMemo(() => {
    if (productInfo) {
      const {
        attrColor,
        attrHardware,
        attrMaterial,
        attrStamp,
        rank,
        productCategoryId,
      } = productInfo;
      if (
        attrColor &&
        attrHardware &&
        attrMaterial &&
        attrStamp &&
        rank &&
        productCategoryId
      ) {
        return true;
      }
    }

    if (prodPayload) {
      const { color, hardware, material, stamp, rank, productCategoryId } =
        prodPayload;
      if (color && hardware && material && stamp && rank && productCategoryId) {
        return true;
      }
    }

    return false;
  }, [productInfo, prodPayload]);

  const CascaderFilter = useCallback(
    (inputValue: string, path: DefaultOptionType[]) =>
      getCascaderFilter(inputValue, path),
    []
  );

  const SelectFilter = useCallback(
    (input: string, option: SelectOption | undefined) =>
      (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
    []
  );

  return (
    <Modal
      open={open}
      title={title}
      onCancel={() => onClose()}
      onOk={onFinish}
      className={styles.ValuationModal}
      destroyOnClose
      confirmLoading={loading}
      width={'70%'}
      footer={[]}
    >
      <div className={styles.warp}>
        <BriefProductInfo data={data} showData={showData} />
        <Card
          title={i18n.t(LOCALS.basic_info)}
          size="small"
          style={{ marginBottom: 24 }}
        >
          <Form
            form={form_saveCopy}
            name="form_saveCopy"
            className="renderLabel"
            initialValues={{
              firstValuationStock: 2,
              currency: data?.omsRecycleOrder?.currency,
            }}
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
                    showSearch
                    filterOption={SelectFilter}
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
                    showSearch={{ filter: CascaderFilter }}
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
                    placeholder={i18n.t(LOCALS.please_select) || ''}
                    mode="multiple"
                    showSearch
                    filterOption={SelectFilter}
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
                  <Cascader
                    options={materialList}
                    multiple
                    showSearch={{ filter: CascaderFilter }}
                  />
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
                  <Select
                    mode="multiple"
                    options={hardwareListSort}
                    showSearch
                    filterOption={SelectFilter}
                  />
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
                  <Select
                    options={stampListSort}
                    showSearch
                    filterOption={SelectFilter}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={
                    <RenderLabel>{i18n.t(LOCALS.service_comments)}</RenderLabel>
                  }
                  name="firstValuationShopRemark"
                >
                  <Input.TextArea rows={6} maxLength={1024} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <RenderLabel>
                      {i18n.t(LOCALS.stock_availability)}
                    </RenderLabel>
                  }
                  name="firstValuationStock"
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
                  <Select disabled options={CurrencyOption} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={
                    <RenderLabel>
                      {i18n.t(LOCALS.historical_valuation)}
                    </RenderLabel>
                  }
                >
                  {valuationHistory.map((i) => {
                    return (
                      <p key={i} style={{ marginBottom: 0 }}>
                        {i}
                      </p>
                    );
                  })}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item wrapperCol={{ span: 24 }} className={styles.btn}>
                  <Button
                    data-clipboard-text={copyText}
                    className="copy-btn"
                    type="primary"
                    onClick={() => handleSaveCopy()}
                    loading={loadingFinish}
                  >
                    {i18n.t(LOCALS.save_and_copy)}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card
          title={i18n.t(LOCALS.quotation_info)}
          size="small"
          style={{ marginBottom: 24 }}
        >
          <Form
            form={form_onFinish}
            name="form_onFinish"
            className="renderLabel"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
              isPirce: 1,
            }}
            onValuesChange={(changedValues) => {
              const field = Object.keys(changedValues)[0];
              // 单独验证价格，可以只填一项，即使抛出异常
              if (['SalePrice', 'RecyclePrice'].includes(field))
                form_onFinish.validateFields();
            }}
          >
            <Form.Item label={i18n.t(LOCALS.quote)} name="isPirce">
              <Radio.Group onChange={(e) => setIsPrice(e.target.value)}>
                <Radio value={1}>{i18n.t(LOCALS.yes)}</Radio>
                <Radio value={2}>{i18n.t(LOCALS.no)}</Radio>
              </Radio.Group>
            </Form.Item>
            {isPrice === 1 ? (
              <>
                <Form.Item
                  label={i18n.t(LOCALS.consignment_preliminary_valuation)}
                  name="SalePrice"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (value) {
                          if (value[0] > value[1]) {
                            return Promise.reject(i18n.t(LOCALS.invalid_range));
                          }
                          if (!(value[0] && value[1])) {
                            return Promise.reject(
                              i18n.t(LOCALS.fill_in_completely)
                            );
                          }
                        }
                        const RecyclePrice =
                          form_onFinish.getFieldValue('RecyclePrice');
                        if (
                          value &&
                          value[0] &&
                          value[1] &&
                          RecyclePrice &&
                          RecyclePrice[0] &&
                          RecyclePrice[1]
                        ) {
                          // 寄卖要比回收高
                          if (value[0] < RecyclePrice[0]) {
                            return Promise.reject(
                              i18n.t(LOCALS.consignment_valuation_minimum)
                            );
                          }
                          if (value[1] < RecyclePrice[1]) {
                            return Promise.reject(
                              i18n.t(LOCALS.consignment_valuation_maximum)
                            );
                          }
                        }
                        if (
                          !value &&
                          !form_onFinish.getFieldValue('RecyclePrice')
                        ) {
                          return Promise.reject(
                            i18n.t(LOCALS.select_at_least_one)
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <MinMaxValuation currency={data?.omsRecycleOrder?.currency} />
                </Form.Item>
                <Form.Item
                  label={i18n.t(LOCALS.instant_sale)}
                  name="RecyclePrice"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (value) {
                          if (value[0] > value[1]) {
                            return Promise.reject(i18n.t(LOCALS.invalid_range));
                          }
                          if (!(value[0] && value[1])) {
                            return Promise.reject(
                              i18n.t(LOCALS.fill_in_completely)
                            );
                          }
                        }
                        if (
                          !value &&
                          !form_onFinish.getFieldValue('SalePrice')
                        ) {
                          return Promise.reject(
                            i18n.t(LOCALS.select_at_least_one)
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <MinMaxValuation currency={data?.omsRecycleOrder?.currency} />
                </Form.Item>

                <Form.Item
                  label={
                    <div>
                      <div>{i18n.t(LOCALS.email_notes)}</div>
                      <div className="text-xs text-right">({lang})</div>
                    </div>
                  }
                  name="emailRemark"
                >
                  <Input.TextArea rows={5} placeholder={lang_placeholder} />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  label={'拒绝原因'}
                  name="remark"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea maxLength={100} />
                </Form.Item>
              </>
            )}
            <Col span={24}>
              <Form.Item wrapperCol={{ span: 24 }} className={styles.btn}>
                <Space>
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
                      disabled={!attrExist}
                      type="primary"
                      loading={loading}
                      onClick={() => form_onFinish.validateFields()}
                    >
                      {i18n.t(LOCALS.submit)}
                    </Button>
                  </Popconfirm>
                  <Button onClick={() => onClose()}>
                    {i18n.t(LOCALS.cancel)}
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Form>
        </Card>
      </div>
    </Modal>
  );
};

export default ValuationModal;
