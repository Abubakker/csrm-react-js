import React, { useState, memo, useEffect } from 'react';
import styles from './index.module.scss';
import { Button, Table, Tooltip } from 'antd';
import { Trans } from 'react-i18next';
import LOCALS from 'commons/locals';
import { OmsRecycleOrderDetail } from 'types/oms';
import { thousands } from 'utils/tools';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import findCascaderOptionById from 'utils/findCascaderOptionById';
import ImageSliceShow from 'components/image-slice-show';
import i18n from '../../../../../i18n';

interface Props {
  onChange?: (data: string[]) => void;
  dataSource?: OmsRecycleOrderDetail[];
  selectId?: string[];
}

const InputSelectTable = ({ dataSource, onChange, selectId }: Props) => {
  /** 选择key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  useEffect(() => {
    if (onChange) onChange(selectedRowKeys as string[]);
  }, [selectedRowKeys, onChange]);

  useEffect(() => {
    setSelectedRowKeys(selectId as React.Key[]);
  }, [selectId]);

  return (
    <div className={styles.InputSelectTable}>
      <Table
        columns={[
          {
            title: i18n.t(LOCALS.product_info),
            dataIndex: 'prod',
            key: 'prod',
            width: '50%',
            render: (_, record) => <RenderProduct record={record} />,
          },
          {
            title: <Trans i18nKey={LOCALS.order_sn} />,
            dataIndex: 'code',
            key: 'code',
            width: '10%',
            render: (_, record) => (
              <Button
                type="link"
                onClick={() =>
                  window.open(
                    `/rrs/recycling-consignment-detail/${record.omsRecycleOrder?.id}`
                  )
                }
              >
                {record.omsRecycleOrder?.code}
              </Button>
            ),
          },
          {
            title: i18n.t(LOCALS.note),
            dataIndex: 'firstValuationShopRemark',
            key: 'firstValuationShopRemark',
            width: '20%',
            render: (_, record) => (
              <div style={{ minWidth: 120 }}>
                {record?.omsRecycleOrderItem?.firstValuationShopRemark}
              </div>
            ),
          },
          {
            title: i18n.t(LOCALS.initial_appraisal),
            dataIndex: 'address',
            key: 'address',
            width: '20%',
            render: (_, record) => {
              if (record) {
                const currency = record?.omsRecycleOrder?.currency;
                const {
                  maxRecyclePrice,
                  minRecyclePrice,
                  maxSalePrice,
                  minSalePrice,
                } = record?.omsRecycleOrderItem || {};
                return (
                  <div style={{ minWidth: 250 }}>
                    {minSalePrice && (
                      <div>
                        {i18n.t(LOCALS.consignment_valuation)}：{currency}&nbsp;{thousands(minSalePrice)}~
                        {thousands(maxSalePrice)}
                      </div>
                    )}
                    {minRecyclePrice && (
                      <div>
                        {i18n.t(LOCALS.recycling_valuation)}：{currency}&nbsp;{thousands(minRecyclePrice)}~
                        {thousands(maxRecyclePrice)}
                      </div>
                    )}
                  </div>
                );
              }
            },
          },
        ]}
        dataSource={dataSource}
        rowSelection={
          selectId?.length === 0
            ? {
                selectedRowKeys,
                onChange: onSelectChange,
              }
            : undefined
        }
        scroll={{ x: 'max-content' }}
        rowKey={(record) => record.omsRecycleOrder?.id || 0}
        pagination={false}
        // loading={loading}
        // pagination={{
        //   total,
        //   pageSize,
        //   current: pageNum,
        //   showTotal: (total) => `总共 ${total} 条`,
        //   onChange: (page, pageSize) => {
        //     getLoad(page, pageSize);
        //   },
        // }}
      />
    </div>
  );
};
export default InputSelectTable;

const RenderProduct = memo(({ record }: { record: OmsRecycleOrderDetail }) => {
  const {
    productCategoryCascaderOptions,
    colorSelectOptions,
    rankSelectOptions,
    materialCascaderOptionsMap,
  } = useAppSelector(selectGlobalInfo);
  // 款+颜色+材质+成色
  const [prod, setProd] = useState<string>();
  const [firstImage, setFirstImage] = useState<string>();

  useEffect(() => {
    if (!record) return;
    if (Object.keys(productCategoryCascaderOptions).length === 0) return;
    if (Object.keys(materialCascaderOptionsMap).length === 0) return;
    if (Object.keys(record).length) {
      const { omsRecycleOrderProduct, omsRecycleOrderItem } = record;
      if (omsRecycleOrderProduct?.albumPics) {
        setFirstImage(omsRecycleOrderProduct?.albumPics?.split(',')[0]);
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
      const productCategoryIds = target?.treeIds?.split(',')?.map(Number) || [];
      const mateList = materialCascaderOptionsMap[productCategoryIds[0]] || [];
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
      const title = omsRecycleOrderItem?.productTitle;
      setProd(str || title);
    }
  }, [
    record,
    productCategoryCascaderOptions,
    colorSelectOptions,
    rankSelectOptions,
    materialCascaderOptionsMap,
  ]);

  return (
    <div className={styles.productWarp} style={{ minWidth: 200 }}>
      <div className={styles['imageWarp']}>
        {firstImage && <ImageSliceShow imgList={[firstImage]} />}
      </div>
      <div className={styles['textWarp']}>
        <Tooltip title={prod}>
          <div className={styles.productItems}>{prod || '-'}</div>
        </Tooltip>
      </div>
    </div>
  );
});
