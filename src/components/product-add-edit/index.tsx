import {
  Button,
  Cascader,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  message,
} from 'antd';
import {
  createProduct,
  getProductListNew,
  getProductUpdateInfoNew,
  PmsProductEs,
  updateProduct,
} from 'apis/pms';
import LOCALS from 'commons/locals';
import {
  CURRENCY_MAP,
  CURRENCY_OPTION_LIST,
  LANGUAGE_MAP,
  PRODUCT_SOURCE_TYPE_MAP,
  PRODUCT_SOURCE_TYPE_OPTION_LIST,
  PROMOTION_TYPE_MAP,
  PUBLISH_STATUS_OPTION_LIST,
  STOCK_PLACE_MAP,
  STOCK_PLACE_OPTION_LIST,
  findLabelByValue,
} from 'commons/options';
import ImageUploader from 'components/image-uploader';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import {
  CascaderOption,
  SelectOptionWarp,
  CascaderOptionWarp,
  SelectOption,
  UnwrapPromise,
  DefaultOptionType,
} from 'types/base';
import {
  ProductCreateInfo,
  ProductUpdateInfo,
  ProductUpdateInfoNewType,
} from 'types/pms';
import findCascaderOptionById from 'utils/findCascaderOptionById';
import ProductName from './product-name';
import RankDesc from './rank-desc';
import RemarksDesc from './remarks-desc';
import {
  langageInputType,
  LANGAGE_INPUT_MAP,
  handleI18n,
  handleAppend,
  nameValue,
} from './utils';
import { useSelector } from 'react-redux';
import { selectUserInfo } from 'store/slices/userInfoSlice';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';
import i18n from 'i18n';
import JSONViewer from 'components/simple-json-viewer';
import checkOldProductSn from 'utils/check-old-product-sn';
import getCascaderFilter from 'utils/getCascaderFilter';
import ProductStockStatusHistory from 'pages/product/product-stock-status-history';
import useBrandList from 'commons/hooks/use-brand-list';
import getUpdateProductStockStatusOptions from 'utils/get-update-product-stock-status-options';
import { priceToWithoutTax, priceToWithTax } from 'utils/price-change';
import useResource from 'commons/hooks/useResource';
import { useToggle } from 'react-use';
import { CheckCircleOutlined } from '@ant-design/icons';

type ProductAddEditProps = {
  mode: 'add' | 'view' | 'edit';
  id?: number;
};

type ProductUpdateInfoNew = UnwrapPromise<
  ReturnType<typeof getProductUpdateInfoNew>
>;

// 一些多选值，需要从字符串转成数组并初始化
const transformList: [keyof ProductUpdateInfoNew, string, string][] = [
  ['color', 'attrColor', 'attrColorArr'], // 商品颜色
  ['hardware', 'attrHardware', 'attrHardwareArr'], // 商品金属配件
  ['accessory', 'attrAccessory', 'attrAccessoryArr'], // 商品配件
  ['collections', 'collections', 'collectionsArr'], // 商品合集
];

const ProductAddEdit = ({ mode, id }: ProductAddEditProps) => {
  const [loading, setLoading] = useState(false);
  const [productPics, setProductPics] = useState<
    { url: string; name: string }[]
  >([]);
  const [productSource, setProductSource] =
    useState<ProductUpdateInfoNewType>();
  // TODO: 完善表单类型定义
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const [isChange, setIsChange] = useState(false);
  const [activityDetail, setActivityDetail] = useState('');
  const [pmsProductActivityList, setPmsProductActivityList] = useState<
    ProductUpdateInfoNew['pmsProductActivityList']
  >([]);
  const [i18nList, setI18nList] = useState<ProductUpdateInfoNew['i18nList']>(
    []
  );
  const [stockInfo, setStockInfo] = useState<
    Pick<ProductUpdateInfoNew, 'stock' | 'publishStatus'>
  >({
    stock: 0,
    publishStatus: 0,
  });

  const isProductForSaleToSold = useResource('product-for-sale-to-sold');
  const [initStockStatus, setInitStockStatus] = useState<undefined | string>();
  const stockStatusOptions = useMemo(() => {
    return getUpdateProductStockStatusOptions({
      initStockStatus,
      isProductForSaleToSold,
    });
  }, [initStockStatus, isProductForSaleToSold]);

  useEffect(() => {
    if (isChange && ['add', 'edit'].includes(mode)) {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        const confirmationMessage = i18n.t(
          'changes_have_not_been_saved'
        ) as string;
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isChange, mode, navigate]);

  const { userId } = useSelector(selectUserInfo);
  useEffect(() => {
    if (userId && mode === 'add') {
      form.setFieldValue('owner', userId.toString());
      form.setFieldValue('supportCrypto', 1);
    }
  }, [userId, form, mode]);

  const {
    language,
    staffSelectOptions,
    productCategoryCascaderOptions,
    typeSelectOptions,
    rankSelectOptions,
    hueSelectOptions,
    colorSelectOptions,
    materialCascaderOptionsMap,
    hardwareSelectOptions,
    stampSelectOptions,
    accessorySelectOptions,
    collectionSelectOptionsMap,
  } = useAppSelector(selectGlobalInfo);
  const { BrandList, DefaultBrand } = useBrandList();

  const stampListSort = useMemo((): SelectOption[] => {
    if (stampSelectOptions && stampSelectOptions.length) {
      return [...stampSelectOptions].sort(
        (a: SelectOption, b: SelectOption) => b.sort! - a.sort!
      );
    }
    return [];
  }, [stampSelectOptions]);

  const rankListSort = useMemo((): SelectOption[] => {
    if (rankSelectOptions && rankSelectOptions.length) {
      return [...rankSelectOptions].sort(
        (a: SelectOption, b: SelectOption) => b.sort! - a.sort!
      );
    }
    return [];
  }, [rankSelectOptions]);

  const accessoryListSort = useMemo((): SelectOption[] => {
    if (accessorySelectOptions && accessorySelectOptions.length) {
      return [...accessorySelectOptions].sort(
        (a: SelectOption, b: SelectOption) => b.sort! - a.sort!
      );
    }
    return [];
  }, [accessorySelectOptions]);

  const hardwareListSort = useMemo((): SelectOption[] => {
    if (hardwareSelectOptions && hardwareSelectOptions.length) {
      return [...hardwareSelectOptions].sort(
        (a: SelectOption, b: SelectOption) => b.sort! - a.sort!
      );
    }
    return [];
  }, [hardwareSelectOptions]);

  const [inputLang] = useState<langageInputType>(
    (() => {
      if (language === LANGUAGE_MAP.ZH_CN) {
        return LANGAGE_INPUT_MAP.ZH;
      } else if (language === LANGUAGE_MAP.EN) {
        return LANGAGE_INPUT_MAP.EN;
      } else if (language === LANGUAGE_MAP.JA) {
        return LANGAGE_INPUT_MAP.JA;
      }

      return LANGAGE_INPUT_MAP.EN;
    })()
  );

  const [productCategoryIdFirstLevel, setProductCategoryIdFirstLevel] =
    useState(0);
  const [materialCascaderOptions, setMaterialCascaderOptions] = useState<
    CascaderOption[]
  >([]);

  const collectionSelectOptions = useMemo(() => {
    if (!productCategoryIdFirstLevel) return [];

    if (!Object.keys(collectionSelectOptionsMap).length) return [];

    return collectionSelectOptionsMap[productCategoryIdFirstLevel] || [];
  }, [collectionSelectOptionsMap, productCategoryIdFirstLevel]);

  useEffect(() => {
    if (['view', 'edit'].includes(mode) && id) {
      if (
        !Object.keys(materialCascaderOptionsMap).length ||
        productCategoryCascaderOptions.length === 0
      ) {
        return;
      }
      setLoading(true);
      getProductUpdateInfoNew(id)
        .then((data) => {
          setProductSource(data);
          const {
            pmsProductActivityList,
            i18nList,
            albumPics,
            productCategoryId,
            material,
            extendType,
            colorRemark,
            stampRemark,
            hardwareRemark,
            materialRemark,
            stamp,
            publishStatus,
            stock,
            brandName,
            stockStatus,
            price,
          } = data;

          setInitStockStatus(stockStatus);
          setPmsProductActivityList(pmsProductActivityList);
          setI18nList(i18nList);
          setStockInfo({ stock, publishStatus });

          form.setFieldsValue({
            ...data,
            attrType: extendType,
            attrColorRemark: colorRemark,
            attrStampRemark: stampRemark,
            attrHardwareRemark: hardwareRemark,
            attrMaterialRemark: materialRemark,
            attrStamp: stamp,
            brandName: brandName || 'Hermes',
            priceWithoutTax: priceToWithoutTax(price),
          });

          const i18nJa = i18nList?.find((i) => i.lang === 'ja');
          const i18nCn = i18nList?.find((i) => i.lang === 'zh_CN');
          const i18nTw = i18nList?.find((i) => i.lang === 'zh_TW');

          // 需要翻译字段调整
          const name = {
            ja: i18nJa?.name,
            en: data.name,
            zh: i18nCn?.name,
            zh_TW: i18nTw?.name,
          };
          const subTitle = {
            ja: i18nJa?.subTitle,
            en: data.subTitle,
            zh: i18nCn?.subTitle,
            zh_TW: i18nTw?.subTitle,
          };
          const rank: SelectOptionWarp | undefined = rankListSort.find(
            (d) => d.value === data.rank
          );
          const attrRankDesc = {
            ja: i18nJa?.attrRankDesc || rank?.labelJa,
            en: data.rankDescription || rank?.labelEn,
            zh: i18nCn?.attrRankDesc || rank?.labelCn,
            zh_TW: i18nTw?.attrRankDesc || rank?.labelTw,
          };
          setSelectRank(attrRankDesc);
          const note = {
            ja: i18nJa?.note,
            en: data.note,
            zh: i18nCn?.note,
            zh_TW: i18nTw?.note,
          };
          const detailDesc = {
            ja: i18nJa?.detailDesc,
            en: data.detailDesc,
            zh: i18nCn?.detailDesc,
            zh_TW: i18nTw?.detailDesc,
          };
          const detailTitle = {
            ja: i18nJa?.detailTitle,
            en: data.detailTitle,
            zh: i18nCn?.detailTitle,
            zh_TW: i18nTw?.detailTitle,
          };
          const attrSize = {
            ja: i18nJa?.attrSize,
            en: data.size,
            zh: i18nCn?.attrSize,
            zh_TW: i18nTw?.attrSize,
          };
          form.setFieldsValue({
            name,
            subTitle,
            attrRankDesc,
            note,
            detailDesc,
            detailTitle,
            attrSize,
          });

          // 商品分类查找完整路径
          if (productCategoryId) {
            const target = findCascaderOptionById(
              productCategoryId,
              productCategoryCascaderOptions
            );

            if (target) {
              const productCategoryIds = target.treeIds
                ?.split(',')
                .map((i) => +i);

              if (productCategoryIds) {
                const productCategoryIdFirstLevel = productCategoryIds[0];
                const materialCascaderOptions =
                  [
                    ...materialCascaderOptionsMap[productCategoryIdFirstLevel],
                  ].sort((a, b) => a.sort! - b.sort!) || [];
                setProductCategoryIdFirstLevel(productCategoryIdFirstLevel);
                setMaterialCascaderOptions(materialCascaderOptions);

                form.setFieldValue('productCategoryIds', productCategoryIds);

                // 商品材质选项依赖于商品分类

                if (material) {
                  const tempArr = material.split(',');

                  const attrMaterialArr = tempArr.map((material) => {
                    const target = findCascaderOptionById(
                      material,
                      materialCascaderOptions
                    );
                    const tempStrArr = target?.treeIds?.split(',');
                    return tempStrArr;
                  });

                  form.setFieldValue('attrMaterialArr', attrMaterialArr);
                }
              }
            }
          }

          transformList.forEach((item) => {
            const [dataKey, , formKey] = item;
            const value = data[dataKey];

            if (typeof value === 'string') {
              form.setFieldValue(formKey, value ? value.split(',') : []);
            }
          });

          setProductPics(
            albumPics
              ? albumPics.split(',').map((d, i) => ({ url: d, name: `${i}` }))
              : []
          );
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      form.setFieldsValue({
        sourceType: PRODUCT_SOURCE_TYPE_MAP.RECYCLE,
        promotionType: PROMOTION_TYPE_MAP.NORMAL,
      });
    }
  }, [
    form,
    id,
    language,
    materialCascaderOptionsMap,
    mode,
    productCategoryCascaderOptions,
    rankListSort,
    rankSelectOptions,
  ]);

  const onBack = useCallback(() => {
    if (!document.referrer) {
      window.location.href = '/pms/product-list';
    } else {
      window.history.go(-1);
    }
  }, []);
  const handleTextRank = useCallback(
    (text: string, appendText: string) => {
      // 如果文本为空，直接返回新的rank文本
      if (!text || text.trim() === '') {
        return appendText;
      }

      // 将文本分割成行
      const lines = text.split('\n');
      const firstLine = lines[0];

      // 使用rankListSort来检查第一行是否包含任何已定义的rank标签
      const isRankLine = rankListSort.some((rankOption) => {
        const option = rankOption as SelectOptionWarp;
        return (
          (option.labelEn && firstLine.includes(option.labelEn)) ||
          (option.labelJa && firstLine.includes(option.labelJa)) ||
          (option.labelCn && firstLine.includes(option.labelCn)) ||
          (option.labelTw && firstLine.includes(option.labelTw)) ||
          (option.value && firstLine.includes(String(option.value)))
        );
      });

      // 如果第一行是rank信息，替换它
      if (isRankLine) {
        lines[0] = appendText;
      } else {
        // 否则，在开头添加rank信息，保留原始内容
        lines.unshift(appendText);
      }

      return lines.join('\n');
    },
    [rankListSort],
  );

  const [finishConfirmModalOpen, toggleFinishConfirmModalOpen] =
    useToggle(false);
  const [finishConfirmLoading, toggleFinishConfirmLoading] = useToggle(false);
  const [isFinishConfirmSuccess, toggleIsFinishConfirmSuccess] =
    useToggle(false);

  const handleFinishConfirmOk = useCallback(async () => {
    let data = form.getFieldsValue();
    const description = data.description ? data.description.trim() : '';

    if (
      !checkOldProductSn({
        oldProductSn: description,
        currency: data.currency,
      })
    ) {
      message.warning(i18n.t('the_place_of_origin_or_currency_is_incorrect'));
      return;
    }

    let request: typeof createProduct | typeof updateProduct;
    let requestData: ProductCreateInfo & ProductUpdateInfo;
    setIsChange(false);

    requestData = {
      ...data,
      productCategoryId:
        data.productCategoryIds[data.productCategoryIds.length - 1],
      attrMaterial:
        data.attrMaterialArr &&
        data.attrMaterialArr
          .map((i: any) => {
            return i[i.length - 1];
          })
          .join(','),
      pic: productPics && productPics.length ? productPics[0].url : '',
      albumPics: productPics.map((d) => d.url).join(','),
      facebookEnabled: data.facebookEnabled ? 1 : 0,
      // keywords: Object.values(data.attrRankDesc)?.join(' '),
    };

    transformList.forEach(([, updateInfoKey, formKey]) => {
      // @ts-ignore
      const fromValue = requestData[formKey];
      if (fromValue) {
        // @ts-ignore
        requestData[updateInfoKey] = fromValue.join(',');
      }
    });

    // 下面这段逻辑，目的是更新商品多语言文案
    // 英文文案默认存在商品表，其他语言文案需要通过 i18nJa i18nCn 来更新
    // 更新非英语文案时，还需要把参数里边的多语言部分给清空
    requestData.i18nJa = handleI18n(
      data,
      LANGAGE_INPUT_MAP.JA,
      i18nList?.find((i) => i.lang === 'ja')
    );
    requestData.i18nCn = handleI18n(
      data,
      LANGAGE_INPUT_MAP.ZH,
      i18nList?.find((i) => i.lang === 'zh_CN')
    );
    requestData.i18nTw = handleI18n(
      data,
      LANGAGE_INPUT_MAP.ZH_TW,
      i18nList?.find((i) => i.lang === 'zh_TW')
    );
    const i18nEn = handleI18n(data, LANGAGE_INPUT_MAP.EN);

    if (['view', 'edit'].includes(mode) && id) {
      requestData.id = id;

      requestData = {
        ...requestData,
        ...i18nEn,
      };
      request = updateProduct;
    } else {
      requestData = {
        ...requestData,
        ...i18nEn,
      };
      request = createProduct;
    }

    try {
      toggleFinishConfirmLoading();
      // @ts-ignore
      await request({
        ...requestData,
      });
      toggleIsFinishConfirmSuccess();
    } catch (err) {
    } finally {
      toggleFinishConfirmLoading();
    }
  }, [
    form,
    i18nList,
    id,
    mode,
    productPics,
    toggleFinishConfirmLoading,
    toggleIsFinishConfirmSuccess,
  ]);

  const onFinish = useCallback(() => {
    toggleFinishConfirmModalOpen();
  }, [toggleFinishConfirmModalOpen]);

  const [selectRank, setSelectRank] = useState<nameValue>({});
  const [rankChange, setRankChange] = useState(false);

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

  const columns = useMemo(() => {
    return [
      {
        title: <Trans i18nKey={LOCALS.operator} />,
        dataIndex: 'actUsername',
        key: 'actUsername',
      },
      {
        title: <Trans i18nKey={LOCALS.operation_time} />,
        dataIndex: 'actCreateAt',
        key: 'actCreateAt',
        render: (actCreateAt: string) =>
          actCreateAt ? dayjs(actCreateAt).format('YYYY-MM-DD HH:mm:ss') : '-',
      },
      {
        title: <Trans i18nKey={LOCALS.option} />,
        dataIndex: 'actAction',
        key: 'actAction',
        render: (
          actAction: string,
          {
            actDetail,
          }: {
            actDetail?: string;
          }
        ) => {
          if (!actDetail) {
            return <div>{actAction}</div>;
          }

          try {
            const detailObj = JSON.parse(actDetail);

            if (!detailObj.price) {
              return <div>{actAction}</div>;
            }

            return (
              <div>
                <span>{actAction}</span>
                <span className="text-red-700">
                  {!!detailObj.price?.from && (
                    <span className="ml-4">
                      price from {detailObj.price?.from.toLocaleString()}
                    </span>
                  )}
                  {!!detailObj.price?.to && (
                    <span className="ml-4">
                      price to {detailObj.price?.to.toLocaleString()}
                    </span>
                  )}
                </span>
              </div>
            );
          } catch (err) {
            return <div>{actAction}</div>;
          }
        },
      },
      {
        title: <Trans i18nKey={LOCALS.details} />,
        dataIndex: 'actDetail',
        key: 'actDetail',
        render: (actDetail: string) => {
          return (
            <Button
              onClick={() => {
                if (!actDetail) {
                  message.warning('no details');
                  return;
                }

                setActivityDetail(actDetail);
              }}
            >
              {i18n.t(LOCALS.details)}
            </Button>
          );
        },
      },
    ];
  }, []);

  // changeList 防止 为空时覆盖
  const [changeList, setChangeList] = useState({
    nameChage: false,
    rankChage: false,
    colorChange: false,
    materialChange: false,
    hardwareChange: false,
    stampChange: false,
    collectionsChange: false,
    brandNameChange: false,
  });
  const name = Form.useWatch('name', {
    form,
    preserve: true,
  });
  const attrColorArr = Form.useWatch('attrColorArr', {
    form,
    preserve: true,
  });
  const oldProductSn = Form.useWatch('description', {
    form,
    preserve: true,
  });

  const [sameOldProductSnProductList, setSameOldProductSnProductList] =
    useState<PmsProductEs[]>([]);
  useEffect(() => {
    if (oldProductSn) {
      console.log(oldProductSn);
      getProductListNew({
        pageNum: 1,
        pageSize: 100,
        oldProductSn,
      }).then((res) => {
        if (!id) {
          setSameOldProductSnProductList(res.list);
        } else {
          setSameOldProductSnProductList(
            res.list.filter((i) => {
              return i.id !== Number(id);
            })
          );
        }
      });
    }
  }, [id, oldProductSn]);

  // 生成色系
  useEffect(() => {
    if (attrColorArr && attrColorArr.length) {
      if (attrColorArr.length > 1) {
        // 多个则为 拼色
        form.setFieldValue('attrColors', 'multi-color');
        return;
      }
      const color = colorSelectOptions.find(
        (d) => d.value === attrColorArr[0]
      ) as SelectOptionWarp;
      if (color) {
        form.setFieldValue(
          'attrColors',
          color?.refProperty1 || color?.refProperty2
        );
      }
    }
  }, [attrColorArr, colorSelectOptions, form]);
  // 生成列表标题
  useEffect(() => {
    if (!changeList.colorChange && !changeList.nameChage) return;
    let subTitle = {
      ja: '',
      en: '',
      zh: '',
      zh_TW: '',
    };
    if (name) {
      subTitle.ja += name.ja ? name.ja : '';
      subTitle.en += name.en ? name.en : '';
      subTitle.zh += name.zh ? name.zh : '';
      subTitle.zh_TW += name.zh_TW ? name.zh_TW : '';
    }
    if (attrColorArr && attrColorArr.length) {
      // 属性间分隔符
      Object.keys(subTitle).forEach((key) => {
        const d = subTitle[key as langageInputType];
        subTitle[key as langageInputType] += d ? ' ' : '';
      });
      const colorfilter: SelectOptionWarp[] = colorSelectOptions.filter(
        ({ value }) => attrColorArr.includes(value as string)
      );
      subTitle = handleAppend(colorfilter, subTitle);
    }
    form.setFieldValue('subTitle', subTitle);
  }, [
    attrColorArr,
    changeList.colorChange,
    changeList.nameChage,
    colorSelectOptions,
    form,
    mode,
    name,
  ]);

  const attrMaterialArr = Form.useWatch('attrMaterialArr', {
    form,
    preserve: true,
  });
  const attrHardwareArr = Form.useWatch('attrHardwareArr', {
    form,
    preserve: true,
  });
  // 生成列表小标题
  useEffect(() => {
    // if (mode !== 'add') return;
    if (!changeList.materialChange && !changeList.hardwareChange) return;
    let note = {
      ja: '',
      en: '',
      zh: '',
      zh_TW: '',
    };
    if (attrMaterialArr && attrMaterialArr.length) {
      const materialfilter: CascaderOptionWarp[] = [];
      attrMaterialArr.forEach((d: any) => {
        const target = findCascaderOptionById(
          d[d.length - 1],
          materialCascaderOptions
        )!;
        materialfilter.push(target);
      });
      note = handleAppend(materialfilter, note);
      // 属性间分隔符
      Object.keys(note).forEach((key) => {
        note[key as langageInputType] += ' ';
      });
    }
    if (attrHardwareArr && attrHardwareArr.length) {
      const hardwarefilter: SelectOptionWarp[] = hardwareSelectOptions.filter(
        ({ value }) =>
          value !== 'none' && attrHardwareArr.includes(value as string)
      );
      note = handleAppend(hardwarefilter, note);
    }
    form.setFieldValue('note', note);
  }, [
    attrMaterialArr,
    attrHardwareArr,
    colorSelectOptions,
    form,
    mode,
    name,
    materialCascaderOptions,
    hardwareSelectOptions,
    changeList.materialChange,
    changeList.hardwareChange,
  ]);
  const collectionsArr = Form.useWatch('collectionsArr', {
    form,
    preserve: true,
  });
  const attrStamp = Form.useWatch('attrStamp', {
    form,
    preserve: true,
  });
  const rank = Form.useWatch('rank', {
    form,
    preserve: true,
  });
  const brandName = Form.useWatch('brandName', {
    form,
    preserve: true,
  });
  // 生成详细页标题
  useEffect(() => {
    // if (mode !== 'add') return;
    if (
      !changeList.rankChage &&
      !changeList.collectionsChange &&
      !changeList.nameChage &&
      !changeList.colorChange &&
      !changeList.materialChange &&
      !changeList.hardwareChange &&
      !changeList.stampChange &&
      !changeList.stampChange
    )
      return;
    let detailTitle = {
      ja: '',
      en: '',
      zh: '',
      zh_TW: '',
    };
    const t = rankListSort.find((d) => d.value === rank) as SelectOptionWarp;
    if (t) {
      const { labelCn, labelEn, labelJa, labelTw } = t;
      detailTitle.ja += labelJa || '';
      detailTitle.en += labelEn || '';
      detailTitle.zh += labelCn || '';
      detailTitle.zh_TW += labelTw || '';
      const brand =
        BrandList.find((d) => d.value === brandName) || DefaultBrand;
      Object.keys(detailTitle).forEach((key) => {
        if (key === LANGAGE_INPUT_MAP.EN && labelEn) {
          detailTitle[key as langageInputType] += brand?.descEn;
        } else if (key === LANGAGE_INPUT_MAP.JA && labelJa) {
          detailTitle[key as langageInputType] += brand?.descJa;
        } else if (key === LANGAGE_INPUT_MAP.ZH_TW && labelTw) {
          detailTitle[key as langageInputType] += brand?.descZhTw;
        } else if (key === LANGAGE_INPUT_MAP.ZH && labelCn) {
          detailTitle[key as langageInputType] += brand?.descZh;
        }
      });
    }
    if (collectionsArr && collectionsArr.length) {
      // 馬蹄印定制
      if (collectionsArr.includes('Special Order')) {
        const collections: SelectOptionWarp = collectionSelectOptions.find(
          (d) => d.value === 'Special Order'
        )!;
        detailTitle.ja += collections.labelJa;
        detailTitle.en += collections.labelEn;
        detailTitle.zh += collections.labelCn;
        detailTitle.zh_TW += collections.labelTw;
        // 属性间分隔符
        Object.keys(detailTitle).forEach((key) => {
          if (key === LANGAGE_INPUT_MAP.EN) {
            detailTitle[key as langageInputType] += ' ';
          } else {
            detailTitle[key as langageInputType] += ' ';
          }
        });
      }
      // 限量收藏款 优先级最高
      if (collectionsArr.includes('Limited Edition')) {
        const collections: SelectOptionWarp = collectionSelectOptions.find(
          (d) => d.value === 'Limited Edition'
        )!;
        detailTitle.ja += collections.labelJa;
        detailTitle.en += collections.labelEn;
        detailTitle.zh += collections.labelCn;
        detailTitle.zh_TW += collections.labelTw;
        // 属性间分隔符
        Object.keys(detailTitle).forEach((key) => {
          if (key === LANGAGE_INPUT_MAP.EN) {
            detailTitle[key as langageInputType] += ' ';
          } else {
            detailTitle[key as langageInputType] += ' ';
          }
        });
      }
    }
    if (name) {
      detailTitle.ja += name.ja ? `${name.ja} ` : '';
      detailTitle.en += name.en ? `${name.en} ` : '';
      detailTitle.zh += name.zh ? `${name.zh} ` : '';
      detailTitle.zh_TW += name.zh_TW ? `${name.zh_TW} ` : '';
    }
    if (attrColorArr && attrColorArr.length) {
      const colorfilter: SelectOptionWarp[] = colorSelectOptions.filter(
        ({ value }) => attrColorArr.includes(value as string)
      );
      detailTitle = handleAppend(colorfilter, detailTitle);
      Object.keys(detailTitle).forEach((key) => {
        detailTitle[key as langageInputType] += ' ';
      });
    }
    if (attrMaterialArr && attrMaterialArr.length) {
      const materialfilter: CascaderOptionWarp[] = [];
      attrMaterialArr.forEach((d: any) => {
        const target = findCascaderOptionById(
          d[d.length - 1],
          materialCascaderOptions
        )!;
        materialfilter.push(target);
      });
      detailTitle = handleAppend(materialfilter, detailTitle);
      // 属性间分隔符
      Object.keys(detailTitle).forEach((key) => {
        detailTitle[key as langageInputType] += ' ';
      });
    }
    if (attrHardwareArr && attrHardwareArr.length) {
      const hardwarefilter: SelectOptionWarp[] = hardwareSelectOptions.filter(
        ({ value }) =>
          value !== 'none' && attrHardwareArr.includes(value as string)
      );
      detailTitle = handleAppend(hardwarefilter, detailTitle);
      // 属性间分隔符
      Object.keys(detailTitle).forEach((key) => {
        detailTitle[key as langageInputType] += ' ';
      });
    }
    if (attrStamp) {
      const stamp: SelectOptionWarp = stampListSort.find(
        (d) => d.value !== 'none' && d.value === attrStamp
      )!;
      if (stamp) {
        detailTitle.ja += stamp.labelJa;
        detailTitle.en += stamp.labelEn;
        detailTitle.zh += stamp.labelCn;
        detailTitle.zh_TW += stamp.labelTw;
      }
    }
    form.setFieldValue('detailTitle', detailTitle);
  }, [
    attrColorArr,
    attrHardwareArr,
    attrMaterialArr,
    colorSelectOptions,
    form,
    hardwareSelectOptions,
    materialCascaderOptions,
    mode,
    name,
    collectionsArr,
    collectionSelectOptions,
    attrStamp,
    stampListSort,
    rankListSort,
    rank,
    changeList.rankChage,
    changeList.collectionsChange,
    changeList.nameChage,
    changeList.colorChange,
    changeList.materialChange,
    changeList.hardwareChange,
    changeList.stampChange,
    BrandList,
    brandName,
    DefaultBrand,
  ]);
  const currency = Form.useWatch('currency', { form });
  const costPrice = Form.useWatch('costPrice', { form });

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        layout="horizontal"
        initialValues={{ brandName: 'Hermes' }}
        onValuesChange={() => {
          setIsChange(true);
        }}
      >
        {/* fix: 重新编辑商品，订单id和销售时间被清空 */}
        <Form.Item hidden name="orderId">
          <Input />
        </Form.Item>
        <Form.Item hidden name="soldTime">
          <Input />
        </Form.Item>

        {id && (
          <div className="text-center mb-4 text-lg font-bold">
            <Trans i18nKey={LOCALS.sales_product_id} />：{id}
            {productSource?.recycleOrder?.email && (
              <span className="ml-4">
                <Trans i18nKey={LOCALS.rzdMoKAcEc} />：
                <Link
                  to={`/ums/member-view/${productSource.recycleOrder.memberId}`}
                  target="_blank"
                >
                  {productSource.recycleOrder.email}
                </Link>
              </span>
            )}
          </div>
        )}

        <Row gutter={18}>
          <Col span={12}>
            <Form.Item
              name="productSn"
              label={<Trans i18nKey={LOCALS.product_sn} />}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="owner" label={<Trans i18nKey={LOCALS.staff} />}>
              <Select
                options={staffSelectOptions.map((option) => {
                  return {
                    value: String(option.value),
                    label: option.label,
                  };
                })}
              ></Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={18}>
          <Col span={12}>
            <Form.Item
              name="productCategoryIds"
              label={<Trans i18nKey={LOCALS.product_category} />}
              rules={[
                {
                  required: true,
                  message: <Trans i18nKey={LOCALS.required_field} />,
                },
              ]}
            >
              <Cascader
                allowClear={false}
                onChange={(value) => {
                  const target = findCascaderOptionById(
                    value[value.length - 1],
                    productCategoryCascaderOptions
                  );
                  setChangeList((old) => ({ ...old, nameChage: true }));
                  if (target) {
                    const {
                      nameJa,
                      nameEn,
                      nameZh,
                      nameTw,
                      sizeJa,
                      sizeEn,
                      sizeZh,
                      sizeTw,
                    } = target;
                    form.setFieldValue('name', {
                      ja: nameJa,
                      en: nameEn,
                      zh: nameZh,
                      zh_TW: nameTw,
                    });

                    form.setFieldValue('attrSize', {
                      ja: sizeJa,
                      en: sizeEn,
                      zh: sizeZh,
                      zh_TW: sizeTw || sizeZh,
                    });
                  }

                  const newProductCategoryIdFirstLevel = +value[0];

                  // 在商品分类第一级变了的情况下，需要重置 attrMaterialArr materialCascaderOptions collectionsArr
                  if (
                    newProductCategoryIdFirstLevel !==
                    productCategoryIdFirstLevel
                  ) {
                    setProductCategoryIdFirstLevel(
                      newProductCategoryIdFirstLevel
                    );
                    setMaterialCascaderOptions(
                      [
                        ...materialCascaderOptionsMap[
                          newProductCategoryIdFirstLevel
                        ],
                      ].sort((a, b) => a.sort! - b.sort!) || []
                    );
                    form.setFieldValue('attrMaterialArr', []);
                    form.setFieldValue('collectionsArr', []);
                  }
                }}
                options={productCategoryCascaderOptions}
                showSearch={{ filter: CascaderFilter }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="attrType"
              label={<Trans i18nKey={LOCALS.product_type} />}
              rules={[{ required: true }]}
            >
              <Select options={typeSelectOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={18}>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 3 }}
              label={<Trans i18nKey={LOCALS.product_name} />}
              name={'name'}
              rules={[
                {
                  validator: (_, value) => {
                    if (value && !Object.values(value).every((d) => d)) {
                      return Promise.reject(
                        <Trans i18nKey={LOCALS.please_enter} />
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <ProductName
                inputLang={inputLang}
                onChange={() => {
                  setChangeList((old) => ({ ...old, nameChage: true }));
                }}
                mode={mode}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={18}>
          <Col span={12}>
            <Form.Item
              name="stockPlace"
              label={<Trans i18nKey={LOCALS.stock_place} />}
              rules={[
                {
                  required: true,
                  message: <Trans i18nKey={LOCALS.required_field} />,
                },
              ]}
            >
              <Select
                options={STOCK_PLACE_OPTION_LIST}
                onChange={(e) => {
                  let currency = '';
                  if (e === STOCK_PLACE_MAP.JAPAN) {
                    currency = CURRENCY_MAP.JPY;
                  } else if (e === STOCK_PLACE_MAP.HONGKONG) {
                    currency = CURRENCY_MAP.HKD;
                  } else if (
                    e === STOCK_PLACE_MAP.SINGAPORE_ASU ||
                    e === STOCK_PLACE_MAP.SINGAPORE_GX
                  ) {
                    currency = CURRENCY_MAP.SGD;
                  }
                  form.setFieldValue('currency', currency);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="brandName"
              label={<Trans i18nKey={LOCALS.brand} />}
            >
              <Radio.Group
                optionType="button"
                buttonStyle="solid"
                onChange={() => {
                  setChangeList((old) => ({ ...old, nameChage: true }));
                }}
              >
                {BrandList.map(({ value, label }) => {
                  return (
                    <Radio value={value} key={value}>
                      {label}
                    </Radio>
                  );
                })}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={18}>
          <Col span={12}>
            <Form.Item
              label={<Trans i18nKey={LOCALS.selling_price} />}
              labelCol={{ span: 6 }}
              className="mb-0"
              required
            >
              <div className="flex gap-4">
                <div className="flex shrink-0 flex-1">
                  <Form.Item
                    name="currency"
                    rules={[
                      {
                        required: true,
                        message: <Trans i18nKey={LOCALS.required_field} />,
                      },
                    ]}
                    className="w-[100px] shrink-0"
                  >
                    <Select options={CURRENCY_OPTION_LIST} disabled />
                  </Form.Item>
                  <Form.Item
                    name="price"
                    rules={[
                      {
                        required: true,
                        message: <Trans i18nKey={LOCALS.required_field} />,
                      },
                    ]}
                    className="w-full"
                  >
                    <InputNumber
                      className="w-full"
                      min={0}
                      max={99999999}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={(value) =>
                        value!.replace(/\$\s?|(,*)/g, '') as any
                      }
                      onChange={(e) => {
                        if (e) {
                          form.setFieldValue(
                            'priceWithoutTax',
                            priceToWithoutTax(e)
                          );

                          // 如果库存状态是已入库，并且价格发生了改变，则自动将库存状态设置为可售
                          // if (
                          //   form.getFieldValue('stockStatus') ===
                          //   PMS_PRODUCT_STOCK_STATUS.STOCKED
                          // ) {
                          //   form.setFieldValue(
                          //     'stockStatus',
                          //     PMS_PRODUCT_STOCK_STATUS.FOR_SALE
                          //   );
                          // }
                        }
                      }}
                    />
                  </Form.Item>
                </div>

                {currency === CURRENCY_MAP.JPY && (
                  <Form.Item
                    name="priceWithoutTax"
                    label={<Trans i18nKey={LOCALS.czbRYWhFdZ} />}
                    className="shrink-0 flex-1"
                  >
                    <InputNumber
                      className="w-full"
                      min={0}
                      max={90909089}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={(value) =>
                        value!.replace(/\$\s?|(,*)/g, '') as any
                      }
                      onChange={(e) => {
                        if (e) {
                          form.setFieldValue('price', priceToWithTax(e));

                          // 如果库存状态是已入库，并且价格发生了改变，则自动将库存状态设置为可售
                          // if (
                          //   form.getFieldValue('stockStatus') ===
                          //   PMS_PRODUCT_STOCK_STATUS.STOCKED
                          // ) {
                          //   form.setFieldValue(
                          //     'stockStatus',
                          //     PMS_PRODUCT_STOCK_STATUS.FOR_SALE
                          //   );
                          // }
                        }
                      }}
                    />
                  </Form.Item>
                )}
              </div>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<Trans i18nKey={LOCALS.purchase_price} />}
              labelCol={{ span: 6 }}
              className="mb-0"
              required
            >
              <Space.Compact block>
                <Form.Item name="currency" className="w-[100px] shrink-0">
                  <Select options={CURRENCY_OPTION_LIST} disabled />
                </Form.Item>
                <Form.Item
                  name="costPrice"
                  className="w-full"
                  rules={[
                    {
                      required: true,
                      message: <Trans i18nKey={LOCALS.required_field} />,
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    max={99999999}
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                    addonAfter={
                      currency === CURRENCY_MAP.JPY ? (
                        <span>
                          {<Trans i18nKey={LOCALS.czbRYWhFdZ} />}：
                          {(costPrice
                            ? priceToWithoutTax(costPrice)
                            : 0
                          ).toLocaleString()}
                        </span>
                      ) : null
                    }
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<Trans i18nKey={LOCALS.reference_price} />}
              labelCol={{ span: 6 }}
              className="mb-0"
            >
              <Space.Compact block>
                <Form.Item name="currency" className="w-[100px] shrink-0">
                  <Select options={CURRENCY_OPTION_LIST} disabled />
                </Form.Item>
                <Form.Item name="referencePrice" className="w-full">
                  <InputNumber
                    className="w-full"
                    max={100000000}
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<Trans i18nKey={LOCALS.uMihwkqqts} />}
              labelCol={{ span: 6 }}
              className="mb-0"
              name="stockStatus"
            >
              <Select disabled options={stockStatusOptions}></Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={18}>
          <Col span={12}>
            <Form.Item
              name="sourceType"
              label={<Trans i18nKey={LOCALS.product_source} />}
            >
              <Radio.Group>
                {PRODUCT_SOURCE_TYPE_OPTION_LIST.map(({ value, label }) => {
                  return (
                    <Radio value={value} key={value}>
                      {label}
                    </Radio>
                  );
                })}
              </Radio.Group>
            </Form.Item>
          </Col>
          {/* <Col span={12}>
            <Form.Item
              name="supportCrypto"
              label={<Trans i18nKey={LOCALS.support_cryptocurrency_payments} />}
            >
              <Radio.Group>
                <Radio value={0}>
                  <Trans i18nKey={LOCALS.no} />
                </Radio>
                <Radio value={1}>
                  <Trans i18nKey={LOCALS.yes} />
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col> */}
        </Row>

        <Row gutter={18}>
          <Col span={12}>
            <Form.Item
              name="promotionType"
              label={<Trans i18nKey={LOCALS.on_sale} />}
            >
              <Radio.Group>
                <Radio value={PROMOTION_TYPE_MAP.NORMAL}>
                  <Trans i18nKey={LOCALS.no} />
                </Radio>
                <Radio value={PROMOTION_TYPE_MAP.SPECIAL}>
                  <Trans i18nKey={LOCALS.yes} />
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item dependencies={['promotionType']} noStyle>
              {({ getFieldValue }) => {
                const promotionType = getFieldValue('promotionType');

                if (promotionType === PROMOTION_TYPE_MAP.SPECIAL) {
                  return (
                    <Form.Item
                      name="originalPrice"
                      label={<Trans i18nKey={LOCALS.original_price} />}
                    >
                      <InputNumber
                        className="w-full"
                        min={0}
                        max={99999999}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        parser={(value) =>
                          value!.replace(/\$\s?|(,*)/g, '') as any
                        }
                      />
                    </Form.Item>
                  );
                }

                return null;
              }}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={18}>
          <Col span={12}>
            <Form.Item
              name="description"
              label={<Trans i18nKey={LOCALS.SYLYoWTeQq} />}
            >
              <Input.TextArea
                placeholder={i18n.t(LOCALS.zYZFfigLSj) || ''}
                rows={4}
              />
            </Form.Item>

            {!!sameOldProductSnProductList.length && (
              <Form.Item
                label={
                  <div className="text-red-500">
                    <Trans i18nKey={LOCALS.AdcTXGDchO} />
                  </div>
                }
              >
                {sameOldProductSnProductList.map((i) => {
                  return (
                    <div key={i.id}>
                      <a
                        href={`/pms/product-view/${i.id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {i.name}
                      </a>
                    </div>
                  );
                })}
              </Form.Item>
            )}
          </Col>
          <Col span={12}>
            <Form.Item
              name="remark"
              label={<Trans i18nKey={LOCALS.remark} />}
              labelCol={{ span: 6 }}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Row gutter={18}>
          <Col span={12}>
            <Form.Item
              name="rank"
              label={<Trans i18nKey={LOCALS.rank} />}
              rules={[
                {
                  required: true,
                  message: <Trans i18nKey={LOCALS.required_field} />,
                },
              ]}
            >
              <Select
                options={rankListSort}
                onChange={(e) => {
                  setChangeList((old) => ({ ...old, rankChage: true }));
                  const t: SelectOptionWarp = rankSelectOptions.find(
                    (d) => e === d.value
                  )!;
                  const attrRankDesc: nameValue =
                    form.getFieldValue('attrRankDesc');
                  if (t) {
                    const rank = {
                      zh: t.labelCn,
                      zh_TW: t.labelTw,
                      ja: t.labelJa,
                      en: t.labelEn,
                    };
                    setSelectRank({ ...rank });
                    if (attrRankDesc && Object.keys(attrRankDesc).length) {
                      let attrRankDescAppend: nameValue = {
                        ja: handleTextRank(
                          attrRankDesc.ja || '',
                          t.labelJa || ''
                        ),
                        zh: handleTextRank(
                          attrRankDesc.zh || '',
                          t.labelCn || ''
                        ),
                        zh_TW: handleTextRank(
                          attrRankDesc.zh_TW || '',
                          t.labelTw || ''
                        ),
                        en: handleTextRank(
                          attrRankDesc.en || '',
                          t.labelEn || ''
                        ),
                      };
                      form.setFieldValue('attrRankDesc', attrRankDescAppend);
                    } else {
                      form.setFieldValue('attrRankDesc', { ...rank });
                    }
                  }

                  setRankChange(true);
                }}
              ></Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={18}>
          <Col span={24}>
            <Form.Item
              name="attrRankDesc"
              label={<Trans i18nKey={LOCALS.rank_desc} />}
              labelCol={{ span: 3 }}
            >
              <RankDesc
                inputLang={inputLang}
                rank={selectRank}
                mode={mode}
                rankChange={rankChange}
                rankDescription={productSource?.rankDescription}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          labelCol={{ span: 3 }}
          name="attrColors"
          label={<Trans i18nKey={LOCALS.hue} />}
        >
          <Select options={hueSelectOptions} />
        </Form.Item>

        <Row gutter={18}>
          <Col span={12}>
            <Form.Item
              name="attrColorArr"
              label={<Trans i18nKey={LOCALS.color} />}
            >
              <Select
                mode="multiple"
                showSearch
                options={colorSelectOptions}
                filterOption={SelectFilter}
                onChange={() =>
                  setChangeList((old) => ({ ...old, colorChange: true }))
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="attrColorRemark"
              label={<Trans i18nKey={LOCALS.color_remark} />}
            >
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={18}>
          <Col span={12}>
            <Form.Item
              name="attrMaterialArr"
              label={<Trans i18nKey={LOCALS.material} />}
            >
              <Cascader
                options={materialCascaderOptions}
                multiple
                showSearch={{ filter: CascaderFilter }}
                onChange={(e) => {
                  setChangeList((old) => ({ ...old, materialChange: true }));
                  if (e && e.length) {
                    const list: string[] = [];
                    e.forEach((d: any) => {
                      if (d[0]) list.push(d[0]);
                    });
                    if (list.includes('exotic-skin')) {
                      form.setFieldValue('facebookEnabled', 0);
                    } else {
                      form.setFieldValue('facebookEnabled', 1);
                    }
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="attrMaterialRemark"
              label={<Trans i18nKey={LOCALS.material_remark} />}
            >
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={18}>
          <Col span={12}>
            <Form.Item
              name="attrHardwareArr"
              label={<Trans i18nKey={LOCALS.hardware} />}
            >
              <Select
                mode="multiple"
                options={hardwareListSort}
                showSearch
                filterOption={SelectFilter}
                onChange={() =>
                  setChangeList((old) => ({ ...old, hardwareChange: true }))
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="attrHardwareRemark"
              label={<Trans i18nKey={LOCALS.hardware_remark} />}
            >
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={18}>
          <Col span={12}>
            <Form.Item
              name="attrStamp"
              label={<Trans i18nKey={LOCALS.stamp} />}
            >
              <Select
                showSearch
                options={stampListSort}
                filterOption={SelectFilter}
                onChange={() =>
                  setChangeList((old) => ({ ...old, stampChange: true }))
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="attrStampRemark"
              label={<Trans i18nKey={LOCALS.stamp_remark} />}
            >
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={18}>
          <Col span={24}>
            <Form.Item
              name="attrAccessoryArr"
              label={<Trans i18nKey={LOCALS.accessories} />}
              labelCol={{ span: 3 }}
            >
              <Checkbox.Group options={accessoryListSort} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="attrSize"
              label={<Trans i18nKey={LOCALS.measurement} />}
              labelCol={{ span: 3 }}
            >
              <RemarksDesc inputLang={inputLang} />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Row gutter={18}>
          <Col span={24}>
            <Form.Item
              name="subTitle"
              label={<Trans i18nKey={LOCALS.list_title} />}
              labelCol={{ span: 3 }}
            >
              <RemarksDesc inputLang={inputLang} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="note"
              label={<Trans i18nKey={LOCALS.list_remark} />}
              labelCol={{ span: 3 }}
            >
              <RemarksDesc inputLang={inputLang} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          labelCol={{ span: 3 }}
          name="detailTitle"
          label={<Trans i18nKey={LOCALS.detail_title} />}
        >
          <RemarksDesc inputLang={inputLang} />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 3 }}
          name="collectionsArr"
          label={<Trans i18nKey={LOCALS.collections} />}
        >
          <Checkbox.Group
            onChange={() =>
              setChangeList((old) => ({ ...old, collectionsChange: true }))
            }
          >
            {collectionSelectOptions.map(({ value, label }) => {
              return (
                <Checkbox value={value} key={value}>
                  {label}
                </Checkbox>
              );
            })}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          labelCol={{ span: 3 }}
          name="facebookEnabled"
          label={<Trans i18nKey={LOCALS.facebookEnabled} />}
        >
          <Switch
            checkedChildren={<Trans i18nKey={LOCALS.enable} />}
            unCheckedChildren={<Trans i18nKey={LOCALS.disable} />}
          />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 3 }}
          label={<Trans i18nKey={LOCALS.product_pictures} />}
        >
          <ImageUploader
            onChange={setProductPics}
            imgList={productPics}
            mode="multiple"
          />
        </Form.Item>

        <Form.Item className="relative">
          <div className="flex justify-center">
            <Space>
              <Button onClick={onBack}>
                <Trans i18nKey={LOCALS.back} />
              </Button>

              {(mode === 'edit' || mode === 'add') && (
                <Button type="primary" htmlType="submit">
                  <Trans i18nKey={LOCALS.submit} />
                </Button>
              )}
            </Space>
          </div>
          {/* <div className="absolute top-0">
            <Button onClick={onTranslate}>
              <Trans i18nKey={LOCALS.one_click_translation} />
            </Button>
          </div> */}
          <Row>
            <Col span={4}></Col>
            <Col span={24} pull={4}></Col>
          </Row>
        </Form.Item>
      </Form>
      <Divider />
      <div className="mb-4 text-center">
        {findLabelByValue(stockInfo.publishStatus, PUBLISH_STATUS_OPTION_LIST)}{' '}
        / {stockInfo.stock}
      </div>

      <h3>{i18n.t(LOCALS.rrooMUILfK)}</h3>
      {!!id && <ProductStockStatusHistory productId={id} />}

      <h3 className="mt-4">{i18n.t(LOCALS.operate_histories)}</h3>
      <Table
        pagination={false}
        columns={columns}
        rowKey={'actId'}
        dataSource={pmsProductActivityList?.reverse() || []}
      ></Table>

      <Modal
        title={i18n.t(LOCALS.details)}
        open={!!activityDetail}
        onCancel={() => {
          setActivityDetail('');
        }}
      >
        <div>
          {activityDetail && <JSONViewer data={JSON.parse(activityDetail)} />}
        </div>
      </Modal>

      <Modal
        title={<Trans i18nKey={LOCALS.confirm_submit} />}
        open={finishConfirmModalOpen}
        onCancel={
          isFinishConfirmSuccess ? onBack : toggleFinishConfirmModalOpen
        }
        footer={
          <div className="flex gap-2 justify-end">
            {isFinishConfirmSuccess ? (
              <>
                <Button onClick={onBack} type="primary">
                  <Trans i18nKey={LOCALS.back} />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={toggleFinishConfirmModalOpen}>
                  <Trans i18nKey={LOCALS.cancel} />
                </Button>
                <Button
                  type="primary"
                  onClick={handleFinishConfirmOk}
                  loading={finishConfirmLoading}
                >
                  Ok
                </Button>
              </>
            )}
          </div>
        }
      >
        {isFinishConfirmSuccess && (
          <div className="text-green-500 flex items-center justify-center">
            <CheckCircleOutlined style={{ fontSize: 64 }} />
          </div>
        )}
      </Modal>
    </Spin>
  );
};

export default ProductAddEdit;
