import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Cascader,
  Select,
  Radio,
  Checkbox,
  InputNumber,
  Space,
  Button,
  Divider,
} from 'antd';
import i18n from 'i18n';
import LOCALS from 'commons/locals';
import useProductFormData from 'commons/hooks/useProductFormDataV2';
import RenderLabel from 'components/recycling-consignment/render-label';
import {
  CascaderOption,
  CascaderOptionWarp,
  SelectOption,
  SelectOptionWarp,
  DefaultOptionType,
} from 'types/base';
import type { FormInstance } from 'antd/es/form';
import {
  OmsRecycleOrderCreateProducts,
  OmsRecycleOrderCreateDTO,
  OmsRecycleOrderSNSCreateDTO,
} from 'types/oms';
import findCascaderOptionById from 'utils/findCascaderOptionById';
import UploadImage from '../upload-image';
import RankDesc from 'components/product-add-edit/rank-desc';
import ProductName from 'components/product-add-edit/product-name';
import {
  nameValue,
  langageInputType,
  LANGAGE_INPUT_MAP,
} from 'components/product-add-edit/utils';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { LANGUAGE_MAP, CURRENCY_MAP } from 'commons/options';
import { CurrencyOption } from 'constants/RecyclingConsignment';
import { selectUserInfo } from 'store/slices/userInfoSlice';
import { useSelector } from 'react-redux';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { OmsRecycleOrderProductI18n } from 'types/oms';
import MinMaxValuation from 'components/recycling-consignment/min-max-valuation';
import UploadImageComponents from 'components/upload-image';
import getCascaderFilter from 'utils/getCascaderFilter';
import {
  setRecyclingConsignmentStore,
  getRecyclingConsignmentStore,
  ITEM_NAME_MAP,
} from '../utils';
import useBrandList, { BrandType } from 'commons/hooks/use-brand-list';

interface Props {
  form: FormInstance<any>;
  onChange: (data: OmsRecycleOrderCreateDTO) => void;
  type: 'intention' | 'contract';
  orderType?: number;
  createdFrom?: number;
}

export type OmsRecycleOrderCreateProducts_Form = (
  | OmsRecycleOrderCreateDTO
  | OmsRecycleOrderSNSCreateDTO
) & {
  color: string[];
  accessory: string[];
  file: any;
  productCategoryId: number[];
  material: string[][];
  hardware: string[];
  recycleValue?: number;
  saleValue?: number;
  attrRankDesc: nameValue;
  name: nameValue;
  recyclePrice: number[];
  salePrice: number[];
  guestRemarks: string;
  brandName: string;
};

const ProductInfo = (props: Props) => {
  const { form, type, onChange, orderType, createdFrom } = props;
  const { BrandList, DefaultBrand } = useBrandList();
  const {
    colorList,
    rankList,
    stampList,
    hardwareList,
    accessoryList,
    materialCascaderOptionsMap,
    productCategoryList,
  } = useProductFormData();

  const handleData = useCallback(
    (products: OmsRecycleOrderCreateProducts_Form[]) => {
      let payloadList: OmsRecycleOrderCreateProducts[] = [];
      products.forEach((value: OmsRecycleOrderCreateProducts_Form) => {
        if (value) {
          const {
            color,
            firstValuationShopRemark,
            firstValuationStock,
            firstValuationStockRemark,
            hardware,
            material,
            rank,
            stamp = '',
            productCategoryId,
            firstValuationProductAccessories = '',
            accessory,
            file,
            currency,
            recycleValue,
            saleValue,
            attrRankDesc,
            recyclePrice,
            salePrice,
            guestRemarks,
            name,
            brandName,
          } = value;
          // 配件
          const accessoryStr: string[] = [];
          if (accessory) {
            accessory.forEach((d: string) => {
              const t = accessoryList.find((dd) => dd.value === d);
              if (t && t.value !== 'none') accessoryStr.push(t.label);
            });
          }
          // color
          const colorStr: string[] = [];
          const colorSelectOption: SelectOptionWarp[] = [];
          if (color && color.length) {
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
          if (
            productCategoryId &&
            Object.keys(materialCascaderOptionsMap).length
          ) {
            prodCateId = productCategoryId[productCategoryId.length - 1];
            productCategoryData = findCascaderOptionById(
              prodCateId,
              productCategoryList,
            );
            materialList = materialCascaderOptionsMap[productCategoryId[0]];
          }
          // material
          let facebookEnabled = 1;
          const material_: string[] = [];
          const materialStr: string[] = [];
          const materialSelectOption: CascaderOptionWarp[] = [];
          if (material) {
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
          if (hardware) {
            hardware.forEach((d: string) => {
              const t = hardwareList.find((dd) => dd.value === d);
              if (t && t.value !== 'none') {
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
          if (stamp) {
            stampSelectOption = stampList.find(
              (d) => d.value === stamp && d.value !== 'none',
            );
          }
          // brandName
          let brand =
            BrandList.find((d) => d.value === brandName) || DefaultBrand;

          const nameZh = name?.zh;
          const sizeZh = productCategoryData?.sizeZh;
          const colorZh = colorSelectOption.map((d) => d.labelCn)?.join(' ');
          const materialZh = materialSelectOption
            .map((d) => d.labelCn)
            .join(' ');
          const hardwareZh = hardwareSelectOption
            .map((d) => d.labelCn)
            .join(' ');
          const rankZh = rankSelectOption?.labelCn;
          const stampZh = stampSelectOption?.labelCn || '';
          const I18nCn: OmsRecycleOrderProductI18n = {
            name: nameZh,
            attrSize: sizeZh,
            subTitle: `${nameZh} ${colorZh}`,
            note: `${materialZh} ${hardwareZh}`,
            detailTitle: `${rankZh} ${brand?.descZh} ${nameZh} ${colorZh} ${materialZh} ${hardwareZh} ${stampZh}`,
            attrRankDesc: attrRankDesc ? attrRankDesc.zh : '',
          };

          const nameTw = name?.zh_TW;
          const sizeTw =
            productCategoryData?.sizeTw || productCategoryData?.sizeZh;
          const colorTw = colorSelectOption.map((d) => d.labelTw)?.join(' ');
          const materialTw = materialSelectOption
            .map((d) => d.labelTw)
            .join(' ');
          const hardwareTw = hardwareSelectOption
            .map((d) => d.labelTw)
            .join(' ');
          const rankTw = rankSelectOption?.labelTw;
          const stampTw = stampSelectOption?.labelTw || '';
          const I18nTw: OmsRecycleOrderProductI18n = {
            name: nameTw,
            attrSize: sizeTw,
            subTitle: `${nameTw} ${colorTw}`,
            note: `${materialTw} ${hardwareTw}`,
            detailTitle: `${rankTw} ${brand?.descZhTw} ${nameTw} ${colorTw} ${materialTw} ${hardwareTw} ${stampTw}`,
            attrRankDesc: attrRankDesc ? attrRankDesc.zh_TW : '',
          };

          const nameJa = name?.ja;
          const sizeJa = productCategoryData?.sizeJa;
          const colorJa = colorSelectOption.map((d) => d.labelJa)?.join(' ');
          const materialJa = materialSelectOption
            .map((d) => d.labelJa)
            .join(' ');
          const hardwareJa = hardwareSelectOption
            .map((d) => d.labelJa)
            .join(' ');
          const rankJa = rankSelectOption?.labelJa;
          const stampJa = stampSelectOption?.labelJa || '';
          const I18nJa: OmsRecycleOrderProductI18n = {
            name: nameJa,
            attrSize: sizeJa,
            subTitle: `${nameJa} ${colorJa}`,
            note: `${materialJa} ${hardwareJa}`,
            detailTitle: `${rankJa} ${brand?.descJa} ${nameJa} ${colorJa} ${materialJa} ${hardwareJa} ${stampJa}`,
            attrRankDesc: attrRankDesc ? attrRankDesc.ja : '',
          };

          const nameEn = name?.en;
          const sizeEn = productCategoryData?.sizeEn;
          const colorEn = colorSelectOption.map((d) => d.labelEn)?.join(' ');
          const materialEn = materialSelectOption
            .map((d) => d.labelEn)
            .join(' ');
          const hardwareEn = hardwareSelectOption
            .map((d) => d.labelEn)
            .join(' ');
          const rankEn = rankSelectOption?.labelEn;
          const stampEn = stampSelectOption?.labelEn || '';
          const I18nEn: OmsRecycleOrderProductI18n = {
            name: nameEn,
            attrSize: sizeEn,
            subTitle: `${nameEn} ${colorEn}`,
            note: `${materialEn} ${hardwareEn}`,
            detailTitle: `${rankEn} ${brand?.descEn} ${nameEn} ${colorEn} ${materialEn} ${hardwareEn} ${stampEn}`,
            attrRankDesc: attrRankDesc ? attrRankDesc.en : '',
          };

          const stampStr =
            stampList.find((d) => d.value === stamp)?.label || '';
          const rankStr = rankList.find((d) => d.value === rank)?.label || '';

          let productTitle = stampStr;
          productTitle += ' HERMES ';
          productTitle += colorStr.join(' ');
          productTitle += materialStr.join(' ');
          productTitle += hardwareStr.join(' ');
          productTitle += rankStr;

          const payload = {
            brandName,
            minRecyclePrice: 0,
            maxRecyclePrice: 0,
            minSalePrice: 0,
            maxSalePrice: 0,
            facebookEnabled,
            firstValuationShopRemark,
            firstValuationStock,
            firstValuationStockRemark,
            guestRemarks,
            rank,
            color: color ? color.toString() : '',
            hardware: hardware ? hardware.toString() : '',
            stamp: stamp,
            material: material_ ? material_.toString() : '',
            firstValuationProductAccessories: firstValuationProductAccessories
              ? firstValuationProductAccessories.toString()
              : '',
            accessory: accessory ? accessory.toString() : '',
            storeReceiptPics: type === 'contract' ? file : null,
            productPics:
              type === 'contract'
                ? '{"front":"","back":"","interior":"","blindStamp":""}'
                : JSON.stringify(file),
            // '{"front":"https://img.ginzaxiaoma.com/images/20231102/m4_492.jpg","back":"https://img.ginzaxiaoma.com/images/20231102/m4_388.jpg","interior":"https://img.ginzaxiaoma.com/images/20231102/m4_772.jpg","blindStamp":""}',
            productCategoryId: prodCateId,
            productTitle,
            currency,
            finalRecyclePrice: recycleValue,
            finalSalePrice: saleValue,
            i18nJa: I18nJa,
            i18nCn: I18nCn,
            i18nTw: I18nTw,
            ...I18nEn,
          };

          if (type === 'intention') {
            if (recyclePrice) {
              payload.minRecyclePrice = recyclePrice[0];
              payload.maxRecyclePrice = recyclePrice[1];
            }
            if (salePrice) {
              payload.minSalePrice = salePrice[0];
              payload.maxSalePrice = salePrice[1];
            }
          }

          payloadList.push(payload);
        }
      });
      return payloadList;
    },
    [
      BrandList,
      DefaultBrand,
      accessoryList,
      colorList,
      hardwareList,
      materialCascaderOptionsMap,
      productCategoryList,
      rankList,
      stampList,
      type,
    ],
  );

  const ItemName = useMemo(() => {
    if (type === 'contract') {
      return ITEM_NAME_MAP.RECYCLING_CONSIGNMENT_CONTRACT;
    } else {
      return ITEM_NAME_MAP.RECYCLING_CONSIGNMENT_INTENTION;
    }
  }, [type]);

  useEffect(() => {
    const products = getRecyclingConsignmentStore(ItemName)
      .products as OmsRecycleOrderCreateProducts_Form[];
    if (products && products.length && type) {
      // 两个不同类型的订单 互相删除对方不需要的值，其实最好还是页面统一为一个页面
      products.forEach((d) => {
        if (orderType === 1) {
          delete d.recycleValue;
        } else if (orderType === 2) {
          delete d.saleValue;
        }
      });

      setTimeout(() => {
        form.setFieldValue('products', products);
      }, 666);
      const productParamList = handleData(products);
      onChange({ productParamList });
    }
  }, [ItemName, form, handleData, onChange, orderType, type]);

  return (
    <Form
      autoComplete="off"
      form={form}
      className="renderLabel"
      initialValues={{ products: [{}] }}
      onValuesChange={(
        _,
        { products }: { products: OmsRecycleOrderCreateProducts_Form[] },
      ) => {
        // 有值了 才保存
        if (products && products.length && products[0].productCategoryId) {
          setRecyclingConsignmentStore(ItemName, { products });
        }
        const payloadList = handleData(products);
        onChange({ productParamList: payloadList });
      }}
    >
      <Form.List
        name="products"
        rules={[
          {
            validator: (_, value) => {
              if (value.length > 0 && value[0].productCategoryId) {
                return Promise.resolve();
              }
              return Promise.reject(i18n.t('please_select'));
            },
          },
        ]}
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name }) => (
              <div key={key}>
                <div className="flex items-center relative">
                  <Divider orientation="center">
                    <div className="text-xl">No.{name + 1}</div>
                  </Divider>
                  {name !== 0 && (
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      className="text-xl absolute right-0"
                    />
                  )}
                </div>
                <Space
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="baseline"
                >
                  <ChildrenFormList
                    {...props}
                    name={name}
                    brandList={BrandList}
                    createdFrom={createdFrom}
                  />
                </Space>
              </div>
            ))}
            <Form.Item>
              <Button
                type="primary"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                {i18n.t('addTo')}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default ProductInfo;

/**
 * FormList 子项 单例
 */
interface ChildrenFormListProps {
  form: FormInstance<{ products: OmsRecycleOrderCreateProducts_Form[] }>;
  onChange: (data: OmsRecycleOrderCreateDTO) => void;
  type: 'intention' | 'contract';
  orderType?: number;
  name: number;
  brandList: BrandType[];
  createdFrom?: number;
}

const ChildrenFormList = ({
  form,
  orderType,
  name,
  type,
  brandList,
  createdFrom,
}: ChildrenFormListProps) => {
  const {
    colorList,
    rankList,
    stampList,
    hardwareList,
    accessoryList,
    materialCascaderOptionsMap,
    productCategoryList,
  } = useProductFormData();

  const { language } = useAppSelector(selectGlobalInfo);
  const { shop } = useSelector(selectUserInfo);

  // 排序后 刻印
  const stampListSort = useMemo((): SelectOption[] => {
    if (stampList && stampList.length) {
      let temp = [...stampList];
      return temp.sort((a: any, b: any) => b.sort - a.sort);
    }
    return [];
  }, [stampList]);
  // 排序后 附属品
  const accessoryListSort = useMemo((): SelectOption[] => {
    if (accessoryList && accessoryList.length) {
      let temp = [...accessoryList];
      return temp.sort((a: any, b: any) => b.sort - a.sort);
    }
    return [];
  }, [accessoryList]);
  const rankListSort = useMemo((): SelectOption[] => {
    if (rankList && rankList.length) {
      return [...rankList].sort(
        (a: SelectOption, b: SelectOption) => b.sort! - a.sort!,
      );
    }
    return [];
  }, [rankList]);
  const hardwareListSort = useMemo((): SelectOption[] => {
    if (hardwareList && hardwareList.length) {
      return [...hardwareList].sort(
        (a: SelectOption, b: SelectOption) => b.sort! - a.sort!,
      );
    }
    return [];
  }, [hardwareList]);

  const [materialList, setMaterialList] = useState<CascaderOption[]>([]);
  const [selectRank, setSelectRank] = useState<nameValue>({});
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
    })(),
  );

  // 设置默认币种
  useEffect(() => {
    if (shop && form) {
      const t = CurrencyOption.find((d) => d.numberValue === shop)?.label!;
      if (t) {
        const products: OmsRecycleOrderCreateProducts_Form[] =
          form.getFieldValue('products') || [];
        if (products[name]) {
          products[name].currency = t;
          form.setFieldsValue({ products });
        }
      }
    }
  }, [form, name, shop]);
  const watchProducts = Form.useWatch('products', {
    form,
    preserve: true,
  });

  const currency = useMemo(() => {
    if (watchProducts && watchProducts[name]) {
      return watchProducts[name].currency;
    }
    return CURRENCY_MAP.JPY;
  }, [name, watchProducts]);

  useEffect(() => {
    if (
      watchProducts &&
      watchProducts[name] &&
      watchProducts[name].productCategoryId &&
      Object.keys(materialCascaderOptionsMap).length
    ) {
      const list = [
        ...materialCascaderOptionsMap[watchProducts[name].productCategoryId[0]],
      ].sort((a, b) => a.sort! - b.sort!);
      setMaterialList(list);
    }
  }, [form, materialCascaderOptionsMap, name, watchProducts]);

  const CascaderFilter = useCallback(
    (inputValue: string, path: DefaultOptionType[]) =>
      getCascaderFilter(inputValue, path),
    [],
  );

  const SelectFilter = useCallback(
    (input: string, option: SelectOption | undefined) =>
      (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
    [],
  );

  const accessory = form.getFieldValue('products')[name]?.accessory || [];

  const ItemName = useMemo(() => {
    if (type === 'contract') {
      return ITEM_NAME_MAP.RECYCLING_CONSIGNMENT_CONTRACT;
    } else {
      return ITEM_NAME_MAP.RECYCLING_CONSIGNMENT_INTENTION;
    }
  }, [type]);

  return (
    <Row gutter={[48, 0]}>
      <Col span={12}>
        <Form.Item
          label={
            <RenderLabel width={120} required>
              {i18n.t('bag_style')}
            </RenderLabel>
          }
          name={[name, 'productCategoryId']}
          rules={[
            {
              required: true,
              message: i18n.t(LOCALS.please_select) as string,
            },
          ]}
        >
          <Cascader
            allowClear={false}
            options={productCategoryList}
            onChange={(value, e) => {
              // 设置材质内容
              if (value && value.length > 0) {
                const list = [...materialCascaderOptionsMap[value[0]]].sort(
                  (a, b) => a.sort! - b.sort!,
                );
                setMaterialList(list);
                form.setFieldValue('material', '');
              }
              if (e.length) {
                const { nameJa, nameEn, nameZh, nameTw } = e[e.length - 1];
                const products = form.getFieldValue('products') || [];
                if (products[name]) {
                  products[name].name = {
                    ja: nameJa,
                    en: nameEn,
                    zh: nameZh,
                    zh_TW: nameTw,
                  };
                  form.setFieldsValue({ products });
                }
              }
            }}
            showSearch={{ filter: CascaderFilter }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={
            <RenderLabel width={120} required>
              {i18n.t(LOCALS.brand)}
            </RenderLabel>
          }
          name={[name, 'brandName']}
          initialValue={'Hermes'}
        >
          <Radio.Group optionType="button" buttonStyle="solid">
            {brandList.map(({ value, label }) => {
              return (
                <Radio value={value} key={value}>
                  {label}
                </Radio>
              );
            })}
          </Radio.Group>
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label={
            <RenderLabel width={120} required>
              {i18n.t(LOCALS.product_name)}
            </RenderLabel>
          }
          name={[name, 'name']}
          rules={[
            {
              required: true,
              message: i18n.t(LOCALS.please_select) as string,
            },
          ]}
        >
          <ProductName
            inputLang={inputLang}
            tipEle={
              <p className="text-[red] text-[12px]">
                {i18n.t('noCategoryFound')}
              </p>
            }
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label={
            <RenderLabel width={120} required={createdFrom !== 2}>
              {i18n.t(LOCALS.rank)}
            </RenderLabel>
          }
          name={[name, 'rank']}
          rules={[
            {
              required: createdFrom !== 2,
              message: i18n.t(LOCALS.please_select) as string,
            },
          ]}
        >
          <Select
            options={rankListSort}
            placeholder={i18n.t(LOCALS.please_select) || ''}
            onChange={(e) => {
              const t: SelectOptionWarp = rankList.find((d) => e === d.value)!;
              const attrRankDesc = {
                zh: t.labelCn,
                zh_TW: t.labelTw,
                ja: t.labelJa,
                en: t.labelEn,
              };
              const products = form.getFieldValue('products') || [];
              if (products[name]) {
                products[name].attrRankDesc = attrRankDesc;
                form.setFieldsValue({ products });
              }
              setSelectRank(attrRankDesc);
            }}
            showSearch
            filterOption={SelectFilter}
          />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label={
            <RenderLabel width={120} required={createdFrom !== 2}>
              {i18n.t(LOCALS.rank_desc)}
            </RenderLabel>
          }
          name={[name, 'attrRankDesc']}
          rules={[
            {
              required: createdFrom !== 2,
              message: i18n.t(LOCALS.please_select) as string,
            },
          ]}
        >
          <RankDesc inputLang={inputLang} rank={selectRank} mode={'add'} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={
            <RenderLabel width={120} required>
              {i18n.t('color')}
            </RenderLabel>
          }
          name={[name, 'color']}
          rules={[
            {
              required: true,
              message: i18n.t(LOCALS.please_select) as string,
            },
          ]}
        >
          <Select
            placeholder={i18n.t(LOCALS.please_select) || ''}
            mode="multiple"
            options={colorList}
            showSearch
            filterOption={SelectFilter}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={
            <RenderLabel width={120} required>
              {i18n.t('material')}
            </RenderLabel>
          }
          name={[name, 'material']}
          rules={[
            {
              required: true,
              message: i18n.t(LOCALS.please_select) as string,
            },
          ]}
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
            <RenderLabel width={120} required>
              {i18n.t('hardware')}
            </RenderLabel>
          }
          name={[name, 'hardware']}
          rules={[
            {
              required: true,
              message: i18n.t(LOCALS.please_select) as string,
            },
          ]}
        >
          <Select
            mode="multiple"
            options={hardwareListSort}
            filterOption={SelectFilter}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={
            <RenderLabel width={120} required>
              {i18n.t('stamp')}
            </RenderLabel>
          }
          name={[name, 'stamp']}
          rules={[
            {
              required: true,
              message: i18n.t(LOCALS.please_select) as string,
            },
          ]}
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
            <RenderLabel width={120} required={createdFrom != 2}>
              {i18n.t('accessories')}
            </RenderLabel>
          }
          name={[name, 'accessory']}
          rules={[
            {
              required: createdFrom != 2,
              message: i18n.t(LOCALS.please_select) as string,
            },
          ]}
        >
          <Checkbox.Group
            onChange={(e) => {
              if (e.indexOf('none') > -1) {
                const products = form.getFieldValue('products') || [];
                if (products[name]) {
                  products[name].accessory = ['none'];
                  form.setFieldsValue({ products });
                }
              }
            }}
          >
            {accessoryListSort.map((d) => (
              <Checkbox
                value={d.value}
                key={d.value}
                disabled={d.value !== 'none' && accessory.indexOf('none') > -1}
              >
                {d.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Col>
      <Col span={24}>
        {type === 'contract' ? (
          <Form.Item
            label={
              <RenderLabel width={120}>
                {i18n.t(LOCALS.product_photos)}
              </RenderLabel>
            }
            name={[name, 'file']}
          >
            <UploadImage max={9} />
          </Form.Item>
        ) : (
          <Form.Item
            label={
              <RenderLabel width={120}>
                {i18n.t(LOCALS.product_photos)}
              </RenderLabel>
            }
            name={[name, 'file']}
            // rules={[
            //   {
            //     validator: (_, value) => {
            //       if (!value || Object.keys(value).length === 0) {
            //         return Promise.reject(i18n.t('please_select'));
            //       }
            //       if (value) {
            //         if (!value.front || !value.back || !value.interior) {
            //           return Promise.reject(i18n.t('fill_in_completely'));
            //         }
            //       }
            //       return Promise.resolve();
            //     },
            //   },
            // ]}
          >
            <UploadImageComponents ItemName={ItemName} />
          </Form.Item>
        )}
      </Col>
      <Col span={24}>
        <Form.Item
          label={
            <RenderLabel required width={130}>
              {i18n.t('currency')}
            </RenderLabel>
          }
          name={[name, 'currency']}
          rules={[
            {
              required: true,
              message: i18n.t(LOCALS.please_select) as string,
            },
          ]}
        >
          <Select options={CurrencyOption} disabled={!!shop} />
        </Form.Item>
      </Col>
      {type === 'intention' && (
        <>
          <Col span={24}>
            <Form.Item
              label={
                <RenderLabel width={130}>
                  {i18n.t('consignment_preliminary_valuation')}
                </RenderLabel>
              }
              name={[name, 'salePrice']}
              rules={[
                {
                  validator: (_, value) => {
                    if (value) {
                      if (value[0] > value[1]) {
                        return Promise.reject(i18n.t('invalid_range'));
                      }
                      if (!(value[0] && value[1])) {
                        return Promise.reject(i18n.t('fill_in_completely'));
                      }
                    }
                    const RecyclePrice = form.getFieldValue('recyclePrice');
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
                          i18n.t('consignment_valuation_minimum'),
                        );
                      }
                      if (value[1] < RecyclePrice[1]) {
                        return Promise.reject(
                          i18n.t('consignment_valuation_maximum'),
                        );
                      }
                    }
                    if (!value && !form.getFieldValue('recyclePrice')) {
                      return Promise.reject(i18n.t('select_at_least_one'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <MinMaxValuation currency={currency} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={
                <RenderLabel width={130}>{i18n.t('instant_sale')}</RenderLabel>
              }
              name={[name, 'recyclePrice']}
              rules={[
                {
                  validator: (_, value) => {
                    if (value) {
                      if (value[0] > value[1]) {
                        return Promise.reject(i18n.t('invalid_range'));
                      }
                      if (!(value[0] && value[1])) {
                        return Promise.reject(i18n.t('fill_in_completely'));
                      }
                    }
                    if (!value && !form.getFieldValue('salePrice')) {
                      return Promise.reject(i18n.t('select_at_least_one'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <MinMaxValuation currency={currency} />
            </Form.Item>
          </Col>
        </>
      )}
      {type === 'contract' && (
        <>
          <Col span={24}>
            <Form.Item
              label={
                <RenderLabel required={orderType === 1} width={130}>
                  {i18n.t('consignment_confirmation_quote')}
                </RenderLabel>
              }
              name={[name, 'saleValue']}
              rules={[
                {
                  validator: (_, value) => {
                    const recycleValue = form.getFieldValue('recycleValue');
                    // 回收时可以不填
                    if (orderType === 2) {
                      return Promise.resolve();
                    }
                    // 寄卖时必填
                    if (orderType === 1 && !value) {
                      return Promise.reject('寄卖合同订单必须填写寄卖价格');
                    }
                    if (value && recycleValue && value < recycleValue) {
                      return Promise.reject(i18n.t('consignment_valuation_w'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                disabled={orderType === 2}
                max={99999999}
                inputMode="numeric"
                addonBefore={currency}
                style={{ width: '100%' }}
                min={1}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={
                <RenderLabel required={orderType === 2} width={130}>
                  {i18n.t('recycling_confirmation_quote')}
                </RenderLabel>
              }
              name={[name, 'recycleValue']}
              rules={[
                {
                  validator: (_, value) => {
                    if (orderType === 2 && !value) {
                      return Promise.reject('回收合同订单必须填写回收价格');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                inputMode="numeric"
                disabled={orderType === 1}
                max={99999999}
                addonBefore={currency}
                style={{ width: '100%' }}
                min={1}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
              />
            </Form.Item>
          </Col>
        </>
      )}
      <Col span={24}>
        <Form.Item
          label={
            <RenderLabel width={120}>{i18n.t('service_comments')}</RenderLabel>
          }
          name={[name, 'firstValuationShopRemark']}
        >
          <Input.TextArea maxLength={100} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label={
            <RenderLabel width={120}>{i18n.t('guest_remarks')}</RenderLabel>
          }
          name={[name, 'guestRemarks']}
        >
          <Input.TextArea
            maxLength={100}
            placeholder={i18n.t('show_to_the_guest') || ''}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={
            <RenderLabel width={120} required>
              {i18n.t('stock_availability')}
            </RenderLabel>
          }
          name={[name, 'firstValuationStock']}
          rules={[
            {
              required: true,
              message: i18n.t(LOCALS.please_select) as string,
            },
          ]}
          initialValue={1}
        >
          <Radio.Group>
            <Radio value={2}>{i18n.t('available')}</Radio>
            <Radio value={1}>{i18n.t('unavailable')}</Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={
            <RenderLabel width={120}>{i18n.t('inventory_notes')}</RenderLabel>
          }
          name={[name, 'firstValuationStockRemark']}
        >
          <Input maxLength={100} />
        </Form.Item>
      </Col>
    </Row>
  );
};
