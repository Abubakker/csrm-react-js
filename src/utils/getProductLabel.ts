import { CascaderOption, SelectOption } from 'types/base';
import findCascaderOptionById from 'utils/findCascaderOptionById';

export interface LabelDataType {
  colorSelectList?: SelectOption[];
  colorSelectLabelList?: string[];
  //
  rankSelect?: SelectOption;
  rankSelectLabel?: string;
  //
  hardwareSelectList?: SelectOption[];
  hardwareSelectLabel?: string[];
  //
  accessorySelectList?: SelectOption[];
  accessorySelectLabel?: string[];
  //
  stampSelect?: SelectOption;
  stampSelectLabel?: string;
  //
  materialSelectList?: CascaderOption[];
  materialSelectLabelList?: string[];
  //
  productCategorySelectList?: CascaderOption;
  productCategorySelectLabelList?: string;
  //
  sizeLabel?: string;
}

/**
 *
 * @param param0 集合对象
 * @param product 传入商品
 */
const getProductLabel = (
  {
    productCategoryCascaderOptions,
    colorSelectOptions,
    rankSelectOptions,
    stampSelectOptions,
    materialCascaderOptionsMap,
    hardwareSelectOptions,
    accessorySelectOptions,
  }: {
    productCategoryCascaderOptions?: CascaderOption[];
    colorSelectOptions?: SelectOption[];
    rankSelectOptions?: SelectOption[];
    stampSelectOptions?: SelectOption[];
    materialCascaderOptionsMap?: {
      [key: string]: CascaderOption[];
    };
    hardwareSelectOptions?: SelectOption[];
    accessorySelectOptions?: SelectOption[];
  },
  product: {
    attrAccessory?: string;
    attrColor?: string;
    attrHardware?: string;
    attrMaterial?: string;
    attrSize?: string;
    attrStamp?: string;
    attrRank?: string;
    productCategoryId?: number;
  }
) => {
  const {
    attrAccessory,
    attrColor,
    attrHardware,
    attrMaterial,
    attrStamp,
    attrRank,
    productCategoryId,
  } = product;

  let Obj: LabelDataType = {};
  const colorSelect: SelectOption[] = [];
  if (attrColor && colorSelectOptions) {
    attrColor.split(',').forEach((value) => {
      const t = colorSelectOptions.find((dd) => dd.value === value);
      if (t) colorSelect.push(t);
    });
    Obj.colorSelectList = colorSelect;
    Obj.colorSelectLabelList = colorSelect.map((d) => d.label);
  }
  //
  let rankSelect: SelectOption;
  if (attrRank && rankSelectOptions) {
    rankSelect = rankSelectOptions.find((d) => d.value === attrRank)!;
    Obj.rankSelect = rankSelect;
    Obj.rankSelectLabel = rankSelect && rankSelect.label;
  }
  //
  const hardwareSelect: SelectOption[] = [];
  if (attrHardware && hardwareSelectOptions) {
    attrHardware.split(',').forEach((value) => {
      const t = hardwareSelectOptions.find((dd) => dd.value === value);
      if (t) hardwareSelect.push(t);
    });
    Obj.hardwareSelectList = hardwareSelect;
    Obj.hardwareSelectLabel = hardwareSelect.map((d) => d.label);
  }
  //
  const accessorySelect: SelectOption[] = [];
  if (attrAccessory && accessorySelectOptions) {
    attrAccessory.split(',').forEach((value) => {
      const t = accessorySelectOptions.find((dd) => dd.value === value);
      if (t) accessorySelect.push(t);
    });
    Obj.accessorySelectList = accessorySelect;
    Obj.accessorySelectLabel = accessorySelect.map((d) => d.label);
  }
  //
  let stampSelect: SelectOption;
  if (attrStamp && stampSelectOptions) {
    stampSelect = stampSelectOptions.find((d) => d.value === attrStamp)!;
    Obj.stampSelect = stampSelect;
    Obj.stampSelectLabel = stampSelect && stampSelect.label;
  }
  //
  let pcList: CascaderOption;
  let productCategoryIds: number[] = [];
  if (productCategoryId && productCategoryCascaderOptions) {
    const target = findCascaderOptionById(
      productCategoryId,
      productCategoryCascaderOptions
    );
    productCategoryIds = target?.treeIds?.split(',')?.map(Number) || [];
    pcList = findCascaderOptionById(
      productCategoryIds[productCategoryIds?.length - 1],
      productCategoryCascaderOptions
    )!;
    if (pcList) {
      Obj.productCategorySelectList = pcList;
      Obj.productCategorySelectLabelList = pcList.label;
      Obj.sizeLabel = pcList.size;
    }
  }
  //
  const materialSelect: CascaderOption[] = [];
  const materialLabel: string[] = [];
  if (attrMaterial && materialCascaderOptionsMap && productCategoryIds.length) {
    const mateList = materialCascaderOptionsMap[productCategoryIds[0]] || [];
    attrMaterial.split(',').forEach((material) => {
      const target = findCascaderOptionById(material, mateList);
      if (target) {
        materialSelect.push(target);
        materialLabel.push(target.label);
      }
    });
  }
  if (materialSelect.length) {
    Obj.materialSelectList = materialSelect;
    Obj.materialSelectLabelList = materialLabel;
  }
  console.log('🚀  Obj:', Obj);
  return Obj;
};

export { getProductLabel };
