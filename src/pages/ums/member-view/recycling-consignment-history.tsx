import { OmsRecycleOrderDetail } from 'types/oms';
import { UmsMember } from 'types/ums';
import styles from './index.module.scss';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchOmsRecyclingList } from 'apis/oms';
import usePagination from 'commons/hooks/usePagination';
import { PageQuery, UnwrapPromise } from 'types/base';
import Table, { ColumnsType } from 'antd/es/table';
import showTotal from 'components/show-total';
import { Button, message, DatePicker, Input } from 'antd';
import {
  OrderType,
  ShopMaping,
  getRecycleOrderStatusText,
  AccessoriesMapping,
  OMS_RECYCLE_ORDER_STATUS_MAP,
  StatusListDefault,
} from 'constants/RecyclingConsignment';
import { useNavigate } from 'react-router-dom';
import i18n from '../../../i18n';
import LOCALS from '../../../commons/locals';
import MobileList from 'components/descriptions-mobile-list';
import type { ColumnsProps } from 'components/descriptions-mobile-list';
import {
  getDempyouProduct,
  getDempyouOrderInfo,
  getDempyouToPrint,
  ProductType,
  PrintParamType,
} from 'utils/getDempyouParam';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { getProductLabel } from 'utils/getProductLabel';
import dayjs from 'dayjs';
import classNames from 'classnames';
import findCascaderOptionById from 'utils/findCascaderOptionById';
import { thousands } from 'utils/tools';
import { Trans } from 'react-i18next';
import { getMemberByIdV2 } from 'apis/ums';

const RecyclingConsignmentHistory = ({
  memberId,
  member,
}: {
  memberId: UmsMember['id'];
  member: UnwrapPromise<ReturnType<typeof getMemberByIdV2>>;
}) => {
  const navigate = useNavigate();
  const isMobile = false;
  const [selectedRows, setSelectedRows] = useState<OmsRecycleOrderDetail[]>([]);
  const [submissionId, setSubmissionId] = useState<number | undefined>(
    undefined
  );
  const {
    staffSelectOptions,
    countryOptions,
    productCategoryCascaderOptions,
    colorSelectOptions,
    rankSelectOptions,
    stampSelectOptions,
    materialCascaderOptionsMap,
    hardwareSelectOptions,
    accessorySelectOptions,
  } = useAppSelector(selectGlobalInfo);

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

  const [beginCommitTime, setBeginCommitTime] = useState('');
  const [endCommitTime, setEndCommitTime] = useState('');

  const getDataSource = useCallback(
    async ({ pageNum, pageSize, status }: PageQuery & { status?: string }) => {
      try {
        setLoading(true);
        const {
          data: { list, total },
        } = await fetchOmsRecyclingList({
          memberId,
          pageNum,
          pageSize,
          status,
          beginCommitTime,
          endCommitTime,
          submissionId,
        });
        setDataSource(list);
        setTotal(total || 0);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [
      beginCommitTime,
      endCommitTime,
      memberId,
      setDataSource,
      setLoading,
      setTotal,
      submissionId,
    ]
  );

  useEffect(() => {
    getDataSource({ pageNum: 1, pageSize: 10 });
  }, [getDataSource]);

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
        productCategoryCascaderOptions
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
    ]
  );

  const getColumns = useCallback(() => {
    return [
      {
        title: i18n.t(LOCALS.code),
        key: 'code',
        dataIndex: 'code',
        width: 120,
        render: (_: OmsRecycleOrderDetail, record: OmsRecycleOrderDetail) => {
          if (!record) return;
          return (
            <Button
              type="link"
              onClick={() => {
                navigate(
                  `/rrs/recycling-consignment-detail/${record?.omsRecycleOrder?.id}`
                );
              }}
            >
              {record.omsRecycleOrder?.code}
            </Button>
          );
        },
      },
      {
        title: i18n.t(LOCALS.sHXnOEVSrC),
        key: 'submissionId',
        dataIndex: 'submissionId',
        width: 100,
        render: (_: OmsRecycleOrderDetail, record: OmsRecycleOrderDetail) => {
          if (!record) return;
          return record.omsRecycleOrder?.submissionId;
        },
      },
      {
        title: i18n.t(LOCALS.product_info),
        key: 'name',
        dataIndex: 'name',
        width: 200,
        render: (_: string, record: OmsRecycleOrderDetail) => {
          if (!record) return;
          return ProductShowData(record);
        },
      },
      {
        title: i18n.t(LOCALS.order_type),
        key: 'type',
        dataIndex: 'type',
        width: 150,
        render: (_: string, record: OmsRecycleOrderDetail) => {
          if (!record) return;
          let t = OrderType.find(
            (d) => record.omsRecycleOrder?.type === d.value
          );
          if (t) {
            return t.label;
          }
        },
      },
      {
        title: i18n.t(LOCALS.shop_id),
        dataIndex: 'shopid',
        width: 120,
        key: 'shopid',
        render: (_: string, record: OmsRecycleOrderDetail) => {
          if (!record) return;
          return ShopMaping[`${record.omsRecycleOrder?.storeId}`] || '-';
        },
      },
      {
        title: i18n.t(LOCALS.order_status),
        dataIndex: 'status',
        width: 120,
        key: 'status',
        filterMultiple: false,
        filters: StatusListDefault.map((d) => ({
          text: d.label,
          value: d.key,
        })),
        render: (_: string, record: OmsRecycleOrderDetail) => {
          if (!record) return;
          return <div>{getRecycleOrderStatusText(record.omsRecycleOrder)}</div>;
        },
      },
      {
        title: <Trans i18nKey={LOCALS.quoted_amount} />,
        dataIndex: 'price',
        key: 'price',
        width: 150,
        render: (_: string, record: OmsRecycleOrderDetail) => {
          if (!record) return;
          if (record.omsRecycleOrderItem) {
            const {
              finalRecyclePrice = '',
              finalSalePrice = '',
              maxRecyclePrice = '',
              maxSalePrice = '',
              minRecyclePrice = '',
              minSalePrice = '',
            } = record.omsRecycleOrderItem;
            const currency = record?.omsRecycleOrder?.currency;
            const { type, status } = record?.omsRecycleOrder || {};
            const finalRecyclePriceEle = (
              <>
                <div>{i18n.t(LOCALS.recycling_confirmation_quote)}</div>
                <div>
                  {finalRecyclePrice ? (
                    <>
                      {currency}&nbsp;
                      {thousands(finalRecyclePrice)}
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              </>
            );
            const finalSalePriceEle = (
              <>
                <div>{i18n.t(LOCALS.consignment_confirmation_quote)}</div>
                <div>
                  {finalSalePrice ? (
                    <>
                      {currency}&nbsp;
                      {thousands(finalSalePrice)}
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              </>
            );
            // 交易完成
            if (status === OMS_RECYCLE_ORDER_STATUS_MAP.COMPLETE) {
              return (
                <>
                  {type === 2 && finalRecyclePriceEle}
                  {type === 1 && finalSalePriceEle}
                </>
              );
            }
            // 最终
            if (finalRecyclePrice || finalSalePrice) {
              return (
                <div>
                  {finalRecyclePriceEle}
                  {finalSalePriceEle}
                </div>
              );
            }
            // 初步
            return (
              <div>
                <div>{i18n.t(LOCALS.instant_sale)}</div>
                {minRecyclePrice || maxRecyclePrice ? (
                  <div>
                    {currency}&nbsp;
                    {thousands(minRecyclePrice)}~{thousands(maxRecyclePrice)}
                  </div>
                ) : (
                  '-'
                )}
                <div>{i18n.t(LOCALS.consignment_preliminary_valuation)}</div>
                {minSalePrice || maxSalePrice ? (
                  <div>
                    {currency}&nbsp;
                    {thousands(minSalePrice)}~{thousands(maxSalePrice)}
                  </div>
                ) : (
                  '-'
                )}
              </div>
            );
          }
        },
      },
      {
        title: i18n.t(LOCALS.created_time),
        dataIndex: 'createTime',
        width: 200,
        key: 'createTime',
        render: (_: string, record: OmsRecycleOrderDetail) => {
          if (!record) return;
          return (
            <div>
              {dayjs(record.omsRecycleOrder?.createTime).format(
                'YYYY-MM-DD HH:mm'
              )}
            </div>
          );
        },
      },
    ];
  }, [ProductShowData, navigate]);

  const columns: ColumnsType<OmsRecycleOrderDetail> = useMemo(
    () => getColumns(),
    [getColumns]
  );

  const mobColumns: ColumnsProps<OmsRecycleOrderDetail> = useMemo(
    () => getColumns(),
    [getColumns]
  );

  const forwardReceipt = useCallback(async () => {
    const b = selectedRows.every(
      (d) => d.omsRecycleOrder?.type === selectedRows[0].omsRecycleOrder?.type
    );
    if (!b) {
      message.warning(i18n.t('consignment_orders_and'));
      return;
    }
    const prodList: ProductType[] = [];
    let orderInfo: PrintParamType | undefined = undefined;
    orderInfo = await getDempyouOrderInfo(selectedRows[0], {
      staffSelectOptions,
      countryOptions,
      idCertificate: member.idCertificate,
    });
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
        }
      );
      // 「商品名　尺寸　素材　色　刻印　金具」
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
  }, [
    accessorySelectOptions,
    colorSelectOptions,
    countryOptions,
    hardwareSelectOptions,
    materialCascaderOptionsMap,
    productCategoryCascaderOptions,
    rankSelectOptions,
    selectedRows,
    staffSelectOptions,
    stampSelectOptions,
  ]);

  return (
    <div>
      <div className={`${styles.title} flex justify-between`}>
        <div>{i18n.t(LOCALS.recycling_consignment_order_history)}</div>
        <div className="flex gap-2">
          <DatePicker.RangePicker
            style={{ width: 260 }}
            onChange={(value) => {
              if (value) {
                setBeginCommitTime(dayjs(value[0]).startOf('days').format());
                setEndCommitTime(dayjs(value[1]).endOf('days').format());
              } else if (value === null) {
                setBeginCommitTime('');
                setEndCommitTime('');
              }
            }}
          />
          <Input
            placeholder={i18n.t(LOCALS.sHXnOEVSrC) || ''}
            value={submissionId === undefined ? '' : String(submissionId)}
            onChange={(e) => {
              const value = e.target.value;
              // 处理空值或数值输入
              if (value === '') {
                setSubmissionId(undefined);
              } else if (/^\d+$/.test(value)) {
                setSubmissionId(Number(value));
              }
            }}
            style={{ width: 200 }}
            onPressEnter={() => getDataSource({ pageNum: 1, pageSize: 10 })}
          />
          <Button
            disabled={!selectedRows.length}
            onClick={() => forwardReceipt()}
          >
            {i18n.t('yYqvdvcMFh')}
          </Button>
        </div>
      </div>

      {isMobile ? (
        <MobileList
          columns={mobColumns}
          dataSource={dataSource}
          loading={loading}
          pagination={{
            simple: true,
            total,
            pageSize,
            current: pageNum,
            onChange: (page, pageSize) => {
              setPageNum(page);
              setPageSize(pageSize);
              getDataSource({ pageNum: page, pageSize });
            },
          }}
        />
      ) : (
        <Table
          size="small"
          bordered
          pagination={{
            showTotal,
            total,
            pageSize,
            current: pageNum,
          }}
          rowSelection={{
            selectedRowKeys: selectedRows.map(
              (d) => d.omsRecycleOrder?.code
            ) as React.Key[],
            onChange: (_, selectedRows) => setSelectedRows(selectedRows),
            getCheckboxProps: (record: OmsRecycleOrderDetail) => ({
              disabled: !record.omsRecycleOrderLogistics?.country,
            }),
          }}
          loading={loading}
          rowKey={(e) => e.omsRecycleOrder?.code || ''}
          style={{
            marginTop: 12,
          }}
          onChange={(pagination, filters, sorter, { action }) => {
            if (action === 'paginate') {
              setPageNum(pagination.current || 1);
              setPageSize(pageSize);
              getDataSource({ pageNum: pagination.current || 1, pageSize });
            }
            if (action === 'filter') {
              setPageNum(1);
              setPageSize(10);
              const status = String(filters.status);
              getDataSource({
                pageNum: 1,
                pageSize: 10,
                status: status === 'all' ? '' : status,
              });
            }
          }}
          dataSource={dataSource}
          columns={columns}
        />
      )}
    </div>
  );
};

export default RecyclingConsignmentHistory;
