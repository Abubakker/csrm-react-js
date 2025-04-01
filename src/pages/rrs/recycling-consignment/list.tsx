import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './index.module.scss';
import {
  Button,
  Select,
  Space,
  Form,
  Row,
  Col,
  Table,
  DatePicker,
  Segmented,
  message,
} from 'antd';
import SelectSearch, { DataProps } from './input-components/select-search';
import { Trans } from 'react-i18next';
import LOCALS from 'commons/locals';
import {
  StatusListDefault,
  OrderType,
  OrderProgress,
  AccessoriesMapping,
} from 'constants/RecyclingConsignment';
import { fetchOmsRecyclingList, fetchStatusTotal } from 'apis/oms';
import {
  OmsRecycleOrderDetail,
  OmsRecycleOrderPayload,
  OmsRecycleOrderStatusTotal,
} from 'types/oms';
import usePagination from 'commons/hooks/usePagination';
import { useNavigate } from 'react-router-dom';
import useMoreModal from 'pages/rrs/recycling-consignment/modal-components';
import { getColumns } from './utils';
import dayjs from 'dayjs';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { useAppSelector } from 'store/hooks';
import findCascaderOptionById from 'utils/findCascaderOptionById';
import useResource from 'commons/hooks/useResource';
import setQueryParameters from 'utils/setQueryParameters';
import queryString from 'query-string';
import {
  OMS_RECYCLE_ORDER_PRIORITY_OPTION_LIST,
  SYS_USER_SHOP_OPTION_LIST,
} from 'commons/options';
import i18n from '../../../i18n';
import classNames from 'classnames';
import {
  getDempyouOrderInfo,
  getDempyouProduct,
  getDempyouToPrint,
  PrintParamType,
  ProductType,
} from '../../../utils/getDempyouParam';
import { getProductLabel } from '../../../utils/getProductLabel';

const { RangePicker } = DatePicker;

const RecyclingConsignmentList = () => {
  const viewUserInfoResource = useResource(
    'recycling-consignment-view-user-info',
  );

  const [form] = Form.useForm<OmsRecycleOrderPayload>();
  const navigate = useNavigate();
  /** 展开 */
  const [fold, setFold] = useState(true);
  /** 选择key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  /** 加载参数 */
  const payloadRef = useRef<OmsRecycleOrderPayload>({});
  /** table */
  const {
    loading,
    setLoading,
    pageNum,
    setPageNum,
    pageSize,
    setPageSize,
    total,
    setTotal,
    dataSource,
    setDataSource,
  } = usePagination<OmsRecycleOrderDetail>();
  /** 操作行 */
  const optionRowDataRef = useRef<OmsRecycleOrderDetail>({});
  /** Modal参数 */
  const modalOptionRef = useRef<any>({});
  /** 状态选择 */
  const [status, setStatus] = useState<string | number | undefined>('1');
  const statusRef = useRef('1');
  const [statusObject, setStatusObject] =
    useState<OmsRecycleOrderStatusTotal>();

  const {
    materialCascaderOptionsMap,
    productCategoryCascaderOptions,
    accessorySelectOptions,
    colorSelectOptions,
    rankSelectOptions,
    stampSelectOptions,
    hardwareSelectOptions,
    staffSelectOptions,
    countryOptions,
  } = useAppSelector(selectGlobalInfo);

  /** 加载接口 */
  const getList = useCallback(
    (pageNum = 1, pageSize = 10) => {
      setPageNum(pageNum);
      setPageSize(pageSize);

      const { selectSearch } = payloadRef.current;
      setQueryParameters({
        pageNum,
        pageSize,
        status: statusRef.current,
        selectSearch: selectSearch ? JSON.stringify(selectSearch) : undefined,
      });

      setLoading(true);
      fetchOmsRecyclingList({
        ...payloadRef.current,
        pageNum,
        pageSize,
        status: statusRef.current === 'all' ? '' : statusRef.current,
      })
        .then((data) => {
          setTotal(data.data.total || 0);
          setDataSource(data.data.list);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setDataSource, setLoading, setPageNum, setPageSize, setTotal],
  );

  /** 默认刷新 */
  const getLoad = useCallback(
    (page = 1, pageSize = 10) => {
      getList(page, pageSize);
      getStatusTotal();
    },
    [getList],
  );

  const forwardReceipt = useCallback(async () => {
    // Check if selectedRowKeys is empty
    if (selectedRowKeys.length === 0) {
      message.warning(i18n.t('Please select at least one order'));
      return;
    }

    // Get the selected rows data from dataSource
    const selectedRows = dataSource.filter((row) =>
      selectedRowKeys.includes(row?.omsRecycleOrder?.id || 0),
    );

    // Check if all selected orders have the same type
    const b = selectedRows.every(
      (d) => d.omsRecycleOrder?.type === selectedRows[0].omsRecycleOrder?.type,
    );
    if (!b) {
      message.warning(i18n.t('consignment_orders_and'));
      return;
    }

    const prodList: ProductType[] = [];
    let orderInfo: PrintParamType | undefined = undefined;

    try {
      // Get order info for receipt
      orderInfo = await getDempyouOrderInfo(selectedRows[0], {
        staffSelectOptions,
        countryOptions,
        idCertificate: selectedRows[0]?.umsMember?.idCertificate,
      });

      // Process each selected row for receipt
      selectedRows.forEach((d) => {
        const label = getProductLabel(
          {
            productCategoryCascaderOptions,
            colorSelectOptions,
            rankSelectOptions,
            stampSelectOptions,
            materialCascaderOptionsMap,
            hardwareSelectOptions,
            accessorySelectOptions,
          },
          {
            attrAccessory: d.omsRecycleOrderProduct?.accessory,
            attrColor: d.omsRecycleOrderProduct?.attrColor,
            attrHardware: d.omsRecycleOrderProduct?.attrHardware,
            attrMaterial: d.omsRecycleOrderProduct?.attrMaterial,
            attrSize: d.omsRecycleOrderProduct?.attrSize,
            attrStamp: d.omsRecycleOrderProduct?.attrStamp,
            productCategoryId: d.omsRecycleOrderProduct?.productCategoryId,
          },
        );

        // Format product name with all attributes
        const name = `${label.productCategorySelectLabelList} ${
          label.materialSelectLabelList
        } ${label.colorSelectLabelList} ${
          d.omsRecycleOrderProduct?.fullStamp || label.stampSelectLabel
        } ${label.hardwareSelectLabel}`;

        prodList.push(getDempyouProduct(d, { name })!);
      });

      if (prodList && orderInfo) {
        getDempyouToPrint({
          productList: prodList,
          printParam: orderInfo,
          prints: true,
        });
      }
    } catch (error) {
      console.error('Error generating receipt:', error);
      message.error(i18n.t('Failed to generate receipt'));
    }
  }, [
    selectedRowKeys,
    dataSource,
    accessorySelectOptions,
    colorSelectOptions,
    countryOptions,
    hardwareSelectOptions,
    materialCascaderOptionsMap,
    productCategoryCascaderOptions,
    rankSelectOptions,
    staffSelectOptions,
    stampSelectOptions,
  ]);

  // Mount
  useEffect(() => {
    const parsed = queryString.parse(window.location.search);

    const pageNum = parsed.pageNum ? +parsed.pageNum : 1;
    const pageSize = parsed.pageSize ? +parsed.pageSize : 10;
    const status = (parsed.status ? parsed.status : '1') as string;
    const selectSearch = parsed.selectSearch
      ? JSON.parse(parsed.selectSearch as string)
      : undefined;

    setPageNum(pageNum);
    setPageSize(pageSize);
    statusRef.current = status;
    setStatus(status);

    if (selectSearch) {
      form.setFieldValue('selectSearch', selectSearch);
      payloadRef.current = {
        selectSearch,
        [selectSearch.field]: selectSearch.value,
      };
    }

    getLoad(pageNum, pageSize);
  }, [form, getLoad, setPageNum, setPageSize]);

  /** 弹窗相关数据 */
  const {
    valuationModalElement,
    setValuationModalOpen,
    shiplableModalElement,
    setShiplableModalOpen,
    goodsReceivedModalElement,
    setGoodsReceivedModalOpen,
    finalValuationModalElement,
    setFinalValuationModalOpen,
    logisticsDocumentModalElement,
    setLogisticsDocumentModalOpen,
    updateFinalValuationModalElement,
    setUpdateFinalValuationModalOpen,
    confirmSettlementModalElement,
    setConfirmSettlementModalOpen,
    confirmReturnModalElement,
    setConfirmReturnModalOpen,
    createPaymentVoucherModalElement,
    setPaymentVoucherModalOpen,
    deliverGoodsModalElement,
    setDeliverGoodsModalOpen,
    setCustomerAgreeValuationModalOpen,
    customerAgreeValuationModalElement,
    setPayInfoModalOpen,
    payInfoModalElement,
  } = useMoreModal({
    dataSource: optionRowDataRef.current,
    modalOption: modalOptionRef.current,
    getLoad: getLoad,
  });

  /** 搜索 */
  const onFinish = () => {
    form.validateFields().then((values: OmsRecycleOrderPayload) => {
      statusRef.current = 'all';
      setStatus('all');
      const { time, ...rest } = values;
      const selectSearch: DataProps = values.selectSearch as DataProps;
      let payload = {
        ...rest,
        [selectSearch.field]: selectSearch.value,
      };
      if (time) {
        payload.beginCommitTime = dayjs(time[0]).startOf('days').format();
        payload.endCommitTime = dayjs(time[1]).endOf('days').format();
      }
      payloadRef.current = { ...payload };
      getLoad();
    });
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  /** 渲染商品信息 */
  const ProductShowData = useCallback(
    (data: OmsRecycleOrderDetail): React.ReactNode => {
      const { omsRecycleOrderProduct, omsRecycleOrderItem = {} } = data;
      const {
        productCategoryId = 0,
        attrAccessory,
        attrColor,
        attrStamp,
        attrMaterial,
        attrHardware,
        name,
      } = omsRecycleOrderProduct || {};
      // 配件
      const accessory: string[] = [];
      if (attrAccessory) {
        attrAccessory.split(',').forEach((d: string) => {
          const t = accessorySelectOptions.find((dd) => dd.value === d);
          if (t) accessory.push(t.label);
        });
      }
      // color
      const color: string[] = [];
      attrColor &&
        attrColor.split(',')?.forEach((d: string) => {
          const t = colorSelectOptions.find((dd) => dd.value === d);
          if (t) color.push(t.label);
        });
      // material
      const material: string[] = [];
      const target = findCascaderOptionById(
        productCategoryId,
        productCategoryCascaderOptions,
      );
      const productCategoryIds = target?.treeIds?.split(',')?.map(Number) || [];
      const mateList = materialCascaderOptionsMap[productCategoryIds[0]] || [];
      attrMaterial &&
        attrMaterial.split(',')?.forEach((d: string) => {
          const t = findCascaderOptionById(d, mateList);
          if (t) material.push(t.label);
        });
      // hardware
      const hardware: string[] = [];
      attrHardware &&
        attrHardware.split(',')?.forEach((d: string) => {
          const t = hardwareSelectOptions.find((dd) => dd.value === d);
          if (t) hardware.push(t.label);
        });

      // 商品名、素材、色、刻印、金具
      const info1 = (
        <div className={classNames('whitespace-pre-line')}>
          {[
            name || '',
            material.join('、') || '',
            color.join('、') || '',
            stampSelectOptions.find((d) => d.value === attrStamp)?.label,
            hardware.join('、') || '',
          ]
            .filter((i) => !!i)
            .join('\n')}
        </div>
      );
      const productAccessories = omsRecycleOrderItem.productAccessories;
      let AccessoriesList = [];
      if (productAccessories) {
        const access = JSON.parse(productAccessories);
        const list = access.map((d: string) => AccessoriesMapping[d]);
        AccessoriesList = list.join('、');
      }
      const productStatus = omsRecycleOrderItem.productStatus || 0;
      const info2 = (
        <div className={styles.product}>
          <div>
            <span>
              {
                ['', i18n.t(LOCALS.unused), i18n.t(LOCALS.secondhand)][
                  productStatus
                ]
              }
            </span>
            &nbsp;&nbsp;&nbsp;
            <span>{omsRecycleOrderItem.productTitle}</span>
            &nbsp;&nbsp;&nbsp;
          </div>
          <div>
            <span>{AccessoriesList}</span>
          </div>
        </div>
      );
      const t = info1;
      return <div>{t}</div>;
    },
    [
      materialCascaderOptionsMap,
      productCategoryCascaderOptions,
      accessorySelectOptions,
      colorSelectOptions,
      stampSelectOptions,
      hardwareSelectOptions,
    ],
  );

  /** 表格列 */
  const columns = useCallback(
    () =>
      getColumns({
        setRowData: (data: OmsRecycleOrderDetail) =>
          (optionRowDataRef.current = data),
        setModalOption: (data: any) => (modalOptionRef.current = data),
        navigate,
        setValuationModalOpen,
        setShiplableModalOpen,
        setGoodsReceivedModalOpen,
        setLogisticsDocumentModalOpen,
        setFinalValuationModalOpen,
        setUpdateFinalValuationModalOpen,
        setConfirmSettlementModalOpen,
        setConfirmReturnModalOpen,
        setPaymentVoucherModalOpen,
        setDeliverGoodsModalOpen,
        setCustomerAgreeValuationModalOpen,
        setPayInfoModalOpen,
        ProductShowData,
        getLoad,
        status,
        viewUserInfoResource,
      }),
    [
      navigate,
      setValuationModalOpen,
      setShiplableModalOpen,
      setGoodsReceivedModalOpen,
      setLogisticsDocumentModalOpen,
      setFinalValuationModalOpen,
      setUpdateFinalValuationModalOpen,
      setConfirmSettlementModalOpen,
      setConfirmReturnModalOpen,
      setPaymentVoucherModalOpen,
      setDeliverGoodsModalOpen,
      setCustomerAgreeValuationModalOpen,
      setPayInfoModalOpen,
      ProductShowData,
      getLoad,
      status,
      viewUserInfoResource,
    ],
  );

  /** 状态总数 */
  const getStatusTotal = () => {
    fetchStatusTotal().then((d) => {
      const { data } = d;
      let count: number = 0;
      Object.values(data).forEach((d) => (count += d));
      setStatusObject({ ...data, count });
    });
  };

  return (
    <div className={styles.RecyclingConsignmentList}>
      <div className={styles.form}>
        <Form
          form={form}
          onFinish={onFinish}
          layout="inline"
          style={{ display: 'block' }}
          initialValues={{
            type: '',
            phaseType: '',
            selectSearch: {
              field: 'submissionId',
              value: '',
              valueType: 'number',
            },
          }}
        >
          <Row gutter={[12, 12]}>
            <Col span={6}>
              <Form.Item
                name="selectSearch"
                rules={[
                  {
                    validator: (_, value) => {
                      if (
                        value &&
                        value.field === 'memberId' &&
                        isNaN(value.value)
                      ) {
                        return Promise.reject('格式错误');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <SelectSearch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    <Trans i18nKey={LOCALS.search} />
                  </Button>
                  <Button
                    htmlType="button"
                    onClick={() => {
                      form.resetFields();
                      payloadRef.current = {};
                      statusRef.current = '1';
                      setStatus('1');
                      setSelectedRowKeys([]);
                      getLoad();
                    }}
                  >
                    <Trans i18nKey={LOCALS.reset} />
                  </Button>
                  {/* <Button type="primary" onClick={() => {}}>
                    导出
                  </Button> */}
                  <Button
                    type="primary"
                    disabled={selectedRowKeys.length === 0}
                    onClick={forwardReceipt}
                  >
                    {i18n.t('yYqvdvcMFh')}
                  </Button>
                </Space>
              </Form.Item>
            </Col>
            <Col span={12}>
              <div className={styles.unfold}>
                <Button type="link" onClick={() => setFold(!fold)}>
                  {fold ? i18n.t(LOCALS.collapse) : i18n.t(LOCALS.expand)}
                </Button>
              </div>
            </Col>
          </Row>
          {fold && (
            <div className={styles.hidden}>
              <Form.Item name="time" label={i18n.t(LOCALS.created_time)}>
                <RangePicker style={{ width: 260 }} />
              </Form.Item>
              <Form.Item name="type" label={i18n.t(LOCALS.order_type)}>
                <Select options={OrderType} style={{ width: 120 }}></Select>
              </Form.Item>
              <Form.Item name="phaseType" label={i18n.t(LOCALS.order_progress)}>
                <Select options={OrderProgress} style={{ width: 120 }}></Select>
              </Form.Item>
              <Form.Item name="priority" label={i18n.t(LOCALS.priority)}>
                <Select
                  options={OMS_RECYCLE_ORDER_PRIORITY_OPTION_LIST}
                  style={{ width: 120 }}
                ></Select>
              </Form.Item>
              <Form.Item name="storeId" label={i18n.t(LOCALS.shop)}>
                <Select
                  options={SYS_USER_SHOP_OPTION_LIST}
                  style={{ width: 150 }}
                ></Select>
              </Form.Item>
            </div>
          )}
        </Form>
      </div>
      <div className={styles.tabs}>
        <Segmented
          block
          options={StatusListDefault.map((d, i) => ({
            label: `${d.label}(${
              statusObject && statusObject[d.filed] ? statusObject[d.filed] : 0
            })`,
            value: d.key,
          }))}
          value={status}
          onChange={(e) => {
            statusRef.current = e as string;
            setStatus(e);
            getLoad();
          }}
        />
      </div>
      <div className={styles.table}>
        <Table
          bordered
          columns={columns()}
          dataSource={dataSource}
          scroll={{ x: 'max-content', y: '60vh' }}
          rowSelection={rowSelection}
          rowKey={(record) => {
            if (!record) return 0;
            return record?.omsRecycleOrder?.id || 0;
          }}
          loading={loading}
          pagination={{
            total,
            pageSize,
            current: pageNum,
            showTotal: (total) => `${i18n.t(LOCALS.total)} ${total}`,
            onChange: (page, pageSize) => {
              getLoad(page, pageSize);
            },
          }}
        />
      </div>

      {/* -------下面是Modal弹窗-------- */}

      {/* 提交初步估值 */}
      {valuationModalElement()}

      {/* 上传shiplable */}
      {shiplableModalElement()}

      {/* 确认收货 */}
      {goodsReceivedModalElement()}

      {/* 最终报价 */}
      {finalValuationModalElement()}

      {/* 上传物流凭证 */}
      {logisticsDocumentModalElement()}

      {/* 修改报价 */}
      {updateFinalValuationModalElement()}

      {/* 确认结算 */}
      {confirmSettlementModalElement()}

      {/* 确认退货 */}
      {confirmReturnModalElement()}

      {/* 打款信息 */}
      {createPaymentVoucherModalElement()}

      {/* 意向订单-选择发货 */}
      {deliverGoodsModalElement()}

      {/* 意向订单-同意最终报价 */}
      {customerAgreeValuationModalElement()}

      {/* 意向订单-付款信息 */}
      {payInfoModalElement()}
    </div>
  );
};

export default RecyclingConsignmentList;
