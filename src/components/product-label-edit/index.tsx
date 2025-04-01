import React, { useCallback, useState, useEffect } from 'react';
import styles from './index.module.scss';
import {
  Button,
  Spin,
  Space,
  Cascader,
  Radio,
  Form,
  Input,
  Select,
  Row,
  Col,
  message,
  Checkbox,
  Modal,
} from 'antd';
import { useLocation } from 'react-router-dom';
import { Trans } from 'react-i18next';
import i18n from 'i18n';
import LOCALS from 'commons/locals';
import PriceTag from '../price-tag';
import PriceCurrency from './price-currency';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { CascaderOption } from 'types/base';
import { PriceTagInfo, CURRENCY_ENUM, currencyMap } from 'types/pms';
import {
  createPriceTag,
  getPriceTagDetail,
  updatePriceTag,
  getStampList,
  getPriceTagList,
} from 'apis/pms';
import findCascaderOptionById from 'utils/findCascaderOptionById';
import { useNavigate } from 'react-router-dom';
import { langMap, NameOptions, RankOption } from 'constant/pms';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// 外部两大块布局
const outside_grid_left = { xxl: 6, xl: 8, lg: 24 };
const outside_grid_right = { xxl: 18, xl: 16, lg: 24 };
// Form部分布局
const form_grid_1 = { xxl: 9, xl: 12, lg: 12 };
const form_grid_2 = { xxl: 18, xl: 24, lg: 24 };
// cheked的布局
// const checked_grid = { xxl: 3, xl: 8, lg: 12 };

interface Props {
  mode: 'add' | 'view' | 'edit';
  id: string | undefined;
}
let timeout: any = undefined;

const ProductLabelEdit = ({ mode, id }: Props) => {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const { state: locationState } = useLocation();
  const [shopId, setShopId] = useState<string>('1');
  const [stampList, setstampList] = useState<CascaderOption[]>([]);
  const navigate = useNavigate();

  const {
    language, // 系统语言
    productCategoryCascaderOptions,
    colorSelectOptions,
    materialCascaderOptionsMap,
    hardwareSelectOptions,
  } = useAppSelector(selectGlobalInfo);

  const [materialCascaderOptions, setMaterialCascaderOptions] = useState<
    CascaderOption[]
  >([]);
  /** 用于同步价签组件 */
  const [dataSource, setDataSource] = useState<PriceTagInfo>({});
  const [loading, setLoading] = useState(false);
  const [detailTitle, setDetailTitle] = useState('');
  /** 材质的选中项 */
  const shopIdField = shopId === '1' ? 'labelJa' : 'labelEn';

  /** Mount  */
  useEffect(() => {
    if (mode === 'add') {
      /** 创建需要用传递的shopid */
      const { shopId } = locationState || { shopId: '1' };
      setShopId(shopId);
    }
    getStamp();
  }, []);

  useEffect(() => {
    if (
      mode === 'edit' &&
      productCategoryCascaderOptions.length > 0 &&
      Object.keys(materialCascaderOptionsMap).length > 0
    ) {
      /** 初始数据加载成功后 查询详情 编辑用查询到shopid */
      getDetail();
    }
  }, [productCategoryCascaderOptions, materialCascaderOptionsMap]);

  /** 获取价签详情 */
  const getDetail = () => {
    if (
      productCategoryCascaderOptions.length === 0 ||
      Object.keys(materialCascaderOptionsMap).length === 0
    )
      return;
    setLoading(true);
    getPriceTagDetail(`${id}`)
      .then((data) => {
        setDataSource(data.data);
        const {
          stamp,
          color,
          material,
          hardware,
          nameAppend,
          shopId = '1',
          price,
          productCategoryId,
          detailTitle,
          ...rest
        } = data.data;
        setShopId(`${shopId}`);
        setDetailTitle(detailTitle as string);
        const detail: any = { ...rest };
        detail.stamp = stamp?.split(',');
        detail.color = color?.split(',');
        detail.material = material;
        detail.materialSelect = material?.split(',');
        detail.hardware = hardware?.split(',');
        detail.nameAppend = nameAppend ? nameAppend?.split(',') : [];
        detail.priceCurrency = {
          currency: currencyMap[shopId] as CURRENCY_ENUM,
          price,
        };
        if (productCategoryId) {
          const target = findCascaderOptionById(
            productCategoryId as string,
            productCategoryCascaderOptions
          );
          const productCategoryIds =
            target?.treeIds?.split(',').map(Number) || [];
          detail.productCategoryId = productCategoryIds;
          const level = productCategoryIds[0];
          setMaterialCascaderOptions(materialCascaderOptionsMap[level] || []);
        }

        form.setFieldsValue(detail);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /** 提交 */
  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        const data = handlePriceTagData(values);
        if (mode === 'add') {
          modal.confirm({
            title: <Trans i18nKey={LOCALS.confirm_submit} />,
            cancelText: <Trans i18nKey={LOCALS.cancel} />,
            okText: <Trans i18nKey={LOCALS.confirm} />,
            onOk: () => {
              handleCreatePriceTag(data);
            },
          });
        } else if (mode === 'edit') {
          modal.confirm({
            title: <Trans i18nKey={LOCALS.confirm_submit} />,
            cancelText: <Trans i18nKey={LOCALS.cancel} />,
            okText: <Trans i18nKey={LOCALS.confirm} />,
            onOk: () => {
              handleUpdatePriceTag({ ...data, id });
            },
          });
        }
      })
      .catch((errorInfo) => {
        console.log('🚀  onFinish  errorInfo:', errorInfo);
      });
  };

  /** 添加价签 */
  const handleCreatePriceTag = async (data: PriceTagInfo) => {
    try {
      setLoading(true);
      await createPriceTag(data);
      form.resetFields();
      message.success(i18n.t('successful_operation'));
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  /** 编辑价签 */
  const handleUpdatePriceTag = async (data: PriceTagInfo) => {
    try {
      setLoading(true);
      await updatePriceTag(data);
      getDetail();
      message.success(i18n.t('successful_operation'));
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  /** 刻印 */
  const getStamp = () => {
    getStampList().then((data) => {
      const list: CascaderOption[] = [];
      data?.data[0].itemList.forEach((d) => {
        if (d.enabled) {
          list.push({
            label: d.labelEn || '',
            ...d,
          });
        }
      });
      let t = list.sort((a, b) => {
        if (a.sort && b.sort) {
          return b.sort - a.sort;
        }
        return 0;
      });
      setstampList(t);
    });
  };

  /** 处理数据
   * form.setFieldValue不触发onValuesChange
   * 官方给的的理由是：如果不这样可能会导致死循环
   *  */
  const handlePriceTagData = useCallback(
    (data: any): PriceTagInfo => {
      let temp: PriceTagInfo = {};
      try {
        const {
          productSn,
          name,
          nameAppend,
          productCategoryId,
          rank,
          priceCurrency,
          color = [],
          stamp,
          sourceType,
          material,
          materialAppend,
          hardware = [],
          salesCode,
        } = data;
        temp = {
          productSn,
          name,
          productCategoryId,
          nameAppend: nameAppend ? nameAppend.join(',') : '',
          rank,
          stamp: stamp ? stamp.join(',') : '',
          salesCode,
          sourceType,
          material,
          materialAppend: materialAppend ? materialAppend.join(',') : '',
          color: color ? color.join(',') : '',
          hardware: hardware ? hardware.join(',') : '',
        };
        if (productCategoryId) {
          temp.productCategoryId =
            productCategoryId[productCategoryId.length - 1];
        }
        /** 价格+币种 */
        if (priceCurrency) {
          const { price, currency } = priceCurrency;
          temp.price = Number(price);
          temp.currency = currency;
          temp.shopId = shopId;
        }
      } catch (error) {
        console.log('🚀  ProductLabelEdit  error:', error);
      }
      console.log('🚀  ProductLabelEdit  temp:', temp);

      return temp;
    },
    [language, shopId, form]
  );

  /** Form Label 处理 */
  const LabelNameRander = useCallback(
    (props: any) => (
      <div
        className={styles.form_label}
        // 中文用默认宽度  英日会比较长
        style={language === 'zh_CN' ? {} : { width: 110 }}
      >
        {/* <div className={styles.form_required}></div> 暂时去掉*符号 */}
        {props.children}
      </div>
    ),
    [language]
  );

  return (
    <div className={styles.ProductLabelEdit}>
      <Spin spinning={loading}>
        <Row gutter={[48, 48]}>
          <Col {...outside_grid_left}>
            <div className={styles.left}>
              <div className={styles.content}>
                <div className={styles.title}>
                  {i18n.t('price_tag_preview')}
                </div>
                <div className="App">
                  <DndProvider backend={HTML5Backend}>
                    <PriceTag
                      size={'large'}
                      data={dataSource}
                      isRef={false}
                      type={'CONTENT'}
                      isDropped={false}
                      key={`box`}
                    />
                    {/* <PriceTagV2 />  */}
                  </DndProvider>
                </div>
              </div>
            </div>
          </Col>
          <Col {...outside_grid_right}>
            <div className={styles.right}>
              <div className={styles.title}>
                <div className={styles.subtitle}>
                  {i18n.t(mode === 'add' ? 'add_price_tag' : 'edit_price_tag')}
                </div>
                <div className={styles.tip}>{i18n.t('price_tag_tip')}</div>
              </div>
              <div className={styles.form}>
                <Form
                  form={form}
                  layout={'horizontal'}
                  onFinish={onFinish}
                  initialValues={{}}
                  onValuesChange={(changedValues, allValues) => {
                    setDataSource(handlePriceTagData(allValues));
                  }}
                >
                  <Row gutter={[48, 48]}>
                    <Col {...form_grid_1}>
                      <Form.Item
                        name="productSn"
                        label={
                          <LabelNameRander>
                            <Trans i18nKey={LOCALS.product_sn}></Trans>
                          </LabelNameRander>
                        }
                        rules={[
                          {
                            required: true,
                            message: i18n.t(LOCALS.please_enter) as string,
                          },
                          {
                            validator: async (_, value) => {
                              if (!value) return;
                              if (mode === 'add') {
                                /** 防抖 */
                                if (timeout) {
                                  clearTimeout(timeout);
                                  timeout = null;
                                }
                                let ccc = new Promise((resolve, reject) => {
                                  timeout = setTimeout(async () => {
                                    if (mode === 'add') {
                                      const {
                                        data: { total },
                                      } = await getPriceTagList({
                                        productSn: value,
                                      });
                                      if (total > 0) {
                                        return reject(
                                          new Error(
                                            i18n.t(
                                              'duplicate_item_number'
                                            ) as string
                                          )
                                        );
                                      }
                                      return resolve(undefined);
                                    }
                                  }, 666);
                                });
                                const d = await ccc;
                                console.log('🚀  validator:  d:', d);
                              }
                            },
                          },
                        ]}
                      >
                        <Input
                          placeholder={i18n.t(LOCALS.please_enter) || ''}
                          disabled={mode === 'edit'}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...form_grid_1}>
                      <Form.Item
                        name="sourceType"
                        label={<LabelNameRander></LabelNameRander>}
                        colon={false}
                        rules={[
                          {
                            required: true,
                            message: i18n.t(LOCALS.please_select) as string,
                          },
                        ]}
                      >
                        <Radio.Group>
                          <Radio value={0}>{i18n.t(LOCALS.recycle)}</Radio>
                          <Radio value={1}>{i18n.t(LOCALS.consignment)}</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 48]}>
                    <Col {...form_grid_1}>
                      <Form.Item
                        name="productCategoryId"
                        label={
                          <LabelNameRander>
                            <Trans i18nKey={LOCALS.product_category}></Trans>
                          </LabelNameRander>
                        }
                        rules={[
                          {
                            required: true,
                            message: i18n.t(LOCALS.please_enter) as string,
                          },
                        ]}
                      >
                        <Cascader
                          allowClear={false}
                          options={productCategoryCascaderOptions}
                          fieldNames={{
                            label: shopId === '1' ? 'label_ja' : 'label_en',
                            value: 'value',
                            children: 'children',
                          }}
                          onChange={(value, selectedOptions) => {
                            // 店铺不同 语言不同 使用字段不同
                            const shopIdField =
                              shopId === '1' ? 'label_ja' : 'label_en';
                            const lastName =
                              selectedOptions[selectedOptions.length - 1][
                                shopIdField
                              ];
                            // 设置商品名称
                            form.setFieldValue('name', lastName);
                            /** 设置价签显示
                             * form.setFieldValue不触发onValuesChange
                             * 官方给的的理由是：如果不这样可能会导致死循环
                             *  */
                            setDataSource(
                              handlePriceTagData(form.getFieldsValue())
                            );
                            // 设置材质内容
                            const level = value[0];
                            setMaterialCascaderOptions(
                              materialCascaderOptionsMap[level] || []
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...form_grid_1}>
                      <Form.Item
                        name="name"
                        label={
                          <LabelNameRander>
                            <Trans i18nKey={LOCALS.product_name}></Trans>
                          </LabelNameRander>
                        }
                        rules={[
                          {
                            required: true,
                            message: i18n.t(LOCALS.please_enter) as string,
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 48]}>
                    <Col {...form_grid_2}>
                      <Form.Item
                        name="nameAppend"
                        label={<LabelNameRander></LabelNameRander>}
                        colon={false}
                      >
                        <Checkbox.Group>
                          <div className={styles.form_checkbox}>
                            {NameOptions.map((d) => (
                              <Checkbox key={d.value} value={d.value}>
                                {d.label}
                              </Checkbox>
                            ))}
                          </div>
                        </Checkbox.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className={styles.productName_tip}>
                        {detailTitle || ''}
                      </div>
                    </Col>
                  </Row>

                  <Row gutter={[48, 48]}>
                    <Col {...form_grid_1}>
                      <Form.Item
                        name="rank"
                        label={
                          <LabelNameRander>
                            <Trans i18nKey={LOCALS.rank}></Trans>
                          </LabelNameRander>
                        }
                        rules={[
                          {
                            required: true,
                            message: i18n.t(LOCALS.please_select) as string,
                          },
                        ]}
                      >
                        <Select
                          placeholder={i18n.t(LOCALS.please_select) || ''}
                        >
                          {RankOption.map((d: any) => (
                            <Select.Option
                              key={d.value}
                              value={d[langMap[shopId]]}
                            >
                              {d[langMap[shopId]]}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col {...form_grid_1}>
                      <Form.Item
                        name="stamp"
                        label={
                          <LabelNameRander>
                            <Trans i18nKey={LOCALS.stamp}></Trans>
                          </LabelNameRander>
                        }
                        rules={[
                          {
                            required: true,
                            message: i18n.t(LOCALS.please_select) as string,
                          },
                        ]}
                      >
                        <Select
                          placeholder={i18n.t(LOCALS.please_select) || ''}
                          mode="tags"
                        >
                          {stampList.map((d: any, i) => (
                            <Select.Option
                              key={d[langMap[shopId]]}
                              value={d[langMap[shopId]]}
                            >
                              {d[langMap[shopId]]}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 48]}>
                    <Col {...form_grid_2}>
                      <Form.Item
                        name="color"
                        label={
                          <LabelNameRander>
                            <Trans i18nKey={LOCALS.color}></Trans>
                          </LabelNameRander>
                        }
                        rules={[
                          {
                            required: true,
                            message: i18n.t(LOCALS.please_select) as string,
                          },
                          {
                            validator: (_, value) => {
                              if (value && value.length > 3) {
                                return Promise.reject(
                                  new Error(
                                    i18n.t(
                                      LOCALS.select_a_maximum_of_three
                                    ) as string
                                  )
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Select
                          placeholder={i18n.t(LOCALS.please_select) || ''}
                          mode="tags"
                          showSearch
                        >
                          {colorSelectOptions.map((d: any) => (
                            <Select.Option
                              key={d.value}
                              value={d[langMap[shopId]]}
                            >
                              {d[langMap[shopId]]}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 48]}>
                    <Col {...form_grid_1}>
                      <Form.Item
                        name="materialSelect"
                        label={
                          <LabelNameRander>
                            <Trans i18nKey={LOCALS.material}></Trans>
                          </LabelNameRander>
                        }
                        rules={[
                          {
                            required: true,
                            message: i18n.t(LOCALS.please_select) as string,
                          },
                          {
                            validator: (_, value) => {
                              if (!value) return Promise.resolve();
                              if (value && value.length > 2) {
                                return Promise.reject(
                                  new Error(
                                    i18n.t(
                                      LOCALS.select_a_maximum_of_two
                                    ) as string
                                  )
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Cascader
                          options={materialCascaderOptions}
                          fieldNames={{
                            label: shopIdField,
                            value: shopIdField,
                            children: 'children',
                          }}
                          multiple
                          showCheckedStrategy={Cascader.SHOW_CHILD}
                          onChange={(value) => {
                            let material = value.map((d) => d[d.length - 1]);
                            form.setFieldValue('material', material.toString());
                            /** 设置价签显示
                             * form.setFieldValue不触发onValuesChange
                             * 官方给的的理由是：如果不这样可能会导致死循环
                             *  */
                            setDataSource(
                              handlePriceTagData(form.getFieldsValue())
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...form_grid_1}>
                      <Form.Item
                        name="material"
                        label={
                          <LabelNameRander>
                            <Trans i18nKey={LOCALS.material_remark}></Trans>
                          </LabelNameRander>
                        }
                        rules={[
                          {
                            required: true,
                            message: i18n.t(LOCALS.please_enter) as string,
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 48]}>
                    <Col {...form_grid_2}>
                      <Form.Item
                        name="hardware"
                        label={
                          <LabelNameRander>
                            <Trans i18nKey={LOCALS.hardware}></Trans>
                          </LabelNameRander>
                        }
                        rules={[
                          {
                            required: true,
                            message: i18n.t(LOCALS.please_select) as string,
                          },
                        ]}
                      >
                        <Select mode="tags">
                          {hardwareSelectOptions.map((d: any) => (
                            <Select.Option
                              key={d.id}
                              value={d[langMap[shopId]]}
                            >
                              {d[langMap[shopId]]}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 48]}>
                    <Col {...form_grid_1}>
                      <Form.Item
                        name="priceCurrency"
                        label={
                          <LabelNameRander>
                            <Trans i18nKey={LOCALS.price}></Trans>
                          </LabelNameRander>
                        }
                        rules={[
                          {
                            required: true,
                            message: i18n.t(LOCALS.please_enter) as string,
                          },
                        ]}
                      >
                        <PriceCurrency shopId={shopId} key={'priceCurrency'} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 48]}>
                    <Col {...form_grid_1}>
                      <Form.Item
                        name="salesCode"
                        label={
                          <LabelNameRander>
                            <Trans i18nKey={LOCALS.sales_code}></Trans>
                          </LabelNameRander>
                        }
                        rules={[
                          {
                            required: true,
                            message: i18n.t(LOCALS.please_enter) as string,
                          },
                        ]}
                      >
                        <Input placeholder={i18n.t(LOCALS.sales_code) || ''} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[48, 48]}>
                    <Col {...outside_grid_right}>
                      <Row justify={'center'}>
                        <Form.Item>
                          <Space>
                            <Button onClick={(onReset) => navigate(-1)}>
                              <Trans i18nKey={LOCALS.back} />
                            </Button>
                            <Button type="primary" htmlType="submit">
                              <Trans i18nKey={LOCALS.submit} />
                            </Button>
                          </Space>
                        </Form.Item>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Spin>

      {contextHolder}
    </div>
  );
};
export default ProductLabelEdit;
