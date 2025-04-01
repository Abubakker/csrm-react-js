import {
  Button,
  Cascader,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Table,
  DatePicker,
  message,
  Modal,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  getProductListNew,
  getProductPriceComparison,
  PmsProductEs,
  publishProduct,
  syncProductToEs,
  unPublishProduct,
  updateStockStatus,
  deleteProduct,
} from 'apis/pms';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import {
  PRODUCT_SOURCE_TYPE_OPTION_LIST,
  PROMOTION_TYPE_MAP,
  PUBLISH_STATUS_OPTION_LIST,
  STOCK_PLACE_OPTION_LIST,
  findLabelByValue,
  CURRENCY_MAP,
  CURRENCY_MAP_TO_SHOP,
  PMS_PRODUCT_STOCK_STATUS_OPTION_LIST,
  PMS_PRODUCT_STOCK_STATUS,
} from 'commons/options';
import dayjs, { Dayjs } from 'dayjs';
import i18n from 'i18n';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { PageQuery, UnwrapPromise } from 'types/base';
import { PmsProduct, PriceTagInfo } from 'types/pms';
import formatTime from 'utils/formatTime';
import setQueryParameters from 'utils/setQueryParameters';
import ImageSliceShow from 'components/image-slice-show';
import classNames from 'classnames';
import findCascaderOptionById from 'utils/findCascaderOptionById';
import useResource from 'commons/hooks/useResource';
import getCascaderFilter from 'utils/getCascaderFilter';
import ProductStockStatusHistory from './product-stock-status-history';
import LinkButton from 'components/link-button';
import { useToggle } from 'react-use';
import { selectUserInfo } from 'store/slices/userInfoSlice';
import isProductMatchShop from 'utils/is-product-match-shop';
import getUpdateProductStockStatusOptions from 'utils/get-update-product-stock-status-options';
import CopyButton from 'components/copy-button';
import { CONSUMPTION_TAX_RATE } from '../../constant';
import * as XLSX from 'xlsx';
import { priceToWithoutTax } from 'utils/price-change';

const { RangePicker } = DatePicker;

type SearchFormData = {
  productCategoryIds?: number[];
  keyword?: string;
  stockPlace?: string;
  isFilterPromotion?: boolean;
  stockStatus?: PMS_PRODUCT_STOCK_STATUS[];
  publishStatus?: number;
  supportCrypto: boolean;
  createTime: Dayjs[];
  soldTime: Dayjs[];
  rankList?: string[];
  sourceTypeList?: number[];
  isHavePic?: boolean;
};

const BATCH_OPTION_TYPE = {
  BATCH_PRINT: 'BATCH_PRINT', // 批量打印价签
  BATCH_PRINT_LABEL: 'BATCH_PRINT_LABEL', // 批量打印
  BATCH_STOCK: 'BATCH_STOCK', // 批量入库
  BATCH_FOR_SALE: 'BATCH_FOR_SALE', // 批量售卖
  BATCH_PUBLISH: 'BATCH_PUBLISH', // 批量上架网站
  BATCH_UN_PUBLISH: 'BATCH_UN_PUBLISH', // 批量下架网站
  BATCH_CHECK_OUT: 'BATCH_CHECK_OUT', // 批量收银台
  BATCH_SOLD_OUT: 'BATCH_SOLD_OUT', // 批量卖出
  BATCH_LENT_OUT: 'BATCH_LENT_OUT', // 批量借出
};

const ProductList = () => {
  const [form] = Form.useForm<SearchFormData>();
  const stockStatusFormValue = Form.useWatch('stockStatus', form);
  const {
    productCategoryCascaderOptions,
    colorSelectOptions,
    materialCascaderOptionsMap,
    hardwareSelectOptions,
    rankSelectOptions,
    stampSelectOptions,
  } = useAppSelector(selectGlobalInfo);
  const userInfo = useAppSelector(selectUserInfo);
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
  } = usePagination<
    PmsProductEs & {
      colorText: string;
      materialText: string;
      hardwareText: string;
      stampText: string;
    }
  >();
  const [selectedRows, setSelectedRows] = useState<PmsProductEs[]>([]);
  const viewPrint = useResource('product-list-view-print');
  const isProductForSaleToSold = useResource('product-for-sale-to-sold');
  // 添加删除权限控制
  const canDeleteProduct = useResource('product-delete');
  const [updateStockStatusData, setUpdateStockStatus] = useState<{
    productIdList: number[];
    newStockStatus: PMS_PRODUCT_STOCK_STATUS;
    note?: string;
  }>();

  const [productStockStatusStatistics, setProductStockStatusStatistics] =
    useState<
      UnwrapPromise<ReturnType<typeof getProductListNew>>['statisticsResult']
    >([]);

  const [viewStockStatusProductId, setViewStockStatusProductId] = useState(0);

  const searchProductList = useCallback(
    async ({
      pageNum,
      pageSize,
      setQuery,
    }: PageQuery & {
      setQuery: boolean;
    }) => {
      const {
        productCategoryIds,
        keyword,
        publishStatus,
        stockPlace,
        isFilterPromotion,
        supportCrypto,
        createTime,
        stockStatus,
        rankList,
        sourceTypeList,
        soldTime,
        isHavePic,
      } = form.getFieldsValue();

      let [start, end] = ['', ''];
      if (createTime) {
        [start, end] = [
          dayjs(createTime[0]).startOf('day').format(),
          dayjs(createTime[1]).endOf('day').format(),
        ];
      }

      let [soldStart, soldEnd] = ['', ''];
      if (soldTime) {
        [soldStart, soldEnd] = [
          dayjs(soldTime[0]).startOf('day').format(),
          dayjs(soldTime[1]).endOf('day').format(),
        ];
      }

      setQuery &&
        setQueryParameters({
          pageNum,
          pageSize,
          keyword,
          stockPlace,
          isFilterPromotion,
          publishStatus,
          productCategoryIds,
          supportCrypto,
          start,
          end,
          stockStatus,
          rankList,
          sourceTypeList,
          soldStart,
          soldEnd,
          isHavePic,
        });

      const { total, list, statisticsResult } = await getProductListNew({
        pageNum,
        pageSize,
        keyword,
        stockPlace,
        isFilterPromotion,
        publishStatus,
        productCategoryId: productCategoryIds
          ? productCategoryIds[productCategoryIds.length - 1]
          : undefined,
        start,
        end,
        stockStatuses: stockStatus,
        rankList,
        sourceTypeList,
        soldStart,
        soldEnd,
        isHavePic,
      });

      setProductStockStatusStatistics(statisticsResult);

      return {
        total,
        list: list.map((i) => {
          // color
          const colorTextList: string[] = [];
          i.colors &&
            i.colors.split(',')?.forEach((d: string) => {
              const t = colorSelectOptions.find((dd) => dd.value === d);
              if (t) colorTextList.push(t.label);
            });

          // material
          const materialTextList: string[] = [];
          const target = findCascaderOptionById(
            i.productCategoryId,
            productCategoryCascaderOptions
          );
          const productCategoryIds =
            target?.treeIds?.split(',')?.map(Number) || [];
          const mateList =
            materialCascaderOptionsMap[productCategoryIds[0]] || [];
          i.materialStr &&
            i.materialStr
              .split(',')
              .filter(Boolean)
              .forEach((d: string) => {
                const t = findCascaderOptionById(d, mateList);
                if (t) materialTextList.push(t.label);
              });

          // hardware
          const hardwareTextList: string[] = [];
          i.hardware &&
            i.hardware.forEach((value) => {
              const t = hardwareSelectOptions.find((dd) => dd.value === value);
              if (t && t.value !== 'none') hardwareTextList.push(t.label || '');
            });

          // stamp
          const stampText =
            stampSelectOptions.find(
              (d) => d.value === i.stamp && d.value !== 'none'
            )?.label || '';

          return {
            ...i,
            colorText: colorTextList.toString(),
            materialText: materialTextList.toString(),
            hardwareText: hardwareTextList.toString(),
            stampText,
          };
        }),
      };
    },
    [
      colorSelectOptions,
      form,
      hardwareSelectOptions,
      materialCascaderOptionsMap,
      productCategoryCascaderOptions,
      stampSelectOptions,
    ]
  );

  const getDataSource = useCallback(
    async ({ pageNum, pageSize }: PageQuery) => {
      try {
        setLoading(true);

        const { total, list } = await searchProductList({
          pageNum,
          pageSize,
          setQuery: true,
        });

        setDataSource(list);
        setTotal(total);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [searchProductList, setDataSource, setLoading, setTotal]
  );

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);

    if (parsed.isFilterPromotion && parsed.isFilterPromotion === 'true') {
      // @ts-ignore
      parsed.isFilterPromotion = true;
    } else {
      // @ts-ignore
      parsed.isFilterPromotion = false;
    }

    if (parsed.isHavePic && parsed.isHavePic === 'true') {
      // @ts-ignore
      parsed.isHavePic = true;
    } else if (parsed.isHavePic && parsed.isHavePic === 'false') {
      // @ts-ignore
      parsed.isHavePic = false;
    }

    // @ts-ignore
    parsed.publishStatus = parsed.publishStatus
      ? Number(parsed.publishStatus)
      : '';
    // @ts-ignore
    parsed.stockPlace = parsed.stockPlace || '';
    // @ts-ignore
    if (parsed.start && parsed.end) {
      // @ts-ignore
      parsed.createTime = [dayjs(parsed.start), dayjs(parsed.end)];
    }
    // @ts-ignore
    if (parsed.soldStart && parsed.soldEnd) {
      // @ts-ignore
      parsed.soldTime = [dayjs(parsed.soldStart), dayjs(parsed.soldEnd)];
    }

    if (parsed.productCategoryIds) {
      parsed.productCategoryIds = parsed.productCategoryIds
        // @ts-ignore
        .split(',')
        // @ts-ignore
        .map((i) => +i);
    }

    if (parsed.stockStatus) {
      parsed.stockStatus = parsed.stockStatus
        // @ts-ignore
        .split(',');
    }

    if (parsed.rankList) {
      parsed.rankList = parsed.rankList
        // @ts-ignore
        .split(',');
    }

    if (parsed.sourceTypeList) {
      parsed.sourceTypeList = parsed.sourceTypeList
        // @ts-ignore
        .split(',')
        .map(Number);
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

  const onEdit = useCallback((id: PmsProduct['id']) => {
    // 为改变url 触发 beforeunload
    window.location.href = `/pms/product-edit/${id}`;
  }, []);

  // 添加删除商品的函数
  const handleDelete = useCallback(
    async (id: number) => {
      Modal.confirm({
        title: i18n.t('XQTIAmaivc'),
        content: i18n.t('iIJPjfkyBr'),
        okText: i18n.t('confirm'),
        okType: 'danger',
        cancelText: i18n.t('cancel'),
        onOk: async () => {
          try {
            await deleteProduct(id);
            message.success(i18n.t('KJNCWPDiRG'));
            // 刷新当前页面数据
            getDataSource({ pageNum, pageSize });
          } catch (error) {
            message.error(i18n.t('pTYrCpwbRm'));
          }
        },
      });
    },
    [getDataSource, pageNum, pageSize]
  );

  const handlePublishStatusChange = useCallback(
    async (checked: boolean, id: PmsProduct['id']) => {
      if (checked) {
        await publishProduct([id]);
      } else {
        await unPublishProduct([id]);
      }

      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    []
  );

  /** 跳转打印 */
  const handleForwardPrint = useCallback(
    (data: PmsProductEs[]) => {
      if (data.length > 24) {
        message.warning(i18n.t('supports_up_to_18_items'));
        return;
      }
      const newData: PriceTagInfo[] = [];
      data.forEach((d) => {
        const {
          id,
          name,
          productCategoryId,
          productSn,
          costPrice,
          price,
          sourceType,
          colors: attrColor,
          hardware: attrHardware,
          materialStr,
          rank,
          stamp: attrStamp,
          currency,
          createdTime,
          brandName,
          referencePrice,
        } = d;
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

        materialStr &&
          materialStr
            .split(',')
            .filter(Boolean)
            .forEach((d: string) => {
              const t = findCascaderOptionById(d, mateList);
              if (t) material.push(t.label);
            });

        //
        const rankStr = rankSelectOptions.find((d) => d.value === rank)?.label;
        //
        const stampStr =
          stampSelectOptions.find(
            (d) => d.value === attrStamp && d.value !== 'none'
          )?.label || '';
        //
        const hardware: string[] = [];
        attrHardware &&
          attrHardware.forEach((value) => {
            const t = hardwareSelectOptions.find((dd) => dd.value === value);
            if (t && t.value !== 'none') hardware.push(t.label);
          });
        newData.push({
          id: `${id}`,
          name,
          productCategoryId: `${productCategoryId}`,
          productSn,
          price,
          costPrice: Number(costPrice) || 0,
          sourceType,
          color: color.toString(),
          material: material.toString(),
          hardware: hardware.toString(),
          rank: rankStr,
          shopId: CURRENCY_MAP_TO_SHOP[currency as 'JPY' | 'HKD' | 'SGD'],
          stamp: stampStr,
          createTime: createdTime,
          brandName,
          referencePrice,
          currency,
        });
      });

      // 填充数据
      const arrayFill = Array.from({ length: 24 }, (_, i) => {
        if (newData[i]) {
          return { ...newData[i] };
        } else {
          return { id: i };
        }
      });

      localStorage.setItem('price-tag', JSON.stringify(arrayFill));
      window.open('/prints/price-tag');
    },
    [
      productCategoryCascaderOptions,
      materialCascaderOptionsMap,
      rankSelectOptions,
      stampSelectOptions,
      colorSelectOptions,
      hardwareSelectOptions,
    ]
  );

  const handleForwardPrintLabel = useCallback(
    (data: PmsProductEs[]) => {
      if (data.length > 9) {
        message.warning(i18n.t('supports_up_to_n_items', { count: 9 }));
        return;
      }
      const newData: PriceTagInfo[] = [];
      data.forEach((d) => {
        const {
          id,
          productCategoryId,
          productSn,
          costPrice,
          price,
          colors: attrColor,
          hardware: attrHardware,
          materialStr,
          rank,
          stamp: attrStamp,
          currency,
          brandName,
          referencePrice,
        } = d;
        // color
        const color: string[] = [];
        attrColor &&
          attrColor.split(',')?.forEach((d: string) => {
            const t = colorSelectOptions.find((dd) => dd.value === d);
            if (t) color.push(t.labelEn || '');
          });

        const target = findCascaderOptionById(
          productCategoryId,
          productCategoryCascaderOptions
        );
        const productCategoryIds =
          target?.treeIds?.split(',')?.map(Number) || [];
        const mateList =
          materialCascaderOptionsMap[productCategoryIds[0]] || [];

        // material
        const material: string[] = [];
        materialStr &&
          materialStr
            .split(',')
            .filter(Boolean)
            .forEach((d: string) => {
              const t = findCascaderOptionById(d, mateList);
              if (t) material.push(t.labelEn || '');
            });

        const stampStr =
          stampSelectOptions.find((d) => d.value === attrStamp)?.labelEn || '';

        const hardware: string[] = [];
        attrHardware &&
          attrHardware.forEach((value) => {
            const t = hardwareSelectOptions.find((dd) => dd.value === value);
            if (t) hardware.push(t.labelEn || '');
          });
        newData.push({
          id: `${id}`,
          name: target?.nameEn,
          productCategoryId: `${productCategoryId}`,
          productSn,
          price,
          costPrice: Number(costPrice) || 0,
          color: color.toString(),
          material: material.toString(),
          hardware: hardware.toString(),
          rank,
          shopId: CURRENCY_MAP_TO_SHOP[currency as 'JPY' | 'HKD' | 'SGD'],
          stamp: stampStr,
          brandName,
          referencePrice,
          currency,
        });
      });

      localStorage.setItem('price-label', JSON.stringify(newData));
      window.open('/prints/price-label');
    },
    [
      productCategoryCascaderOptions,
      materialCascaderOptionsMap,
      stampSelectOptions,
      colorSelectOptions,
      hardwareSelectOptions,
    ]
  );

  const columns: ColumnsType<PmsProductEs> = useMemo(() => {
    const columnList1: ColumnsType<PmsProductEs> = [
      {
        title: <Trans i18nKey={LOCALS.product_sn}></Trans>,
        key: 'productSn',
        render: ({ id, description }: PmsProductEs) => {
          return (
            <>
              <span
                className="text-[#69b1ff] cursor-pointer"
                onClick={() => {
                  const host = window.location.host;
                  if (host === 'admin-shop.ginzaxiaoma.com') {
                    window.open(`//ginzaxiaoma.com/product/${id}`);
                  } else {
                    window.open(`//test-shop.ginzaxiaoma.com/product/${id}`);
                  }
                }}
              >
                {id}
              </span>
              {description && (
                <CopyButton copyText={description}>{description}</CopyButton>
              )}
            </>
          );
        },
      },
      {
        dataIndex: 'albumPics',
        key: 'albumPics',
        title: <Trans i18nKey={LOCALS.product_pictures} />,
        align: 'center',
        render: (albumPics: string) => {
          if (!albumPics) return <span>-</span>;
          let picList: string[] = albumPics.split(',');
          return (
            <ImageSliceShow
              imgList={picList}
              endSliceNumber={1}
              style={{ marginRight: 0 }}
            />
          );
        },
      },
      {
        dataIndex: 'name',
        key: 'name',
        width: 250,
        title: <Trans i18nKey={LOCALS.product_name} />,
        render: (name: string, product: PmsProductEs) => {
          const color: string[] = [];
          product.colors &&
            product.colors.split(',')?.forEach((d: string) => {
              const t = colorSelectOptions.find((dd) => dd.value === d);
              if (t) color.push(t.label);
            });

          // material
          const material: string[] = [];
          const target = findCascaderOptionById(
            product.productCategoryId,
            productCategoryCascaderOptions
          );
          const productCategoryIds =
            target?.treeIds?.split(',')?.map(Number) || [];
          const mateList =
            materialCascaderOptionsMap[productCategoryIds[0]] || [];

          product.materialStr &&
            product.materialStr
              .split(',')
              .filter(Boolean)
              .forEach((d: string) => {
                const t = findCascaderOptionById(d, mateList);
                if (t) material.push(t.label);
              });

          const hardware: string[] = [];
          product.hardware &&
            product.hardware.forEach((value) => {
              const t = hardwareSelectOptions.find((dd) => dd.value === value);
              if (t && t.value !== 'none') hardware.push(t.label || '');
            });

          // stamp
          const stampStr =
            stampSelectOptions.find(
              (d) => d.value === product.stamp && d.value !== 'none'
            )?.label || '';

          const { rank } = product;

          // TODO: 优化
          return (
            <div>
              <div>{name}</div>
              {
                <div>
                  <Trans i18nKey={LOCALS.rank} />：
                  {rankSelectOptions.find((i) => i.value === rank)?.label}
                </div>
              }
              {!!color.length && (
                <div>
                  <Trans i18nKey={LOCALS.color} />：{color.toString()}
                </div>
              )}
              {!!material.length && (
                <div>
                  <Trans i18nKey={LOCALS.material} />：{material.toString()}
                </div>
              )}
              {!!hardware.length && (
                <div>
                  <Trans i18nKey={LOCALS.hardware} />：{hardware.toString()}
                </div>
              )}
              {!!stampStr && (
                <div>
                  <Trans i18nKey={LOCALS.stamp} />：{stampStr}
                </div>
              )}
            </div>
          );
        },
      },
      {
        key: 'stockStatus',
        dataIndex: 'stockStatus',
        title: i18n.t(LOCALS.uMihwkqqts),
        width: 190,
        render: (
          stockStatus: PmsProductEs['stockStatus'],
          { id }: PmsProductEs
        ) => {
          const options = getUpdateProductStockStatusOptions({
            initStockStatus: stockStatus,
            isProductForSaleToSold,
          });

          return (
            <div className="flex items-center">
              <Select
                className="w-28"
                size="small"
                value={stockStatus}
                options={options}
                onChange={(e) => {
                  setUpdateStockStatus({
                    productIdList: [id],
                    newStockStatus: e,
                  });
                }}
              />
              <Button
                type="link"
                onClick={() => {
                  setViewStockStatusProductId(id);
                }}
              >
                {i18n.t(LOCALS.view)}
              </Button>
            </div>
          );
        },
      },
    ];

    const columnList2: ColumnsType<PmsProductEs> = [
      {
        key: 'sourceType',
        dataIndex: 'sourceType',
        title: <Trans i18nKey={LOCALS.product_source} />,
        render: (sourceType: PmsProductEs['sourceType']) => {
          return findLabelByValue(sourceType, PRODUCT_SOURCE_TYPE_OPTION_LIST);
        },
      },
      {
        key: 'price',
        title: <Trans i18nKey={LOCALS.price} />,
        render: (product: PmsProductEs) => {
          const { promotionType, priceJpy, currency } = product;

          const costPriceEle = product?.costPrice ? (
            <div>
              {i18n.t('purchase_price')}: {currency}{' '}
              {product.costPrice.toLocaleString()}
            </div>
          ) : null;

          // 只判断币种是否为日元，然后显示免税价格
          const taxFreePriceElement =
            currency === CURRENCY_MAP.JPY ? (
              <div>
                {i18n.t('czbRYWhFdZ')}：{currency}{' '}
                {priceToWithoutTax(product.price).toLocaleString()}
              </div>
            ) : null;

          return (
            <>
              <div>
                {i18n.t('selling_price')}:{' '}
                <span
                  style={
                    promotionType === PROMOTION_TYPE_MAP.SPECIAL
                      ? {
                          color: 'var(--color-danger)',
                        }
                      : undefined
                  }
                >
                  {currency} {product.price?.toLocaleString() || '-'}
                </span>
              </div>
              {taxFreePriceElement}
              {currency !== CURRENCY_MAP.JPY && (
                <div>
                  {i18n.t('convert_to_jpy')}: JPY{' '}
                  {priceJpy.toLocaleString() || '-'}
                </div>
              )}

              {costPriceEle}
            </>
          );
        },
      },
      {
        dataIndex: 'stockPlace',
        key: 'stockPlace',
        width: 120,
        title: <Trans i18nKey={LOCALS.stock_place} />,
        render: (stockPlace: PmsProductEs['stockPlace']) => {
          return findLabelByValue(stockPlace, STOCK_PLACE_OPTION_LIST);
        },
      },
      {
        key: 'recycleOrder',
        title: i18n.t(LOCALS.ZQDTJFXciM),
        width: 150,
        render: ({ recycleOrderId, recycleOrderCode }: PmsProductEs) => {
          if (!recycleOrderId) {
            return '-';
          }

          return (
            <LinkButton
              href={`/rrs/recycling-consignment-detail/${recycleOrderId}`}
            >
              {recycleOrderCode || recycleOrderId}
            </LinkButton>
          );
        },
      },
      {
        dataIndex: 'createdTime',
        key: 'createdTime',
        width: 170,
        title: <Trans i18nKey={LOCALS.created_time} />,
        render: (createdTime: PmsProduct['createdTime']) => {
          return <div>{formatTime(createdTime)}</div>;
        },
      },
      // {
      //   dataIndex: 'entryTime',
      //   key: 'entryTime',
      //   width: 170,
      //   title: i18n.t(LOCALS.juusvCbRWo),
      //   render: (entryTime: PmsProduct['entryTime']) => {
      //     return <div>{formatTime(entryTime)}</div>;
      //   },
      // },
    ];

    const publishStatusColumn: ColumnsType<PmsProductEs>[number] = {
      key: 'publishStatus',
      title: <Trans i18nKey={LOCALS.publish_status} />,
      render: (_: any, { publishStatus, id }: PmsProductEs) => {
        return (
          <div className="mb-2 text-center">
            <Switch
              checked={publishStatus === 1}
              onChange={(checked) => {
                handlePublishStatusChange(checked, id);
              }}
            />
          </div>
        );
      },
    };

    const soldInfoColumn: ColumnsType<PmsProductEs>[number] = {
      title: i18n.t(LOCALS.bxYXkMWIQe),
      key: 'soldInfo',
      width: 170,
      render({ soldTime, orderId }: PmsProductEs) {
        if (!orderId) {
          return '-';
        }

        return (
          <div>
            <LinkButton href={`/oms/order-view/${orderId}`}>
              {orderId}
            </LinkButton>
            <br />
            {formatTime(soldTime)}
          </div>
        );
      },
    };

    const optionColumn: ColumnsType<PmsProductEs>[number] = {
      key: 'options',
      title: <Trans i18nKey={LOCALS.option} />,
      fixed: 'right',
      render: ({ id }: PmsProductEs, record) => {
        // 判断商品是否可删除 - 增加权限判断
        const canDelete =
          canDeleteProduct && // 增加权限判断
          record.stockStatus !== PMS_PRODUCT_STOCK_STATUS.SOLD &&
          record.stockStatus !== PMS_PRODUCT_STOCK_STATUS.RESERVED;
        return (
          <div className="grid">
            <Button
              type="link"
              onClick={() => {
                onEdit(id);
              }}
            >
              <Trans i18nKey={LOCALS.edit} />
            </Button>

            {viewPrint && (
              <Button type="link" onClick={() => handleForwardPrint([record])}>
                <Trans i18nKey={LOCALS.cDYPiRpTxM} />
              </Button>
            )}

            {userInfo.username === 'admin' && (
              <Button
                type="link"
                onClick={async () => {
                  await syncProductToEs([id]);
                  setTimeout(() => {
                    window.location.reload();
                  }, 500);
                }}
              >
                同步ES
              </Button>
            )}

            <Button
              type="link"
              onClick={() => handleForwardPrintLabel([record])}
            >
              {i18n.t(LOCALS.SAnwKhjJJd)}
            </Button>

            {isProductMatchShop({
              shopId: userInfo.shop,
              stockPlace: record.stockPlace,
            }) &&
              record.stockStatus === PMS_PRODUCT_STOCK_STATUS.FOR_SALE && (
                <Button
                  type="link"
                  onClick={() => {
                    window.location.href = `/oms/checkout-counter?productSn=${record.productSn}`;
                  }}
                >
                  <Trans i18nKey={LOCALS.checkout_counter} />
                </Button>
              )}

            {canDelete && (
              <Button
                type="link"
                danger
                onClick={(e) => {
                  handleDelete(id);
                }}
              >
                <Trans i18nKey={LOCALS.delete} />
              </Button>
            )}
          </div>
        );
      },
    };

    return [
      ...columnList1,
      publishStatusColumn,
      ...columnList2,
      soldInfoColumn,
      optionColumn,
    ];
  }, [
    canDeleteProduct,
    colorSelectOptions,
    handleDelete,
    handleForwardPrint,
    handleForwardPrintLabel,
    handlePublishStatusChange,
    hardwareSelectOptions,
    isProductForSaleToSold,
    materialCascaderOptionsMap,
    onEdit,
    productCategoryCascaderOptions,
    rankSelectOptions,
    stampSelectOptions,
    userInfo.shop,
    viewPrint,
  ]);

  const batchOptionList = useMemo(() => {
    const options: {
      value: string;
      label: string;
    }[] = [];

    if (viewPrint) {
      options.push({
        value: BATCH_OPTION_TYPE.BATCH_PRINT,
        label: i18n.t(LOCALS.UkQnhHkZxc),
      });
    }

    options.push({
      value: BATCH_OPTION_TYPE.BATCH_PRINT_LABEL,
      label: i18n.t(LOCALS.dhDBFGAEfU),
    });

    // 商品都是待入库状态
    if (
      selectedRows.every(
        (i) => i.stockStatus === PMS_PRODUCT_STOCK_STATUS.PENDING_ENTRY
      ) ||
      selectedRows.every(
        (i) => i.stockStatus === PMS_PRODUCT_STOCK_STATUS.LENT_OUT
      )
    ) {
      options.push({
        value: BATCH_OPTION_TYPE.BATCH_STOCK,
        label: i18n.t(LOCALS.kUJWWIcHRk),
      });
    }

    // 商品都是已入库状态
    if (
      selectedRows.every(
        (i) => i.stockStatus === PMS_PRODUCT_STOCK_STATUS.STOCKED
      ) ||
      selectedRows.every(
        (i) => i.stockStatus === PMS_PRODUCT_STOCK_STATUS.LENT_OUT
      )
    ) {
      options.push({
        value: BATCH_OPTION_TYPE.BATCH_FOR_SALE,
        label: i18n.t(LOCALS.PWWODvsPvK),
      });
    }

    // 商品都是已入库状态 & 下架中状态
    if (
      selectedRows.every(
        (i) => i.stockStatus === PMS_PRODUCT_STOCK_STATUS.FOR_SALE
      ) &&
      selectedRows.every((i) => i.publishStatus === 0)
    ) {
      options.push({
        value: BATCH_OPTION_TYPE.BATCH_PUBLISH,
        label: i18n.t(LOCALS.rhCgCypWuW),
      });
    }

    // 商品都是已入库状态 & 上架中状态
    if (
      selectedRows.every(
        (i) => i.stockStatus === PMS_PRODUCT_STOCK_STATUS.FOR_SALE
      ) &&
      selectedRows.every((i) => i.publishStatus === 1)
    ) {
      options.push({
        value: BATCH_OPTION_TYPE.BATCH_UN_PUBLISH,
        label: i18n.t(LOCALS.kWaTarLxzT),
      });
    }

    if (
      selectedRows.every(
        (i) => i.stockStatus === PMS_PRODUCT_STOCK_STATUS.STOCKED
      ) ||
      selectedRows.every(
        (i) => i.stockStatus === PMS_PRODUCT_STOCK_STATUS.FOR_SALE
      )
    ) {
      options.push({
        value: BATCH_OPTION_TYPE.BATCH_LENT_OUT,
        label: i18n.t(LOCALS.UNcgaTHsci),
      });
    }

    if (
      selectedRows.every(
        (i) =>
          i.stockStatus === PMS_PRODUCT_STOCK_STATUS.FOR_SALE &&
          isProductMatchShop({
            shopId: userInfo.shop,
            stockPlace: i.stockPlace,
          })
      )
    ) {
      options.push({
        value: BATCH_OPTION_TYPE.BATCH_CHECK_OUT,
        label: i18n.t(LOCALS.checkout_counter),
      });
    }

    if (
      selectedRows.every(
        (i) => i.stockStatus === PMS_PRODUCT_STOCK_STATUS.FOR_SALE
      ) &&
      isProductForSaleToSold
    ) {
      options.push({
        value: BATCH_OPTION_TYPE.BATCH_SOLD_OUT,
        label: i18n.t(LOCALS.KpQUBrSjzY),
      });
    }

    return options;
  }, [isProductForSaleToSold, selectedRows, userInfo.shop, viewPrint]);

  const [batchForSaleConfirmModelOpen, toggleBatchForSaleConfirmModelOpen] =
    useToggle(false);
  const [batchOptionType, setBatchOptionType] = useState(undefined);

  const onClickBatchOption = useCallback(async () => {
    if (batchOptionType === BATCH_OPTION_TYPE.BATCH_PRINT) {
      handleForwardPrint(selectedRows);
      return;
    }

    if (batchOptionType === BATCH_OPTION_TYPE.BATCH_PRINT_LABEL) {
      handleForwardPrintLabel(selectedRows);
      return;
    }

    const productIdList = selectedRows.map((i) => i.id);

    if (batchOptionType === BATCH_OPTION_TYPE.BATCH_STOCK) {
      const remark = window.prompt('備考欄');

      await updateStockStatus({
        productIdList,
        newStockStatus: PMS_PRODUCT_STOCK_STATUS.STOCKED,
        note: `后台批量操作商品入库: ${remark}`,
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return;
    }

    if (batchOptionType === BATCH_OPTION_TYPE.BATCH_FOR_SALE) {
      toggleBatchForSaleConfirmModelOpen(true);
      return;
    }

    if (batchOptionType === BATCH_OPTION_TYPE.BATCH_PUBLISH) {
      await publishProduct(productIdList);
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return;
    }

    if (batchOptionType === BATCH_OPTION_TYPE.BATCH_UN_PUBLISH) {
      await unPublishProduct(productIdList);
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return;
    }

    if (batchOptionType === BATCH_OPTION_TYPE.BATCH_CHECK_OUT) {
      window.location.href = `/oms/checkout-counter?productSn=${encodeURIComponent(
        selectedRows.map((i) => i.productSn).join('\n')
      )}`;
      return;
    }

    if (batchOptionType === BATCH_OPTION_TYPE.BATCH_SOLD_OUT) {
      await updateStockStatus({
        productIdList,
        newStockStatus: PMS_PRODUCT_STOCK_STATUS.SOLD,
        note: '后台批量操作商品卖出',
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return;
    }

    if (batchOptionType === BATCH_OPTION_TYPE.BATCH_LENT_OUT) {
      const remark = window.prompt('備考欄');
      if (remark === null) return;

      await updateStockStatus({
        productIdList,
        newStockStatus: PMS_PRODUCT_STOCK_STATUS.LENT_OUT,
        note: `一括貸出: ${remark}`,
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return;
    }
  }, [
    batchOptionType,
    handleForwardPrint,
    handleForwardPrintLabel,
    selectedRows,
    toggleBatchForSaleConfirmModelOpen,
  ]);

  const [priceMissMatchOpen, togglePriceMissMatchOpen] = useToggle(false);
  const [priceMissMatchRecord, setPriceMissMatchRecord] = useState<
    UnwrapPromise<ReturnType<typeof getProductPriceComparison>>['mismatches']
  >([]);
  useEffect(() => {
    getProductPriceComparison().then((res) => {
      setPriceMissMatchRecord(res.mismatches);
    });
  }, []);

  return (
    <div>
      <Modal
        title="一括販売"
        open={batchForSaleConfirmModelOpen}
        onCancel={toggleBatchForSaleConfirmModelOpen}
        footer={null}
        destroyOnClose
      >
        <Form
          onFinish={async ({
            note,
            autoPublish,
          }: {
            note?: string;
            autoPublish: boolean;
          }) => {
            await updateStockStatus({
              productIdList: selectedRows.map((i) => i.id),
              newStockStatus: PMS_PRODUCT_STOCK_STATUS.FOR_SALE,
              note: `后台批量操作商品售卖: ${
                note || ''
              }\n自动掲載: ${autoPublish}`,
              autoPublish,
            });
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }}
        >
          <Form.Item label="備考欄" name="note">
            <Input.TextArea rows={5} placeholder="備考欄"></Input.TextArea>
          </Form.Item>
          <Form.Item
            label="自動掲載"
            name="autoPublish"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch></Switch>
          </Form.Item>

          <Form.Item className="mb-0">
            <Button.Group className="flex gap-2 justify-end">
              <Button onClick={toggleBatchForSaleConfirmModelOpen}>
                キャンセル
              </Button>
              <Button type="primary" htmlType="submit">
                OK
              </Button>
            </Button.Group>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        onCancel={() => {
          setUpdateStockStatus(undefined);
        }}
        onOk={() => {
          if (updateStockStatusData) {
            updateStockStatus(updateStockStatusData).then(() => {
              setTimeout(() => {
                window.location.reload();
              }, 500);
            });
          }
        }}
        title={i18n.t(LOCALS.stock_status_change_note) || ''}
        open={!!updateStockStatusData}
      >
        <Input.TextArea
          rows={5}
          placeholder={i18n.t(LOCALS.remark) || ''}
          value={updateStockStatusData?.note}
          onChange={(e) => {
            if (!updateStockStatusData) return;
            setUpdateStockStatus({
              ...updateStockStatusData,
              note: e.target.value,
            });
          }}
        ></Input.TextArea>
      </Modal>
      <Form form={form} layout="inline" onFinish={onFinish}>
        <Form.Item
          name="productCategoryIds"
          label={<Trans i18nKey={LOCALS.product_category}></Trans>}
        >
          <Cascader
            changeOnSelect
            placeholder={i18n.t(LOCALS.please_select) || ''}
            style={{ minWidth: 160 }}
            options={productCategoryCascaderOptions}
            showSearch={{
              filter: getCascaderFilter,
            }}
          />
        </Form.Item>

        <Form.Item
          name="keyword"
          label={<Trans i18nKey={LOCALS.keyword}></Trans>}
        >
          <Input.TextArea
            style={{ minWidth: 250 }}
            placeholder={i18n.t(LOCALS.please_enter) || ''}
          />
        </Form.Item>

        <Form.Item
          name="stockStatus"
          label={i18n.t(LOCALS.uMihwkqqts)}
          initialValue={[]}
          hidden
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: 200 }}
            placeholder={i18n.t(LOCALS.please_select) || ''}
          >
            {PMS_PRODUCT_STOCK_STATUS_OPTION_LIST.map((i) => (
              <Select.Option key={i.value} value={i.value}>
                {i.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="publishStatus"
          label={<Trans i18nKey={LOCALS.publish_status}></Trans>}
          initialValue={''}
        >
          <Select
            style={{ minWidth: 120 }}
            placeholder={i18n.t(LOCALS.please_select) || ''}
          >
            <Select.Option value="">{i18n.t('all')}</Select.Option>
            {PUBLISH_STATUS_OPTION_LIST.map((d) => (
              <Select.Option key={d.value} value={d.value}>
                {d.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="stockPlace"
          label={<Trans i18nKey={LOCALS.stock_place} />}
          initialValue={''}
        >
          <Select
            style={{ minWidth: 200 }}
            placeholder={i18n.t(LOCALS.please_select) || ''}
          >
            <Select.Option value="">{i18n.t('all')}</Select.Option>
            {STOCK_PLACE_OPTION_LIST.map((d) => (
              <Select.Option key={d.value} value={d.value}>
                {d.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="rankList" label={i18n.t(LOCALS.rank)}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: 200 }}
            placeholder={i18n.t(LOCALS.please_select) || ''}
          >
            {rankSelectOptions.map((i) => (
              <Select.Option key={i.value} value={i.value}>
                {i.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="isHavePic" label={i18n.t(LOCALS.product_pictures)}>
          <Select
            allowClear
            style={{ minWidth: 120 }}
            placeholder={i18n.t(LOCALS.please_select) || ''}
          >
            <Select.Option value={true}>
              {i18n.t(LOCALS.available)}
            </Select.Option>
            <Select.Option value={false}>
              {i18n.t(LOCALS.unavailable)}
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="sourceTypeList" label={i18n.t(LOCALS.product_source)}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: 200 }}
            placeholder={i18n.t(LOCALS.please_select) || ''}
          >
            {PRODUCT_SOURCE_TYPE_OPTION_LIST.map((i) => (
              <Select.Option key={i.value} value={i.value}>
                {i.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="createTime"
          label={<Trans i18nKey={LOCALS.created_time} />}
        >
          <RangePicker
            className={classNames('w-full', {
              isMobile: 'w-[220px]',
            })}
          />
        </Form.Item>

        <Form.Item
          name="soldTime"
          label={<Trans i18nKey={LOCALS.UNXRchiSDw}></Trans>}
        >
          <RangePicker
            className={classNames('w-full', {
              isMobile: 'w-[220px]',
            })}
          />
        </Form.Item>

        <Form.Item
          name="isFilterPromotion"
          valuePropName="checked"
          label={<Trans i18nKey={LOCALS.on_sale} />}
        >
          <Switch></Switch>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              <Trans i18nKey={LOCALS.search} />
            </Button>
            <Button htmlType="button" onClick={onReset}>
              <Trans i18nKey={LOCALS.reset} />
            </Button>
            <Button
              onClick={() => {
                window.location.href = '/pms/product-add';
              }}
            >
              <Trans i18nKey={LOCALS.add} />
            </Button>
          </Space>
        </Form.Item>

        <Form.Item>
          <div className="items-center justify-center flex w-64">
            <Select
              value={batchOptionType}
              onChange={(e) => {
                setBatchOptionType(e);
              }}
              disabled={selectedRows.length === 0}
              placeholder={i18n.t(LOCALS.StzCTlyrrP)}
              options={batchOptionList}
            ></Select>
            <Button
              onClick={onClickBatchOption}
              type="primary"
              disabled={selectedRows.length === 0 || !batchOptionType}
            >
              {i18n.t(LOCALS.confirm)}
            </Button>
          </div>
        </Form.Item>

        {userInfo.username === 'admin' && (
          <Form.Item>
            <Button
              type="default"
              danger={!!priceMissMatchRecord.length}
              onClick={togglePriceMissMatchOpen}
            >
              {i18n.t(LOCALS.bOYktSqeQU)}（{priceMissMatchRecord.length}）
            </Button>
          </Form.Item>
        )}

        <Form.Item>
          {/* 先设定为选择的筛选条件下，超过 3000 个商品不给导出吧 */}
          <Button
            disabled={total > 3000}
            onClick={async () => {
              const { list } = await searchProductList({
                pageNum: 1,
                pageSize: 3000,
                setQuery: false,
              });

              const headers = [
                '商品ID',
                '旧商品番号',
                i18n.t(LOCALS.product_pictures),
                '商品名',
                i18n.t(LOCALS.rank),
                i18n.t(LOCALS.color),
                i18n.t(LOCALS.material),
                i18n.t(LOCALS.hardware),
                i18n.t(LOCALS.stamp),
                i18n.t(LOCALS.uMihwkqqts),
                i18n.t(LOCALS.publish_status),
                i18n.t(LOCALS.product_source),
                i18n.t(LOCALS.currency),
                i18n.t(LOCALS.selling_price),
                '税抜き価格',
                i18n.t(LOCALS.purchase_price),
                '仕入価格（税抜）',
                i18n.t(LOCALS.stock),
                i18n.t(LOCALS.stock_place),
                i18n.t(LOCALS.dwawuQNUEi),
                i18n.t(LOCALS.UNXRchiSDw),
              ];

              const mappedData = list.map(
                ({
                  id,
                  name,
                  price,
                  stock,
                  currency,
                  stockStatus,
                  costPrice,
                  description,
                  stockPlace,
                  publishStatus,
                  sourceType,
                  rank,
                  colorText,
                  materialText,
                  hardwareText,
                  stampText,
                  pic,
                  orderId,
                  soldTime,
                }) => {
                  const stockStatusLabelKey =
                    PMS_PRODUCT_STOCK_STATUS_OPTION_LIST.find(
                      (i) => i.value === stockStatus
                    )?.labelKey || '';
                  const sourceTypeLabelKey =
                    PRODUCT_SOURCE_TYPE_OPTION_LIST.find(
                      (i) => i.value === sourceType
                    )?.labelKey || '';

                  return {
                    商品ID: id,
                    旧商品番号: description,
                    [i18n.t(LOCALS.product_pictures)]: pic || '',
                    商品名: name,
                    [i18n.t(LOCALS.rank)]: rankSelectOptions.find(
                      (i) => i.value === rank
                    )?.label,
                    [i18n.t(LOCALS.color)]: colorText,
                    [i18n.t(LOCALS.material)]: materialText,
                    [i18n.t(LOCALS.hardware)]: hardwareText,
                    [i18n.t(LOCALS.stamp)]: stampText,
                    [i18n.t(LOCALS.uMihwkqqts)]: stockStatusLabelKey
                      ? i18n.t(stockStatusLabelKey)
                      : stockStatus,
                    [i18n.t(LOCALS.publish_status)]: publishStatus
                      ? i18n.t(LOCALS.on_shelf)
                      : i18n.t(LOCALS.off_shelf),
                    [i18n.t(LOCALS.product_source)]: sourceTypeLabelKey
                      ? i18n.t(sourceTypeLabelKey)
                      : sourceType,
                    [i18n.t(LOCALS.currency)]: currency,
                    [i18n.t(LOCALS.selling_price)]: price,
                    [i18n.t(LOCALS.czbRYWhFdZ)]:
                      currency === 'JPY'
                        ? Math.ceil(price / (1 + CONSUMPTION_TAX_RATE))
                        : price,
                    [i18n.t(LOCALS.stock)]: stock,
                    [i18n.t(LOCALS.purchase_price)]: costPrice,
                    '仕入価格（税抜）': costPrice
                      ? Math.ceil(
                          Number(costPrice) / (1 + CONSUMPTION_TAX_RATE)
                        )
                      : '-',
                    [i18n.t(LOCALS.stock_place)]: stockPlace,
                    [i18n.t(LOCALS.dwawuQNUEi)]: orderId,
                    [i18n.t(LOCALS.UNXRchiSDw)]: soldTime
                      ? dayjs(soldTime).format('YYYY-MM-DD')
                      : '-',
                  };
                }
              );

              // 将数据转换为 Excel 格式
              const worksheet = XLSX.utils.json_to_sheet(mappedData, {
                header: headers,
              });

              // 创建工作簿
              const workbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                'product export'
              );

              // 生成 Excel 文件并触发下载
              XLSX.writeFile(
                workbook,
                `商品リスト-${dayjs().format('YYYY-MM-DD')}.xlsx`
              );
            }}
          >
            {i18n.t('download_excel')}（{total}）
          </Button>
        </Form.Item>
      </Form>

      <div className="grid grid-cols-2 lg:grid-cols-7 gap-4">
        {PMS_PRODUCT_STOCK_STATUS_OPTION_LIST.filter((i) => {
          return [
            PMS_PRODUCT_STOCK_STATUS.PENDING_ENTRY,
            PMS_PRODUCT_STOCK_STATUS.STOCKED,
            PMS_PRODUCT_STOCK_STATUS.FOR_SALE,
            PMS_PRODUCT_STOCK_STATUS.LENT_OUT,
            PMS_PRODUCT_STOCK_STATUS.RESERVED,
            PMS_PRODUCT_STOCK_STATUS.SOLD,
            PMS_PRODUCT_STOCK_STATUS.INVALID,
          ].includes(i.value);
        }).map(({ value, label }) => {
          const isChecked = stockStatusFormValue?.includes(value);

          return (
            <div
              key={value}
              className={classNames(
                'text-center py-2 cursor-pointer',
                isChecked ? 'bg-black text-white' : 'bg-gray-200'
              )}
              onClick={() => {
                if (isChecked) {
                  form.setFieldValue(
                    'stockStatus',
                    stockStatusFormValue?.filter((i: string) => i !== value)
                  );
                } else {
                  form.setFieldValue('stockStatus', [
                    ...(stockStatusFormValue || []),
                    value,
                  ]);
                }
                onFinish();
              }}
            >
              {label}（
              {productStockStatusStatistics.find((i) => i.stockStatus === value)
                ?.count || 0}
              ）
            </div>
          );
        })}
      </div>
      <Table
        bordered
        tableLayout="fixed"
        rowSelection={{
          selectedRowKeys: selectedRows.map((d) => d.id) as React.Key[],
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        pagination={{
          total,
          pageSize,
          current: pageNum,
          showTotal: (total) => `${i18n.t('total')} ${total} ${i18n.t('item')}`,
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
        scroll={{ x: 'max-content' }}
        dataSource={dataSource}
        columns={columns}
      />

      <Modal
        title={i18n.t(LOCALS.rrooMUILfK)}
        closeIcon={false}
        width={'80%'}
        open={!!viewStockStatusProductId}
        footer={null}
        onCancel={() => {
          setViewStockStatusProductId(0);
        }}
      >
        <ProductStockStatusHistory productId={viewStockStatusProductId} />
      </Modal>

      <Modal
        title={i18n.t(LOCALS.bOYktSqeQU)}
        open={priceMissMatchOpen}
        onCancel={togglePriceMissMatchOpen}
        onOk={togglePriceMissMatchOpen}
        width={700}
      >
        <Table
          dataSource={priceMissMatchRecord}
          pagination={false}
          bordered
          rowKey={'productId'}
          columns={[
            {
              title: 'ID',
              dataIndex: 'productId',
              key: 'productId',
              render(productId: number) {
                return (
                  <a
                    href={`/pms/product-edit/${productId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {productId}
                  </a>
                );
              },
            },
            {
              title: i18n.t(LOCALS.product_sn),
              dataIndex: 'productSn',
              key: 'productSn',
            },
            {
              title: i18n.t(LOCALS.FrlyfzfGME),
              dataIndex: 'dbPrice',
              key: 'dbPrice',
              render(price: number, { currency }: { currency: string }) {
                return `${currency} ${price.toLocaleString()}`;
              },
            },
            {
              title: i18n.t(LOCALS.AHBGzxjtrR),
              dataIndex: 'esPrice',
              key: 'esPrice',
              render(price: number, { currency }: { currency: string }) {
                return `${currency} ${price.toLocaleString()}`;
              },
            },
            {
              title: i18n.t(LOCALS.option),
              key: 'option',
              render({ productId }: { productId: number }) {
                return (
                  <Button
                    type="link"
                    onClick={async () => {
                      await syncProductToEs([productId]);
                      window.location.reload();
                    }}
                  >
                    一键同步
                  </Button>
                );
              },
            },
          ]}
        ></Table>
      </Modal>
    </div>
  );
};

export default ProductList;
