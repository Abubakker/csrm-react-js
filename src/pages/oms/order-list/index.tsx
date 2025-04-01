import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  GetOrderListDto,
  GetOrderListV2Res,
  getOrderListV2,
  getOrderStatusStatistics,
} from 'apis/oms';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import {
  CURRENCY_OPTION_LIST,
  ORDER_CREATED_FROM_OPTION_LIST,
  ORDER_STATUS_ANTD_TAG_COLOR_MAP,
  ORDER_STATUS_MAP,
  OrderDeliveryTypeOptionList,
  PAY_STATUS_MAP,
  findLabelByValue,
  getOrderCreatedFromOptionList,
} from 'commons/options';
import LinkButton from 'components/link-button';
import showTotal from 'components/show-total';
import dayjs, { Dayjs } from 'dayjs';
import i18n from 'i18n';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { PageQuery } from 'types/base';
import formatTime from 'utils/formatTime';
import setQueryParameters from 'utils/setQueryParameters';
import queryString from 'query-string';
import classNames from 'classnames';
import { debounce } from 'lodash-es';
import { CURRENCY_ENUM } from 'types/pms';
import * as XLSX from 'xlsx';
import { OMS_ORDER_TAG_OPTION_LIST } from 'constant';
import { priceToWithoutTax } from 'utils/price-change';
import { financialManagementAccountList } from 'apis/fms';

const OrderList = () => {
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm<
    Omit<GetOrderListDto, 'createTime'> & {
      createTime: Dayjs[];
      statuses?: number[];
    }
  >();
  const navigate = useNavigate();
  const statusListFormValue = Form.useWatch('statuses', form);
  const createdFromsFormValue = Form.useWatch('createdFroms', form);

  const { orderTypeOptions } = useAppSelector(selectGlobalInfo);
  const [orderStatusStatistics, setOrderStatusStatistics] = useState<
    {
      count: string;
      status: number;
    }[]
  >([]);

  const debounceGetOrderStatusStatistics = useMemo(() => {
    return debounce((createdFroms?: number[]) => {
      getOrderStatusStatistics({ createdFroms }).then((res) => {
        setOrderStatusStatistics(res);
      });
    }, 300);
  }, []);

  useEffect(() => {
    debounceGetOrderStatusStatistics(createdFromsFormValue);
  }, [createdFromsFormValue, debounceGetOrderStatusStatistics]);

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
  } = usePagination<GetOrderListV2Res['list'][number]>();
  const { orderStatusOptions } = useAppSelector(selectGlobalInfo);

  const getDataSource = useCallback(
    async ({ pageNum, pageSize }: PageQuery) => {
      const { createTime, statuses, ...otherFormData } = form.getFieldsValue();
      let [start, end] = ['', ''];
      if (createTime) {
        [start, end] = [
          dayjs(createTime[0]).startOf('day').format(),
          dayjs(createTime[1]).endOf('day').format(),
        ];
      }
      const data = {
        ...otherFormData,
        start,
        end,
        statuses,
        pageNum,
        pageSize,
      };

      setQueryParameters(data);

      try {
        setLoading(true);
        const { list, total } = await getOrderListV2(data);
        setDataSource(list);
        setTotal(total);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [form, setDataSource, setLoading, setTotal]
  );

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);

    if (parsed.statuses) {
      // @ts-ignore
      parsed.statuses = parsed.statuses.split(',').map(Number);
    }

    if (parsed.createdFroms) {
      // @ts-ignore
      parsed.createdFroms = parsed.createdFroms.split(',').map((i) => {
        return +i;
      });
    }

    if (parsed.currencyList) {
      // @ts-ignore
      parsed.currencyList = parsed.currencyList.split(',');
    }

    if (parsed.tag) {
      // @ts-ignore
      parsed.tag = parsed.tag.split(',');
    }

    if (parsed.start && parsed.end) {
      // @ts-ignore
      parsed.createTime = [dayjs(parsed.start), dayjs(parsed.end)];
    }

    form.setFieldsValue(parsed);
    const pageNum = parsed.pageNum ? +parsed.pageNum : 1;
    const pageSize = parsed.pageSize ? +parsed.pageSize : 10;
    setPageNum(pageNum);
    setPageSize(pageSize);

    getDataSource({ pageNum, pageSize });
  }, [form, getDataSource, setPageNum, setPageSize]);

  const onFinish = async () => {
    setPageNum(1);
    getDataSource({ pageNum: 1, pageSize });
  };

  const onReset = () => {
    form.resetFields();
    onFinish();
  };

  const columns: ColumnsType<GetOrderListV2Res['list'][number]> =
    useMemo(() => {
      return [
        {
          title: <Trans i18nKey={LOCALS.dwawuQNUEi}></Trans>,
          dataIndex: 'id',
          key: 'id',
          width: 80,
          render: (id: GetOrderListV2Res['list'][number]['id']) => {
            return <LinkButton href={`/oms/order-view/${id}`}>{id}</LinkButton>;
          },
        },
        {
          title: <Trans i18nKey={LOCALS.order_sn}></Trans>,
          dataIndex: 'orderSn',
          key: 'orderSn',
          width: 140,
        },
        {
          title: <Trans i18nKey={LOCALS.product_pictures}></Trans>,
          key: 'product_pictures',
          width: 150,
          render: ({ orderItems }: GetOrderListV2Res['list'][number]) => {
            return (
              <div className="flex gap-2">
                {orderItems.map(({ productPic, productId }) => {
                  return (
                    <div key={productId} className="w-16 h-16">
                      {productPic ? (
                        <Image
                          src={productPic}
                          alt="product"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        '-'
                      )}
                    </div>
                  );
                })}
              </div>
            );
          },
        },
        {
          title: <Trans i18nKey={LOCALS.sales_product_id}></Trans>,
          dataIndex: 'orderItems',
          key: 'order-id-list',
          width: 100,
          render: (
            orderItems: GetOrderListV2Res['list'][number]['orderItems']
          ) => {
            return (
              <div>
                {orderItems.map(({ productId }) => {
                  const href = `/pms/product-view/${productId}`;
                  return (
                    <div key={productId}>
                      <a
                        href={href}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(href);
                        }}
                      >
                        {productId}
                      </a>
                    </div>
                  );
                })}
              </div>
            );
          },
        },
        {
          title: <Trans i18nKey={LOCALS.SYLYoWTeQq}></Trans>,
          dataIndex: 'orderItems',
          key: 'orderItems',
          width: 150,
          render: (
            orderItems: GetOrderListV2Res['list'][number]['orderItems']
          ) => {
            return (
              <div>
                {orderItems.map(({ product, productId }) => {
                  const href = `/pms/product-view/${productId}`;
                  return (
                    <div key={productId}>
                      <a
                        href={href}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(href);
                        }}
                      >
                        {product.description || '-'}
                      </a>
                    </div>
                  );
                })}
              </div>
            );
          },
        },
        {
          title: <Trans i18nKey={LOCALS.stock_place} />,
          key: 'stockPlace',
          width: 100,
          render: ({ orderItems }: GetOrderListV2Res['list'][number]) => {
            if (!orderItems.length) return '-';

            const currency = orderItems[0].actualCurrency || CURRENCY_ENUM.JPY;

            if (currency === CURRENCY_ENUM.JPY) {
              return <Trans i18nKey={LOCALS.japan} />;
            }

            if (currency === CURRENCY_ENUM.HKD) {
              return <Trans i18nKey={LOCALS.hongkong} />;
            }

            if (currency === CURRENCY_ENUM.SGD) {
              return <Trans i18nKey={LOCALS.singapore} />;
            }

            return '-';
          },
        },
        {
          title: <Trans i18nKey={LOCALS.email} />,
          key: 'memberUsername',
          width: 220,
          render: ({
            memberUsername,
            memberId,
          }: GetOrderListV2Res['list'][number]) => {
            if (!memberId) return '-';

            return (
              <LinkButton href={`/ums/member-view/${memberId}`}>
                {memberUsername}
              </LinkButton>
            );
          },
        },
        {
          title: <Trans i18nKey={LOCALS.order_type} />,
          dataIndex: 'orderType',
          key: 'orderType',
          width: 100,
          render: (
            orderType: GetOrderListV2Res['list'][number]['orderType']
          ) => {
            return findLabelByValue(orderType, orderTypeOptions);
          },
        },
        {
          title: <Trans i18nKey={LOCALS.pay_amount}></Trans>,
          key: 'payAmount',
          width: 150,
          render: ({
            payAmount,
            payAmountActualCurrency,
            orderItems: [{ actualCurrency }],
          }: GetOrderListV2Res['list'][number]) => {
            if (actualCurrency && payAmountActualCurrency !== null) {
              return `${actualCurrency} ${payAmountActualCurrency.toLocaleString()}`;
            }

            return `JPY ${payAmount.toLocaleString()}`;
          },
        },
        {
          title: <Trans i18nKey={LOCALS.created_from}></Trans>,
          dataIndex: 'createdFrom',
          key: 'createdFrom',
          width: 100,
          render: (
            createdFrom: GetOrderListV2Res['list'][number]['createdFrom']
          ) => {
            return findLabelByValue(
              createdFrom,
              ORDER_CREATED_FROM_OPTION_LIST
            );
          },
        },
        {
          title: <Trans i18nKey={LOCALS.vucsrXTzfQ}></Trans>,
          dataIndex: 'deliveryType',
          key: 'deliveryType',
          width: 100,
          render: (
            deliveryType: GetOrderListV2Res['list'][number]['deliveryType']
          ) => {
            return findLabelByValue(deliveryType, OrderDeliveryTypeOptionList);
          },
        },
        {
          title: <Trans i18nKey={LOCALS.khvsAbbLJs} />,
          key: 'tagList',
          width: 100,
          dataIndex: 'tagList',
          render: (tagList: GetOrderListV2Res['list'][number]['tagList']) => {
            if (!tagList || tagList.length === 0) return '-';

            return (
              <div className="flex flex-wrap gap-1">
                {tagList.map(({ tag, id }) => {
                  return (
                    <Tag
                      color={
                        OMS_ORDER_TAG_OPTION_LIST.find((i) => i.value === tag)
                          ?.color || ''
                      }
                      key={id}
                    >
                      {tag}
                    </Tag>
                  );
                })}
              </div>
            );
          },
        },
        {
          title: <Trans i18nKey={LOCALS.created_time}></Trans>,
          dataIndex: 'createTime',
          key: 'createTime',
          width: 170,
          render: (
            createTime: GetOrderListV2Res['list'][number]['createTime']
          ) => {
            return formatTime(createTime);
          },
        },
        {
          title: <Trans i18nKey={LOCALS.MultiplePayList}></Trans>,
          dataIndex: 'multiplePayStatus',
          width: 100,
          key: 'multiplePayStatus',
          render: (
            value: GetOrderListV2Res['list'][number]['multiplePayStatus']
          ) => {
            return value ? <Trans i18nKey={LOCALS.yes} /> : '-';
          },
        },
        {
          title: <Trans i18nKey={LOCALS.order_status}></Trans>,
          dataIndex: 'status',
          width: 120,
          key: 'status',
          fixed: 'right',
          render: (status: GetOrderListV2Res['list'][number]['status']) => {
            return (
              <Tag color={ORDER_STATUS_ANTD_TAG_COLOR_MAP[status]}>
                {findLabelByValue(status, orderStatusOptions)}
              </Tag>
            );
          },
        },
      ];
    }, [navigate, orderStatusOptions, orderTypeOptions]);

  return (
    <div>
      <Form form={form} layout={'inline'} onFinish={onFinish}>
        <Form.Item label={<Trans i18nKey={LOCALS.KaLvBciebv} />} name="orderSn">
          <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
        </Form.Item>

        <Form.Item
          label={<Trans i18nKey={LOCALS.jHkqqeaSOv} />}
          name="productSn"
        >
          <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
        </Form.Item>

        <Form.Item
          label={<Trans i18nKey={LOCALS.created_time} />}
          name="createTime"
        >
          <RangePicker />
        </Form.Item>

        <Form.Item
          label={<Trans i18nKey={LOCALS.currency} />}
          name="currencyList"
        >
          <Select
            mode="multiple"
            style={{ minWidth: 150 }}
            placeholder={i18n.t(LOCALS.please_select)}
            options={CURRENCY_OPTION_LIST}
          />
        </Form.Item>

        <Form.Item
          label={<Trans i18nKey={LOCALS.created_from} />}
          name="createdFroms"
        >
          {/* TODO: 不同店铺账号之间数据权限，只能查看自己店铺的订单 */}
          <Select
            mode="multiple"
            style={{ minWidth: 150 }}
            placeholder={i18n.t(LOCALS.please_select)}
            options={ORDER_CREATED_FROM_OPTION_LIST}
          />
        </Form.Item>

        <Form.Item name="statuses" initialValue={[]} hidden>
          <Select
            mode="multiple"
            allowClear
            style={{ width: 150 }}
            options={orderStatusOptions}
          />
        </Form.Item>

        <Form.Item
          label={<Trans i18nKey={LOCALS.vucsrXTzfQ}></Trans>}
          name="deliveryType"
        >
          <Select
            allowClear
            placeholder={i18n.t(LOCALS.please_select)}
            options={OrderDeliveryTypeOptionList}
            style={{ width: 150 }}
          />
        </Form.Item>

        <Form.Item
          label={<Trans i18nKey={LOCALS.khvsAbbLJs}></Trans>}
          name="tag"
        >
          <Select
            allowClear
            mode="multiple"
            placeholder={i18n.t(LOCALS.please_select)}
            options={OMS_ORDER_TAG_OPTION_LIST}
            style={{ width: 150 }}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              <Trans i18nKey={LOCALS.search} />
            </Button>

            <Button htmlType="button" onClick={onReset}>
              <Trans i18nKey={LOCALS.reset} />
            </Button>
          </Space>
        </Form.Item>
        <Form.Item>
          <Button
            disabled={total > 1000}
            onClick={async () => {
              const { createTime, statuses, ...otherFormData } =
                form.getFieldsValue();
              let [start, end] = ['', ''];
              if (createTime) {
                [start, end] = [
                  dayjs(createTime[0]).startOf('day').format(),
                  dayjs(createTime[1]).endOf('day').format(),
                ];
              }

              // 获取数据
              const { list } = await getOrderListV2({
                ...otherFormData,
                start,
                end,
                statuses,
                pageNum: 1,
                pageSize: 1000,
              });

              // 获取支付账户列表
              const paymentAccountList = await financialManagementAccountList();

              // 定义表头
              const headers = [
                '受注番号',
                '商品番号',
                i18n.t(LOCALS.SYLYoWTeQq),
                '買取金額',
                '店頭金額',
                '適用金額',
                // i18n.t(LOCALS.stock_place),
                i18n.t(LOCALS.email),
                '税込販売額',
                '税抜販売額',
                i18n.t(LOCALS.tax_amount),
                i18n.t(LOCALS.created_from),
                i18n.t(LOCALS.order_status),
                '受注日',
                '売却日',
              ];

              // 转换数据
              const mappedData = list.map(
                ({
                  id,
                  orderItems,
                  memberUsername,
                  payAmount,
                  payAmountActualCurrency,
                  createdFrom,
                  createTime,
                  paymentTime,
                  status,
                  totalTaxAmount,
                  orderPayList,
                }) => {
                  // 获取支付金额显示
                  let payAmountDisplay = `JPY ${payAmount.toLocaleString()}`;
                  if (
                    orderItems[0]?.actualCurrency &&
                    payAmountActualCurrency !== null
                  ) {
                    payAmountDisplay = `${
                      orderItems[0].actualCurrency
                    } ${payAmountActualCurrency.toLocaleString()}`;
                  }

                  let payAmountWithoutTax = payAmount - (totalTaxAmount || 0);
                  if (
                    orderItems[0]?.actualCurrency &&
                    payAmountActualCurrency !== null
                  ) {
                    payAmountWithoutTax =
                      payAmountActualCurrency - (totalTaxAmount || 0);
                  }

                  return {
                    受注番号: id,
                    商品番号: orderItems.map((i) => i.productId).join('\n'),
                    [i18n.t(LOCALS.SYLYoWTeQq)]: orderItems
                      .map((i) => {
                        return i.product.description;
                      })
                      .join('\n'),
                    買取金額: orderItems
                      .map((i) => {
                        const { costPrice } = i.product;

                        if (!costPrice) return '-';
                        return priceToWithoutTax(costPrice).toLocaleString(
                          'en-US'
                        );
                      })
                      .join('\n'),
                    店頭金額: orderItems
                      .map((i) =>
                        priceToWithoutTax(i.product.price).toLocaleString(
                          'en-US'
                        )
                      )
                      .join('\n'),
                    適用金額: orderPayList
                      .filter((i) => i.payStatus === PAY_STATUS_MAP.CONFIRMED)
                      .map((i) => {
                        return `${
                          paymentAccountList.find(
                            (d) => d.accountCode === i.payType
                          )?.accountName || i.payType
                        }（${i.payAmount.toLocaleString('en-US')}）`;
                      })
                      .join('\n'),
                    // TODO: 大阪店上线后，需要修改
                    // [i18n.t(LOCALS.stock_place)]:
                    //   orderItems[0]?.actualCurrency === CURRENCY_ENUM.JPY
                    //     ? i18n.t(LOCALS.japan)
                    //     : orderItems[0]?.actualCurrency === CURRENCY_ENUM.HKD
                    //     ? i18n.t(LOCALS.hongkong)
                    //     : orderItems[0]?.actualCurrency === CURRENCY_ENUM.SGD
                    //     ? i18n.t(LOCALS.singapore)
                    //     : '-',
                    [i18n.t(LOCALS.email)]: memberUsername || '',
                    // [i18n.t(LOCALS.order_type)]: findLabelByValue(
                    //   orderType,
                    //   orderTypeOptions
                    // ),
                    税込販売額: payAmountDisplay,
                    税抜販売額: `${
                      orderItems[0]?.actualCurrency || CURRENCY_ENUM.JPY
                    }  ${payAmountWithoutTax.toLocaleString('en-US')}`,
                    [i18n.t(LOCALS.created_from)]: findLabelByValue(
                      createdFrom,
                      getOrderCreatedFromOptionList(i18n)
                    ),
                    [i18n.t(LOCALS.order_status)]: findLabelByValue(
                      status,
                      orderStatusOptions
                    ),
                    [i18n.t(LOCALS.tax_amount)]:
                      totalTaxAmount?.toLocaleString('en-US') || '',
                    受注日: dayjs(createTime).format('YYYY-MM-DD'),
                    売却日: dayjs(paymentTime || createTime).format(
                      'YYYY-MM-DD'
                    ),
                  };
                }
              );

              // 创建工作表
              const worksheet = XLSX.utils.json_to_sheet(mappedData, {
                header: headers,
              });

              // 创建工作簿
              const workbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workbook, worksheet, 'order export');

              // 下载
              XLSX.writeFile(
                workbook,
                `注文リスト-${dayjs().format('YYYY-MM-DD')}.xlsx`
              );
            }}
          >
            {i18n.t('download_excel')}（{total}）
          </Button>
        </Form.Item>
      </Form>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          ORDER_STATUS_MAP.TO_BE_PAID,
          ORDER_STATUS_MAP.TO_BE_DELIVERED,
          ORDER_STATUS_MAP.DELIVERED,
          ORDER_STATUS_MAP.COMPLETED,
          ORDER_STATUS_MAP.REFUND_ORDER,
          ORDER_STATUS_MAP.CANCLED,
        ].map((status) => {
          const statusList = statusListFormValue || [];
          const isChecked = statusList.includes(status);

          return (
            <div
              key={status}
              className={classNames(
                'text-center py-2 cursor-pointer',
                isChecked ? 'bg-black text-white' : 'bg-gray-200'
              )}
              onClick={() => {
                if (isChecked) {
                  // 移除选中状态
                  form.setFieldValue(
                    'statuses',
                    statusList.filter((s) => s !== status)
                  );
                } else {
                  // 添加新状态
                  form.setFieldValue('statuses', [...statusList, status]);
                }
                onFinish();
              }}
            >
              {findLabelByValue(status, orderStatusOptions)}（
              {orderStatusStatistics.find((i) => i.status === status)?.count ||
                0}
              ）
            </div>
          );
        })}
      </div>

      <Table
        bordered
        tableLayout="fixed"
        pagination={{
          showTotal,
          total,
          pageSize,
          current: pageNum,
          onChange: (page, pageSize) => {
            setPageNum(page);
            setPageSize(pageSize);
            getDataSource({ pageNum: page, pageSize });
          },
        }}
        loading={loading}
        rowKey={'id'}
        style={{
          marginTop: 12,
        }}
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
};

export default OrderList;
