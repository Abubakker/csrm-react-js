import React, { useState, useEffect, memo } from 'react';
import styles from './index.module.scss';
import dayjs from 'dayjs';
import { Button, Table, Tooltip } from 'antd';
import {
  storeIdMapingObject,
  statusMappingObject,
  handleTimezoneToStoreId,
} from 'constants/appointment-management';
import LOCALS from 'commons/locals';
import { OmsAppointmentRecordInfoVO } from 'types/oms';
import type { ColumnsType } from 'antd/es/table';
import { thousands } from 'utils/tools';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import findCascaderOptionById from 'utils/findCascaderOptionById';
import i18n from '../../../../../i18n';

interface Props {
  dataSource: OmsAppointmentRecordInfoVO[];
  total: number;
  pageSize: number;
  pageNum: number;
  setOpen: (
    b: boolean,
    rowData: OmsAppointmentRecordInfoVO,
    modalType: 'add' | 'viewDetail'
  ) => void;
  setPage: (page: number, pageSize: number) => void;
}

const TableList = ({
  dataSource,
  total,
  pageSize,
  pageNum,
  setOpen,
  setPage,
}: Props) => {
  const getColumns = (): ColumnsType<OmsAppointmentRecordInfoVO> => [
    {
      title: i18n.t(LOCALS.appointment_arrival_time),
      dataIndex: 'date',
      key: 'date',
      width: '10%',
      render: (_, record) => {
        const {
          beginTime,
          endTime,
          storeId = 0,
        } = record?.omsAppointmentStoreRecord || {};
        const [begin, end] = [
          handleTimezoneToStoreId(dayjs(beginTime), storeId),
          handleTimezoneToStoreId(dayjs(endTime), storeId),
        ];
        const date = begin.format('MM-DD');
        const between = `${begin.format('HH:mm')}~${end.format('HH:mm')}`;
        return (
          <div style={{ minWidth: 100 }}>
            <div>{date}</div>
            <div>{between}</div>
            <div>{storeIdMapingObject[storeId]}</div>
          </div>
        );
      },
    },
    {
      title: i18n.t(LOCALS.customer_info),
      dataIndex: 'info',
      key: 'info',
      width: '14%',
      render: (_, record) => {
        if (record.omsAppointmentStoreRecord) {
          const { omsAppointmentStoreRecord } = record;
          const { username, phone, email } = omsAppointmentStoreRecord || {};
          return (
            <div style={{ minWidth: 100 }}>
              <div>{username || '-'}</div>
              <div>{phone ? `+${phone}` : '-'}</div>
              <div>{email || '-'}</div>
            </div>
          );
        }
      },
    },
    {
      title: i18n.t(LOCALS.quantity_of_products) ,
      dataIndex: 'num',
      key: 'num',
      width: '6%',
      render: (_, record) => {
        if (record.omsAppointmentStoreRecord) {
          return (
            <div style={{ minWidth: 60 }}>
              {record.omsAppointmentStoreRecord?.productAmount}
            </div>
          );
        }
        return 0;
      },
    },
    {
      title: i18n.t(LOCALS.product),
      dataIndex: 'product',
      key: 'product',
      width: '30%',
      render: (_, record) => <RenderProduct record={record} />,
    },
    {
      title: i18n.t(LOCALS.initial_appraisal),
      dataIndex: 'price',
      key: 'price',
      width: '30%',
      render: (_, record) => {
        if (
          record.omsRecycleOrderInfoVOS &&
          record.omsRecycleOrderInfoVOS.length > 0
        ) {
          const priceList: string[][] = [];
          record.omsRecycleOrderInfoVOS.forEach((d) => {
            const priceRow = [];
            const { omsRecycleOrderItem, omsRecycleOrder } = d;
            const { currency } = omsRecycleOrder || {};
            const {
              maxRecyclePrice,
              maxSalePrice,
              minRecyclePrice,
              minSalePrice,
            } = omsRecycleOrderItem || {};
            if (minSalePrice && maxSalePrice) {
              priceRow.push(
                `${i18n.t(LOCALS.consignment)} ${currency} ${thousands(minSalePrice)}~${thousands(
                  maxSalePrice
                )}`
              );
            }
            if (minRecyclePrice && maxRecyclePrice) {
              priceRow.push(
                `${i18n.t(LOCALS.sell)} ${currency} ${thousands(minSalePrice)}~${thousands(
                  maxSalePrice
                )}`
              );
            }
            priceList.push(priceRow);
          });

          return (
            <div className={styles.priceWarp}>
              {priceList.map((d, i) => (
                <div key={i} className={styles.priceItems}>
                  {d.map((dd, ii) => (
                    <div key={ii}>{dd || '-'}</div>
                  ))}
                </div>
              ))}
            </div>
          );
        }
      },
    },
    {
      title: i18n.t(LOCALS.status),
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      fixed: 'right',
      render: (_, record) => {
        const status =
          statusMappingObject[record.omsAppointmentStoreRecord?.status || 0];
        return (
          <div className={styles.option}>
            <div>{status}</div>
            <div>
              <Button
                type="link"
                onClick={() => setOpen(true, record, 'viewDetail')}
              >
                {i18n.t(LOCALS.view)}
              </Button>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.TableList}>
      <Table
        columns={getColumns()}
        dataSource={dataSource}
        scroll={{ x: 'max-content', y: 'max-content' }}
        rowKey={(record) => record.omsAppointmentStoreRecord?.id || 0}
        // loading={loading}
        pagination={{
          total,
          pageSize,
          current: pageNum,
          showTotal: (total) => `${i18n.t(LOCALS.total)} ${total}`,
          onChange: (page, pageSize) => {
            setPage(page, pageSize);
          },
        }}
      />
    </div>
  );
};
export default TableList;

/** 渲染产品 */
const RenderProduct = memo(
  ({ record }: { record: OmsAppointmentRecordInfoVO }) => {
    const {
      productCategoryCascaderOptions,
      colorSelectOptions,
      rankSelectOptions,
      materialCascaderOptionsMap,
    } = useAppSelector(selectGlobalInfo);
    // 款+颜色+材质+成色
    const [prodList, setProdList] = useState<string[]>([]);
    const [firstImage, setFirstImage] = useState<string>();

    useEffect(() => {
      if (!record) return;
      if (Object.keys(productCategoryCascaderOptions).length === 0) return;
      if (Object.keys(materialCascaderOptionsMap).length === 0) return;
      const productList: string[] = [];
      let image: string = '';
      if (
        record.omsRecycleOrderInfoVOS &&
        record.omsRecycleOrderInfoVOS.length > 0
      ) {
        record.omsRecycleOrderInfoVOS.forEach((d, i) => {
          const { omsRecycleOrderProduct, omsRecycleOrderItem } = d;
          const productTitle = omsRecycleOrderItem?.productTitle || '';
          if (i === 0 && omsRecycleOrderProduct?.albumPics) {
            image = omsRecycleOrderProduct?.albumPics?.split(',')[0];
          }
          const {
            productCategoryId = 0,
            attrColor,
            rank,
            attrMaterial,
          } = omsRecycleOrderProduct || {};
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
          const productCategoryIds =
            target?.treeIds?.split(',')?.map(Number) || [];
          const mateList =
            materialCascaderOptionsMap[productCategoryIds[0]] || [];
          attrMaterial &&
            attrMaterial.split(',')?.forEach((d: string) => {
              const t = findCascaderOptionById(d, mateList);
              if (t) material.push(t.label);
            });
          // 组装  // 款+颜色+材质+成色
          let str = '';
          if (target) str += target?.label + ' ';
          if (color.length) str += color?.join(' ') + ' ';
          if (material.length) str += material?.join(' ') + ' ';
          if (rank)
            str += rankSelectOptions.find((d) => d.value === rank)?.label + ' ';
          productList.push(str || productTitle);
        });
        setProdList(productList);
      }
      if (record.omsAppointmentStoreRecord) {
        const { productPics, productTitle } = record.omsAppointmentStoreRecord;
        if (productPics) {
          const img: string[] = JSON.parse(productPics);
          if (img.length > 0 && !image) image = img[0];
        }
        if (productTitle) productList.push(productTitle);
      }
      setFirstImage(image);
      setProdList(productList);
    }, [
      record,
      productCategoryCascaderOptions,
      colorSelectOptions,
      rankSelectOptions,
      materialCascaderOptionsMap,
    ]);

    return (
      <div className={styles.productWarp}>
        {/* <div className={styles['imageWarp']}>
          {firstImage && <ImageSliceShow imgList={[firstImage]} />}
        </div> */}
        <div className={styles['textWarp']}>
          {prodList.map((d, i) => (
            <Tooltip title={d} key={i}>
              <div
                className={styles.productItems}
                style={
                  record.omsRecycleOrderInfoVOS?.length
                    ? {}
                    : { whiteSpace: 'pre' }
                }
              >
                {d || '-'}
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    );
  }
);
