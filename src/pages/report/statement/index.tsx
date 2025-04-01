import {
  Table,
  Form,
  DatePicker,
  Button,
  Space,
  Row,
  Col,
  Card,
  Select,
} from 'antd';
import { ColumnType } from 'antd/es/table';
import { getDailyStatistics } from 'apis/report';
import LOCALS from 'commons/locals';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { useToggle } from 'react-use';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import {
  DailyStatisticsType,
  OrderStatisticsType,
  PurchaseReportType,
  ConsignmentReportType,
} from 'types/report';
import i18n from 'i18n';
import findCascaderOptionById from 'utils/findCascaderOptionById';
import { PaymentMethod } from 'constants/RecyclingConsignment';
import { thousands } from 'utils/tools';
import {
  ORDER_STATISTIC_OPTION_LIST,
  PRODUCT_SOURCE_TYPE_OPTION_LIST,
} from 'commons/options';
import classNames from 'classnames';
import exportToExcel from 'utils/exportToExcel';

interface CustomColumnType<T> extends ColumnType<T> {
  hidden?: boolean; // 添加自定义的 hidden 属性
}

const Statement = () => {
  const [form] = Form.useForm<{
    date: string;
    createdFrom: number;
  }>();
  const [dailyData, setDailyData] = useState<DailyStatisticsType>();
  const [loading, toggleLoading] = useToggle(false);
  const { staffSelectOptions, productCategoryCascaderOptions } =
    useAppSelector(selectGlobalInfo);

  const renderStatistics = useCallback(
    (
      items: {
        name: string;
        value: number | string;
        key: string;
      }[]
    ) => {
      const md_cols = items.length;
      return (
        <div className="mb-4 mt-4">
          <Row gutter={[16, 16]} className="flex items-center">
            <Col flex="auto">
              <Card
                bordered={false}
                size="small"
                bodyStyle={{ padding: '16px', backgroundColor: '#EBF5FF' }}
                className="rounded-lg"
              >
                <div
                  className={classNames(
                    `w-full grid gap-4 grid-cols-${md_cols}`
                  )}
                  style={{
                    gridTemplateColumns: `repeat(${md_cols}, minmax(0, 1fr))`,
                  }}
                >
                  {items.map((d, index) => (
                    <div
                      key={index}
                      className="flex justify-center items-center flex-col"
                    >
                      <div className="text-sm text-gray-600 text-center mb-1">
                        {d.name}
                      </div>
                      <div className="text-lg font-semibold text-blue-700">
                        {d.value}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      );
    },
    []
  );

  const currencySwtich = useCallback(
    (value: number) => {
      const { createdFrom } = form.getFieldsValue();
      return createdFrom === 2
        ? `HKD ${thousands(value)}`
        : createdFrom === 3
        ? `SGD ${thousands(value)}`
        : `JPY ${thousands(value)}`;
    },
    [form]
  );

  const salesStats = useMemo(() => {
    const summary = dailyData?.orderStatistics?.summary;
    if (!summary) return null;

    const items = [
      {
        name: i18n.t('total_orders'),
        value: thousands(summary.totalOrders),
        key: 'totalOrders',
      },
      {
        name: i18n.t('total_sales_quantity'),
        value: thousands(summary.totalSalesQuantity),
        key: 'totalSalesQuantity',
      },
      {
        name: i18n.t('total_order_amount'),
        value: `JPY ${thousands(summary.totalOrderAmount)}`,
        key: 'totalOrderAmount',
      },
      {
        name: i18n.t('total_discount_amount'),
        value: `JPY ${thousands(summary.totalDiscountAmount)}`,
        key: 'totalDiscountAmount',
      },
      {
        name: i18n.t('total_tax_amount'),
        value: `JPY ${thousands(summary.totalTaxAmount)}`,
        key: 'totalTaxAmount',
      },
      {
        name: i18n.t('total_pay_amount_statistics'),
        value: `JPY ${thousands(summary.totalPayAmount)}`,
        key: 'totalPayAmount',
      },
    ];

    return { ele: renderStatistics(items), dataSource: items };
  }, [dailyData?.orderStatistics?.summary, renderStatistics]);

  const purchaseStats = useMemo(() => {
    const statistics = dailyData?.purchaseReport?.statistics;
    if (!statistics) return null;
    const items = [
      {
        name: i18n.t('purchase_total_purchase_quantity'),
        value: thousands(statistics.totalPurchaseQuantity),
        key: 'totalPurchaseQuantity',
      },
      {
        name: i18n.t('purchase_total_cost_price'),
        value: currencySwtich(statistics.totalCostPrice),
        key: 'totalCostPrice',
      },
    ];

    return { ele: renderStatistics(items), dataSource: items };
  }, [currencySwtich, dailyData?.purchaseReport?.statistics, renderStatistics]);

  const consignmentStats = useMemo(() => {
    const statistics = dailyData?.consignmentReport?.statistics;
    if (!statistics) return null;
    const items = [
      {
        name: i18n.t('consignment_total_purchase_quantity'),
        value: thousands(statistics.totalPurchaseQuantity),
        key: 'totalPurchaseQuantity',
      },
      {
        name: i18n.t('consignment_total_cost_price'),
        value: currencySwtich(statistics.totalCostPrice),
        key: 'totalCostPrice',
      },
      {
        name: i18n.t('consignment_total_price'),
        value: currencySwtich(statistics.totalPrice),
        key: 'totalPrice',
      },
    ];

    return { ele: renderStatistics(items), dataSource: items };
  }, [
    currencySwtich,
    dailyData?.consignmentReport?.statistics,
    renderStatistics,
  ]);

  const fetchData = useCallback(
    (date?: string, createdFrom?: number) => {
      const toDay = dayjs().startOf('day').format();
      toggleLoading(true);
      getDailyStatistics({ date: date || toDay, createdFrom })
        .then((res) => {
          setDailyData(res);
        })
        .finally(() => {
          toggleLoading(false);
        });
    },
    [toggleLoading]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columnsRender = useCallback(
    () => ({
      salesPaymentMethod: (
        paymentMethod: Record<string, number>,
        record: OrderStatisticsType
      ) => {
        const entries = Object.entries(paymentMethod || {});
        if (entries.length === 0) return '';
        return entries.length === 1
          ? entries[0][0]
          : entries
              .map(
                ([method, amount]) =>
                  `${method}: ${record.currency} ${thousands(amount)}`
              )
              .join(', ');
      },
      publicStaff: (createdBy: number | string) =>
        staffSelectOptions.find((d) => d.value === Number(createdBy))?.label ||
        createdBy,
      purchaseCategoryId: (categoryId: number) => {
        const target = findCascaderOptionById(
          categoryId,
          productCategoryCascaderOptions
        );
        return target?.label || '';
      },
    }),
    [productCategoryCascaderOptions, staffSelectOptions]
  );

  const salesColumns: CustomColumnType<OrderStatisticsType>[] = useMemo(() => {
    return [
      {
        title: i18n.t('sales_date'),
        dataIndex: 'date',
        key: 'date',
        render: (date: OrderStatisticsType['date']) =>
          dayjs(date).format('YYYY-MM-DD'),
        width: 110,
      },
      {
        title: i18n.t('sales_customer_id'),
        dataIndex: 'memberId',
        key: 'memberId',
        render: (memberId: OrderStatisticsType['memberId']) => (
          <a href={`/ums/member-view/${memberId}`}>{memberId}</a>
        ),
        width: 80,
      },
      {
        title: i18n.t('sales_product_id'),
        dataIndex: 'productIds',
        key: 'productIds',
        render: (productIds: OrderStatisticsType['productIds']) => (
          <div className="space-x-2">
            {productIds?.map((item) => (
              <a
                href={`/pms/product-edit/${item.productId}`}
                key={item.productId}
              >
                {item.productId}
              </a>
            ))}
          </div>
        ),
        width: 80,
      },
      {
        title: i18n.t('dwawuQNUEi'),
        dataIndex: 'orderId',
        key: 'orderId',
        render: (orderId: OrderStatisticsType['orderId']) => (
          <a href={`/oms/order-view/${orderId}`}>{orderId}</a>
        ),
        width: 80,
      },
      {
        title: i18n.t('sales_quantity_sold'),
        dataIndex: 'salesQuantity',
        key: 'salesQuantity',
        width: 100,
      },
      {
        title: i18n.t('currency'),
        dataIndex: 'currency',
        key: 'currency',
        width: 100,
        hidden: true,
      },
      {
        title: i18n.t('sales_sales_amount_(subtotal)'),
        dataIndex: 'payAmountActualCurrency',
        key: 'payAmountActualCurrency',
        render: (
          payAmountActualCurrency: OrderStatisticsType['payAmountActualCurrency'],
          record: OrderStatisticsType
        ) => `${record.currency} ${thousands(payAmountActualCurrency)}`,
        width: 150,
      },
      {
        title: i18n.t('sales_discount_promotion'),
        dataIndex: 'discountAmount',
        key: 'discountAmount',
        width: 160,
        render: (discountAmount: OrderStatisticsType['discountAmount']) =>
          `JPY ${thousands(discountAmount)}`,
      },
      {
        title: i18n.t('gross_profit'),
        dataIndex: 'grossProfit',
        key: 'grossProfit',
        width: 160,
        render: (
          grossProfit: OrderStatisticsType['grossProfit'],
          record: OrderStatisticsType
        ) => (
          <span
            className={classNames({
              'text-red-500': record.hasMissingCostPrice,
            })}
          >
            {`${record.currency} ${thousands(grossProfit)}`}
          </span>
        ),
      },
      {
        title: i18n.t('sales_total'),
        dataIndex: 'totalAmountActualCurrency',
        key: 'totalAmountActualCurrency',
        width: 110,
        render: (
          totalAmountActualCurrency: OrderStatisticsType['totalAmountActualCurrency'],
          record: OrderStatisticsType
        ) => `${record.currency} ${thousands(totalAmountActualCurrency)}`,
      },
      {
        title: i18n.t('sales_tax'),
        dataIndex: 'taxAmount',
        key: 'taxAmount',
        render: (taxAmount: OrderStatisticsType['taxAmount']) =>
          `JPY ${thousands(taxAmount)}`,
        width: 120,
      },
      {
        title: i18n.t('sales_payment_method'),
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
        render: (
          paymentMethod: Record<string, number>,
          record: OrderStatisticsType
        ) => columnsRender().salesPaymentMethod(paymentMethod, record),
        width: 110,
      },
      {
        title: i18n.t('sales_responsible'),
        dataIndex: 'createdBy',
        key: 'createdBy',
        width: 110,
        render: (createdBy: OrderStatisticsType['createdBy']) =>
          columnsRender().publicStaff(createdBy),
      },
      {
        title: i18n.t('sales_notes'),
        dataIndex: 'note',
        key: 'note',
        width: 110,
      },
    ];
  }, [columnsRender]);

  const purchaseColumns: CustomColumnType<PurchaseReportType>[] =
    useMemo(() => {
      return [
        {
          title: i18n.t('purchase_date'),
          dataIndex: 'date',
          key: 'date',
          render: (date: PurchaseReportType['date']) =>
            dayjs(date).format('YYYY-MM-DD'),
          width: 110,
        },
        {
          title: i18n.t('purchase_product_id'),
          dataIndex: 'productId',
          key: 'productId',
          render: (productId: PurchaseReportType['productId']) => (
            <a href={`/pms/product-edit/${productId}`}>{productId}</a>
          ),
          width: 80,
        },
        {
          title: i18n.t('purchase_quantity_purchased'),
          dataIndex: 'purchaseQuantity',
          key: 'purchaseQuantity',
          width: 100,
        },
        {
          hidden: true,
          title: i18n.t('currency'),
          dataIndex: 'currency',
          key: 'currency',
          width: 100,
        },
        {
          title: i18n.t('purchase_purchase_price_(unit)'),
          dataIndex: 'costPrice',
          key: 'costPrice',
          width: 100,
          render: (
            costPrice: PurchaseReportType['costPrice'],
            record: PurchaseReportType
          ) => `${record.currency} ${thousands(costPrice)}`,
        },
        // {
        //   // Todo 字段暂无
        //   title: (
        //     <Trans i18nKey={LOCALS['purchase_purchase_amount_(subtotal)']} />
        //   ),
        //   dataIndex: 'payAmount22',
        //   key: 'payAmount22'
        // },
        {
          // Todo 字段暂无
          title: i18n.t('purchase_point'),
          dataIndex: 'points',
          key: 'points',
          width: 120,
        },
        {
          title: i18n.t('purchase_supplier'),
          dataIndex: 'supplierId',
          key: 'supplierId',
          width: 130,
          render: (supplierId: PurchaseReportType['supplierId']) => (
            <a href={`/ums/member-view/${supplierId}`}>{supplierId}</a>
          ),
        },
        {
          title: i18n.t('purchase_category'),
          dataIndex: 'categoryId',
          key: 'categoryId',
          width: 100,
          render: (categoryId: PurchaseReportType['categoryId']) =>
            columnsRender().purchaseCategoryId(categoryId),
        },
        {
          title: i18n.t('purchase_payment_method'),
          dataIndex: 'paymentMethod',
          key: 'paymentMethod',
          width: 120,
          render: (paymentMethod: PurchaseReportType['paymentMethod']) =>
            PaymentMethod.find((d) => d.value === paymentMethod)?.label,
        },
        {
          title: i18n.t('purchase_responsible'),
          dataIndex: 'owner',
          key: 'owner',
          width: 120,
          render: (owner: PurchaseReportType['owner']) =>
            columnsRender().publicStaff(owner),
        },
        {
          title: i18n.t('purchase_notes'),
          dataIndex: 'remark',
          key: 'remark',
          width: 120,
        },
      ];
    }, [columnsRender]);

  const consignmentColumns: CustomColumnType<ConsignmentReportType>[] =
    useMemo(() => {
      return [
        {
          title: i18n.t('consignment_date'),
          dataIndex: 'date',
          key: 'date',
          render: (date: ConsignmentReportType['date']) =>
            dayjs(date).format('YYYY-MM-DD'),
          width: 120,
        },

        {
          title: i18n.t('consignment_product_id'),
          dataIndex: 'productId',
          key: 'productId',
          render: (productId: ConsignmentReportType['productId']) => (
            <a href={`/pms/product-edit/${productId}`}>{productId}</a>
          ),
          width: 120,
        },
        {
          title: i18n.t('consignment_quantity_consigned'),
          dataIndex: 'purchaseQuantity',
          key: 'purchaseQuantity',
          width: 120,
        },
        {
          title: i18n.t('consignment_consignor'),
          dataIndex: 'consignor',
          key: 'consignor',
          width: 120,
          render: (consignor: ConsignmentReportType['consignor']) => (
            <a href={`/ums/member-view/${consignor}`}>{consignor}</a>
          ),
        },
        {
          hidden: true,
          title: i18n.t('currency'),
          dataIndex: 'currency',
          key: 'currency',
          width: 100,
        },
        {
          title: i18n.t('consignment_contract_price'),
          dataIndex: 'costPrice',
          key: 'costPrice',
          render: (
            costPrice: ConsignmentReportType['costPrice'],
            record: ConsignmentReportType
          ) => `${record.currency} ${thousands(costPrice)}`,
          width: 120,
        },
        {
          title: i18n.t('consignment_selling_price'),
          dataIndex: 'price',
          key: 'price',
          width: 120,
          render: (
            price: ConsignmentReportType['price'],
            record: ConsignmentReportType
          ) => `${record.currency} ${thousands(price)}`,
        },
        {
          // Todo 字段暂无
          title: i18n.t('consignment_point'),
          dataIndex: 'point',
          key: 'point',
          width: 100,
        },
        {
          title: i18n.t('consignment_sales_status'),
          dataIndex: 'publishStatus',
          key: 'publishStatus',
          width: 100,
        },
        {
          title: i18n.t('consignment_payment_method'),
          dataIndex: 'paymentMethod',
          key: 'paymentMethod',
          width: 100,
          render: (paymentMethod: ConsignmentReportType['paymentMethod']) =>
            PaymentMethod.find((d) => d.value === paymentMethod)?.label,
        },
        {
          title: i18n.t('consignment_responsible'),
          dataIndex: 'owner',
          key: 'owner',
          width: 100,
          render: (owner: ConsignmentReportType['owner']) =>
            columnsRender().publicStaff(owner),
        },
        {
          title: i18n.t('consignment_notes'),
          dataIndex: 'remark',
          key: 'remark',
          width: 100,
        },
      ];
    }, [columnsRender]);

  const onFinish = useCallback(async () => {
    const { date, createdFrom } = form.getFieldsValue();
    fetchData(dayjs(date).startOf('day').format(), createdFrom);
  }, [fetchData, form]);

  // 添加订单编码的表头
  const customHeaders = useMemo(
    () => [
      i18n.t('sales_date'),
      i18n.t('order_sn'),
      i18n.t('sales_product_id'),
      i18n.t('sales_quantity_sold'),
      i18n.t('currency'),
      i18n.t('sales_sales_amount_(subtotal)'),
      i18n.t('purchase_price'),
      i18n.t('gross_profit'),
      i18n.t('sales_total'),
      i18n.t('sales_tax'),
      i18n.t('sales_payment_method'),
      i18n.t('product_source'),
      i18n.t('sales_responsible'),
      i18n.t('sales_notes'),
    ],
    []
  );
  const getSourceTypeText = (sourceType: number) => {
    const option = PRODUCT_SOURCE_TYPE_OPTION_LIST.find(
      (item) => item.value === sourceType
    );
    return option
      ? i18n.t(option.label.props.i18nKey)
      : i18n.t(LOCALS.procurement);
  };
  const formatProductsAndSource = useCallback(
    (products: Array<{ productId: number; sourceType: number }>) => () => {

      // 如果只有一个商品，只显示来源
      if (products.length === 1) {
        return getSourceTypeText(products[0].sourceType);
      }

      // 如果有多个商品，显示 "商品ID: 来源" 的格式
      return products
        .map(
          (item) => `${item.productId}: ${getSourceTypeText(item.sourceType)}`
        )
        .join(', ');
    },
    []
  );

  // 提取销售数据处理逻辑
  const getSalesData = useCallback(() => {
    if (
      !dailyData ||
      !dailyData.orderStatistics ||
      !dailyData?.orderStatistics?.orders
    )
      return [];

    return dailyData.orderStatistics.orders.map((d, i) => {
      const paymentMethod = columnsRender().salesPaymentMethod(
        d.paymentMethod,
        d
      );
      const createdBy = columnsRender().publicStaff(d.createdBy);
      const productIdsStr = d.productIds
        .map((item) => item.productId)
        .join(',');

      const sourceTypesStr = formatProductsAndSource(d.productIds);

      return [
        dayjs(d.date).format('YYYY-MM-DD'),
        d.orderSn,
        productIdsStr,
        d.salesQuantity,
        d.currency,
        `${thousands(d.payAmountActualCurrency)}`,
        `${thousands(d.totalCost)}`,
        `${thousands(d.grossProfit)}`,
        `${thousands(d.totalAmountActualCurrency)}`,
        `${thousands(d.taxAmount)}`,
        paymentMethod,
        sourceTypesStr(),
        createdBy,
        d.note,
      ];
    });
  }, [dailyData, columnsRender, formatProductsAndSource]);

  // 提取采购数据处理逻辑
  const getPurchaseData = useCallback(() => {
    if (!dailyData?.purchaseReport.records) return [];

    return dailyData.purchaseReport.records.map((d) => {
      const cate = columnsRender().purchaseCategoryId(d.categoryId);
      const owner = columnsRender().publicStaff(d.owner);
      return [
        dayjs(d.date).format('YYYY-MM-DD'),
        d.productId,
        d.purchaseQuantity,
        d.currency,
        `${thousands(d.costPrice)}`,
        '', // d.points,
        d.supplierId,
        cate,
        PaymentMethod.find((dd) => dd.value === d.paymentMethod)?.label,
        owner,
        d.remark,
      ];
    });
  }, [dailyData?.purchaseReport.records, columnsRender]);

  // 提取寄卖数据处理逻辑
  const getConsignmentData = useCallback(() => {
    if (!dailyData?.consignmentReport.records) return [];

    return dailyData.consignmentReport.records.map((d) => {
      const owner = columnsRender().publicStaff(d.owner);
      return [
        dayjs(d.date).format('YYYY-MM-DD'),
        d.productId,
        d.purchaseQuantity,
        d.consignor,
        d.currency,
        `${thousands(d.costPrice)}`,
        `${thousands(d.price)}`,
        '', //d.point
        d.publishStatus,
        PaymentMethod.find((dd) => dd.value === d.paymentMethod)?.label,
        owner,
        d.remark,
      ];
    });
  }, [dailyData?.consignmentReport.records, columnsRender]);

  const dlExcel = useCallback(() => {
    if (staffSelectOptions.length === 0 && dailyData?.orderStatistics?.orders)
      return;

    const salesSheet = {
      sheetName: i18n.t('sales_daily_report'),
      data: [
        customHeaders, // 表头
        ...getSalesData(),
      ],
    };

    const purchaseSheet = {
      sheetName: i18n.t('purchase_daily_report'),
      data: [
        purchaseColumns.map((d) => d.title?.toString()), // 表头
        ...getPurchaseData(),
        [], // 换两行
        [],
        ...(purchaseStats?.dataSource.map((d) => [d.name, d.value]) || []),
      ],
    };

    const consignmentSheet = {
      sheetName: i18n.t('consignment_daily_report'),
      data: [
        consignmentColumns.map((d) => d.title?.toString()), // 表头
        ...getConsignmentData(),
        [], // 换两行
        [],
        ...(consignmentStats?.dataSource.map((d) => [d.name, d.value]) || []),
      ],
    };

    const currentDate = form.getFieldValue('date') || dayjs();
    const dateStr = dayjs(currentDate).format('YYYYMMDD');
    const sheets = [salesSheet, purchaseSheet, consignmentSheet];

    exportToExcel(sheets, `${i18n.t('nikkei_table')}_${dateStr}.xlsx`);
  }, [
    staffSelectOptions.length,
    dailyData?.orderStatistics?.orders,
    customHeaders,
    getSalesData,
    purchaseColumns,
    getPurchaseData,
    purchaseStats?.dataSource,
    consignmentColumns,
    getConsignmentData,
    consignmentStats?.dataSource,
    form,
  ]);

  return (
    <div>
      <div className="w-full flex">
        <div className="">
          <Form
            form={form}
            layout={'inline'}
            onFinish={onFinish}
            initialValues={{ date: dayjs().startOf('day') }}
          >
            <Form.Item name="date" label={<Trans i18nKey={LOCALS.date} />}>
              <DatePicker />
            </Form.Item>
            <Form.Item
              name="createdFrom"
              label={<Trans i18nKey={LOCALS.order_source} />}
            >
              <Select
                style={{ minWidth: 150 }}
                placeholder={i18n.t(LOCALS.please_select)}
                options={ORDER_STATISTIC_OPTION_LIST}
                allowClear
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  <Trans i18nKey={LOCALS.search} />
                </Button>
                <Button
                  htmlType="button"
                  onClick={() => {
                    form.resetFields();
                    fetchData();
                  }}
                >
                  <Trans i18nKey={LOCALS.reset} />
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
        <div>
          <Button className="" onClick={() => dlExcel()}>
            {i18n.t('download_excel')}
          </Button>
        </div>
      </div>
      <div className="mb-8">
        <div className="flex">
          <div className="w-1/2 text-xl">{i18n.t('sales_daily_report')}</div>
        </div>

        <Table
          loading={loading}
          pagination={false}
          columns={salesColumns.filter((d) => !d.hidden)}
          dataSource={dailyData?.orderStatistics?.orders}
          rowKey={(_, index) => index || 0}
          scroll={{ x: 'max-content' }}
        ></Table>
        {salesStats?.ele}
      </div>
      <div className="mb-8">
        <div className="text-xl">{i18n.t('purchase_daily_report')}</div>
        <Table
          loading={loading}
          pagination={false}
          columns={purchaseColumns.filter((d) => !d.hidden)}
          dataSource={dailyData?.purchaseReport.records}
          rowKey={(_, index) => index || 0}
          scroll={{ x: 'max-content' }}
        ></Table>
        {purchaseStats?.ele}
      </div>
      <div className="mb-8">
        <div className="text-xl">{i18n.t('consignment_daily_report')}</div>
        <Table
          loading={loading}
          pagination={false}
          columns={consignmentColumns.filter((d) => !d.hidden)}
          dataSource={dailyData?.consignmentReport.records}
          rowKey={(_, index) => index || 0}
          scroll={{ x: 'max-content' }}
        ></Table>
        {consignmentStats?.ele}
      </div>
    </div>
  );
};

export default Statement;
