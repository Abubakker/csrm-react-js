import { ProductUpdateInfo } from 'types/pms';
import i18n from 'i18n';
import { SelectOptionWarp } from 'types/base';

export enum LANGAGE_INPUT_MAP {
  EN = 'en',
  ZH = 'zh',
  JA = 'ja',
  ZH_TW = 'zh_TW',
}

export type langageInputType =
  | LANGAGE_INPUT_MAP.EN
  | LANGAGE_INPUT_MAP.ZH
  | LANGAGE_INPUT_MAP.ZH_TW
  | LANGAGE_INPUT_MAP.JA;

export type nameValue = {
  [key in langageInputType]?: string;
};

// 翻译类型
export type translateDataType = {
  subTitle: nameValue;
  note: nameValue;
  name: nameValue;
  detailDesc: nameValue;
  attrRankDesc: nameValue;
  detailTitle: nameValue;
  attrSize: nameValue;
};

export type ProductAddEditFormData = {
  productCategoryIds: number[];
  attrColorArr: string[];
  attrMaterialArr: string[][];
  attrHardwareArr: string[];
  attrAccessoryArr: string[];
  collectionsArr: string[];
} & ProductUpdateInfo &
  translateDataType;

type I18nType = Partial<
  Pick<
    ProductUpdateInfo,
    | 'name'
    | 'subTitle'
    | 'note'
    | 'detailDesc'
    | 'detailTitle'
    | 'attrRankDesc'
    | 'attrSize'
  >
> & {
  productId?: number;
  id?: number;
};

export const handleI18n = (
  data: ProductAddEditFormData,
  field: string,
  i18nParam?: { id: string }
) => {
  const i18n: I18nType = {
    productId: data.id,
  };
  if (i18nParam) {
    i18n.id = Number(i18nParam.id);
  }
  if (data.name && typeof data.name === 'object') {
    i18n.name = data.name[field];
  }
  if (data.subTitle && typeof data.subTitle === 'object') {
    i18n.subTitle = data.subTitle[field];
  }
  if (data.note && typeof data.note === 'object') {
    i18n.note = data.note[field];
  }
  if (data.detailDesc && typeof data.detailDesc === 'object') {
    i18n.detailDesc = data.detailDesc[field];
  }
  if (data.detailTitle && typeof data.detailTitle === 'object') {
    i18n.detailTitle = data.detailTitle[field];
  }
  if (data.attrRankDesc && typeof data.attrRankDesc === 'object') {
    i18n.attrRankDesc = data.attrRankDesc[field];
  }
  if (data.attrSize && typeof data.attrSize === 'object') {
    i18n.attrSize = data.attrSize[field];
  }
  return i18n;
};

export const TagClassName =
  'flex items-center px-4 w-[120px] justify-center whitespace-normal leading-3 text-center';

/**
 * 成色集合
 * https://docs.google.com/spreadsheets/d/1bz00eMR20XHS1f8JcPiBOh0LdL97SAvVg5zrwTtfyf4/edit#gid=0
 */
export const metalListDefault = () => [
  {
    name: i18n.t('Small_scratches'),
    en: i18n.getFixedT('en')('Small_scratches'),
    zh: i18n.getFixedT('zh_CN')('Small_scratches'),
    zh_TW: i18n.getFixedT('zh_TW')('Small_scratches'),
    ja: i18n.getFixedT('ja')('Small_scratches'),
    checked: false,
  },
  {
    name: i18n.t('Scratches'),
    en: i18n.getFixedT('en')('Scratches'),
    zh: i18n.getFixedT('zh_CN')('Scratches'),
    zh_TW: i18n.getFixedT('zh_TW')('Scratches'),
    ja: i18n.getFixedT('ja')('Scratches'),
    checked: false,
  },
  {
    name: i18n.t('The_hardware_has_no_protective_film'),
    en: i18n.getFixedT('en')('The_hardware_has_no_protective_film'),
    zh: i18n.getFixedT('zh_CN')('The_hardware_has_no_protective_film'),
    zh_TW: i18n.getFixedT('zh_TW')('The_hardware_has_no_protective_film'),
    ja: i18n.getFixedT('ja')('The_hardware_has_no_protective_film'),
    checked: false,
  },
  {
    name: i18n.t('The_hardware_has_the_original_protective_film'),
    en: i18n.getFixedT('en')('The_hardware_has_the_original_protective_film'),
    zh: i18n.getFixedT('zh_CN')(
      'The_hardware_has_the_original_protective_film'
    ),
    zh_TW: i18n.getFixedT('zh_TW')(
      'The_hardware_has_the_original_protective_film'
    ),
    ja: i18n.getFixedT('ja')('The_hardware_has_the_original_protective_film'),
    checked: false,
  },
  {
    name: i18n.t('Hardware_Derivative_Protective_film'),
    en: i18n.getFixedT('en')('Hardware_Derivative_Protective_film'),
    zh: i18n.getFixedT('zh_CN')('Hardware_Derivative_Protective_film'),
    zh_TW: i18n.getFixedT('zh_TW')('Hardware_Derivative_Protective_film'),
    ja: i18n.getFixedT('ja')('Hardware_Derivative_Protective_film'),
    checked: false,
  },
  {
    name: i18n.t('Hardware_Slightly_oxidised'),
    en: i18n.getFixedT('en')('Hardware_Slightly_oxidised'),
    zh: i18n.getFixedT('zh_CN')('Hardware_Slightly_oxidised'),
    zh_TW: i18n.getFixedT('zh_TW')('Hardware_Slightly_oxidised'),
    ja: i18n.getFixedT('ja')('Hardware_Slightly_oxidised'),
    checked: false,
  },
  {
    name: i18n.t('Hardware_Oxidised'),
    en: i18n.getFixedT('en')('Hardware_Oxidised'),
    zh: i18n.getFixedT('zh_CN')('Hardware_Oxidised'),
    zh_TW: i18n.getFixedT('zh_TW')('Hardware_Oxidised'),
    ja: i18n.getFixedT('ja')('Hardware_Oxidised'),
    checked: false,
  },
  {
    name: i18n.t(
      'Hardware_There_will_be_minor_scratches_due_to_the_unique_design_of_the_product'
    ),
    en: i18n.getFixedT('en')(
      'Hardware_There_will_be_minor_scratches_due_to_the_unique_design_of_the_product'
    ),
    zh: i18n.getFixedT('zh_CN')(
      'Hardware_There_will_be_minor_scratches_due_to_the_unique_design_of_the_product'
    ),
    zh_TW: i18n.getFixedT('zh_TW')(
      'Hardware_There_will_be_minor_scratches_due_to_the_unique_design_of_the_product'
    ),
    ja: i18n.getFixedT('ja')(
      'Hardware_There_will_be_minor_scratches_due_to_the_unique_design_of_the_product'
    ),
    checked: false,
  },
];

export const bottomListDefault = () => [
  {
    name: i18n.t('Slight_scuff_on_all_corners'),
    en: i18n.getFixedT('en')('Slight_scuff_on_all_corners'),
    zh: i18n.getFixedT('zh_CN')('Slight_scuff_on_all_corners'),
    zh_TW: i18n.getFixedT('zh_TW')('Slight_scuff_on_all_corners'),
    ja: i18n.getFixedT('ja')('Slight_scuff_on_all_corners'),
    checked: false,
  },
  {
    name: i18n.t('Scuff_on_all_corners'),
    en: i18n.getFixedT('en')('Scuff_on_all_corners'),
    zh: i18n.getFixedT('zh_CN')('Scuff_on_all_corners'),
    zh_TW: i18n.getFixedT('zh_TW')('Scuff_on_all_corners'),
    ja: i18n.getFixedT('ja')('Scuff_on_all_corners'),
    checked: false,
  },
  {
    name: i18n.t('Slight_stains_on_all_corners'),
    en: i18n.getFixedT('en')('Slight_stains_on_all_corners'),
    zh: i18n.getFixedT('zh_CN')('Slight_stains_on_all_corners'),
    zh_TW: i18n.getFixedT('zh_TW')('Slight_stains_on_all_corners'),
    ja: i18n.getFixedT('ja')('Slight_stains_on_all_corners'),
    checked: false,
  },
  {
    name: i18n.t('Stains_on_all_corners'),
    en: i18n.getFixedT('en')('Stains_on_all_corners'),
    zh: i18n.getFixedT('zh_CN')('Stains_on_all_corners'),
    zh_TW: i18n.getFixedT('zh_TW')('Stains_on_all_corners'),
    ja: i18n.getFixedT('ja')('Stains_on_all_corners'),
    checked: false,
  },
  {
    name: i18n.t('Slight_scuff_on_corner'),
    en: i18n.getFixedT('en')('Slight_scuff_on_corner'),
    zh: i18n.getFixedT('zh_CN')('Slight_scuff_on_corner'),
    zh_TW: i18n.getFixedT('zh_TW')('Slight_scuff_on_corner'),
    ja: i18n.getFixedT('ja')('Slight_scuff_on_corner'),
    checked: false,
  },
  {
    name: i18n.t('Scuff_on_corner'),
    en: i18n.getFixedT('en')('Scuff_on_corner'),
    zh: i18n.getFixedT('zh_CN')('Scuff_on_corner'),
    zh_TW: i18n.getFixedT('zh_TW')('Scuff_on_corner'),
    ja: i18n.getFixedT('ja')('Scuff_on_corner'),
    checked: false,
  },
  {
    name: i18n.t('Slight_stains_on_corner'),
    en: i18n.getFixedT('en')('Slight_stains_on_corner'),
    zh: i18n.getFixedT('zh_CN')('Slight_stains_on_corner'),
    zh_TW: i18n.getFixedT('zh_TW')('Slight_stains_on_corner'),
    ja: i18n.getFixedT('ja')('Slight_stains_on_corner'),
    checked: false,
  },
  {
    name: i18n.t('Stains_on_corner'),
    en: i18n.getFixedT('en')('Stains_on_corner'),
    zh: i18n.getFixedT('zh_CN')('Stains_on_corner'),
    zh_TW: i18n.getFixedT('zh_TW')('Stains_on_corner'),
    ja: i18n.getFixedT('ja')('Stains_on_corner'),
    checked: false,
  },
];

export const bodyListDefault = () => [
  {
    name: i18n.t('Overall_slight_signs_of_use'),
    en: i18n.getFixedT('en')('Overall_slight_signs_of_use'),
    zh: i18n.getFixedT('zh_CN')('Overall_slight_signs_of_use'),
    zh_TW: i18n.getFixedT('zh_TW')('Overall_slight_signs_of_use'),
    ja: i18n.getFixedT('ja')('Overall_slight_signs_of_use'),
    checked: false,
  },
  {
    name: i18n.t('Overall_signs_of_use'),
    en: i18n.getFixedT('en')('Overall_signs_of_use'),
    zh: i18n.getFixedT('zh_CN')('Overall_signs_of_use'),
    zh_TW: i18n.getFixedT('zh_TW')('Overall_signs_of_use'),
    ja: i18n.getFixedT('ja')('Overall_signs_of_use'),
    checked: false,
  },
  {
    name: i18n.t('Outer_slight_scratches_from_use'),
    en: i18n.getFixedT('en')('Outer_slight_scratches_from_use'),
    zh: i18n.getFixedT('zh_CN')('Outer_slight_scratches_from_use'),
    zh_TW: i18n.getFixedT('zh_TW')('Outer_slight_scratches_from_use'),
    ja: i18n.getFixedT('ja')('Outer_slight_scratches_from_use'),
    checked: false,
  },
  {
    name: i18n.t('Outer_normal_scratches_from_use'),
    en: i18n.getFixedT('en')('Outer_normal_scratches_from_use'),
    zh: i18n.getFixedT('zh_CN')('Outer_normal_scratches_from_use'),
    zh_TW: i18n.getFixedT('zh_TW')('Outer_normal_scratches_from_use'),
    ja: i18n.getFixedT('ja')('Outer_normal_scratches_from_use'),
    checked: false,
  },
  {
    name: i18n.t('Overall_slight_deformation'),
    en: i18n.getFixedT('en')('Overall_slight_deformation'),
    zh: i18n.getFixedT('zh_CN')('Overall_slight_deformation'),
    zh_TW: i18n.getFixedT('zh_TW')('Overall_slight_deformation'),
    ja: i18n.getFixedT('ja')('Overall_slight_deformation'),
    checked: false,
  },
  {
    name: i18n.t('Overall_deformation'),
    en: i18n.getFixedT('en')('Overall_deformation'),
    zh: i18n.getFixedT('zh_CN')('Overall_deformation'),
    zh_TW: i18n.getFixedT('zh_TW')('Overall_deformation'),
    ja: i18n.getFixedT('ja')('Overall_deformation'),
    checked: false,
  },
  {
    name: i18n.t('Overall_slight_stains'),
    en: i18n.getFixedT('en')('Overall_slight_stains'),
    zh: i18n.getFixedT('zh_CN')('Overall_slight_stains'),
    zh_TW: i18n.getFixedT('zh_TW')('Overall_slight_stains'),
    ja: i18n.getFixedT('ja')('Overall_slight_stains'),
    checked: false,
  },
  {
    name: i18n.t('Overall_stains'),
    en: i18n.getFixedT('en')('Overall_stains'),
    zh: i18n.getFixedT('zh_CN')('Overall_stains'),
    zh_TW: i18n.getFixedT('zh_TW')('Overall_stains'),
    ja: i18n.getFixedT('ja')('Overall_stains'),
    checked: false,
  },
  {
    name: i18n.t('Outer_Slight_indentations_from_use'),
    en: i18n.getFixedT('en')('Outer_Slight_indentations_from_use'),
    zh: i18n.getFixedT('zh_CN')('Outer_Slight_indentations_from_use'),
    zh_TW: i18n.getFixedT('zh_TW')('Outer_Slight_indentations_from_use'),
    ja: i18n.getFixedT('ja')('Outer_Slight_indentations_from_use'),
    checked: false,
  },
  {
    name: i18n.t('Outer_Normal_indentations_from_use'),
    en: i18n.getFixedT('en')('Outer_Normal_indentations_from_use'),
    zh: i18n.getFixedT('zh_CN')('Outer_Normal_indentations_from_use'),
    zh_TW: i18n.getFixedT('zh_TW')('Outer_Normal_indentations_from_use'),
    ja: i18n.getFixedT('ja')('Outer_Normal_indentations_from_use'),
    checked: false,
  },
  {
    name: i18n.t('Outer_Indentations'),
    en: i18n.getFixedT('en')('Outer_Indentations'),
    zh: i18n.getFixedT('zh_CN')('Outer_Indentations'),
    zh_TW: i18n.getFixedT('zh_TW')('Outer_Indentations'),
    ja: i18n.getFixedT('ja')('Outer_Indentations'),
    checked: false,
  },
  {
    name: i18n.t('Outer_Color_touch_up'),
    en: i18n.getFixedT('en')('Outer_Color_touch_up'),
    zh: i18n.getFixedT('zh_CN')('Outer_Color_touch_up'),
    zh_TW: i18n.getFixedT('zh_TW')('Outer_Color_touch_up'),
    ja: i18n.getFixedT('ja')('Outer_Color_touch_up'),
    checked: false,
  },
];

export const insideListDefault = () => [
  {
    name: i18n.t('Inner_slight_signs_of_use'),
    en: i18n.getFixedT('en')('Inner_slight_signs_of_use'),
    zh: i18n.getFixedT('zh_CN')('Inner_slight_signs_of_use'),
    zh_TW: i18n.getFixedT('zh_TW')('Inner_slight_signs_of_use'),
    ja: i18n.getFixedT('ja')('Inner_slight_signs_of_use'),
    checked: false,
  },
  {
    name: i18n.t('Inner_signs_of_use'),
    en: i18n.getFixedT('en')('Inner_signs_of_use'),
    zh: i18n.getFixedT('zh_CN')('Inner_signs_of_use'),
    zh_TW: i18n.getFixedT('zh_TW')('Inner_signs_of_use'),
    ja: i18n.getFixedT('ja')('Inner_signs_of_use'),
    checked: false,
  },
  {
    name: i18n.t('Inner_slight_stains'),
    en: i18n.getFixedT('en')('Inner_slight_stains'),
    zh: i18n.getFixedT('zh_CN')('Inner_slight_stains'),
    zh_TW: i18n.getFixedT('zh_TW')('Inner_slight_stains'),
    ja: i18n.getFixedT('ja')('Inner_slight_stains'),
    checked: false,
  },
  {
    name: i18n.t('Inner_stains'),
    en: i18n.getFixedT('en')('Inner_stains'),
    zh: i18n.getFixedT('zh_CN')('Inner_stains'),
    zh_TW: i18n.getFixedT('zh_TW')('Inner_stains'),
    ja: i18n.getFixedT('ja')('Inner_stains'),
    checked: false,
  },
  {
    name: i18n.t('Slight_indentations_from_use'),
    en: i18n.getFixedT('en')('Slight_indentations_from_use'),
    zh: i18n.getFixedT('zh_CN')('Slight_indentations_from_use'),
    zh_TW: i18n.getFixedT('zh_TW')('Slight_indentations_from_use'),
    ja: i18n.getFixedT('ja')('Slight_indentations_from_use'),
    checked: false,
  },
  {
    name: i18n.t('Normal_indentations_from_use'),
    en: i18n.getFixedT('en')('Normal_indentations_from_use'),
    zh: i18n.getFixedT('zh_CN')('Normal_indentations_from_use'),
    zh_TW: i18n.getFixedT('zh_TW')('Normal_indentations_from_use'),
    ja: i18n.getFixedT('ja')('Normal_indentations_from_use'),
    checked: false,
  },
  {
    name: i18n.t('Indentations'),
    en: i18n.getFixedT('en')('Indentations'),
    zh: i18n.getFixedT('zh_CN')('Indentations'),
    zh_TW: i18n.getFixedT('zh_TW')('Indentations'),
    ja: i18n.getFixedT('ja')('Indentations'),
    checked: false,
  },
  {
    name: i18n.t('Slight_scratches_from_use'),
    en: i18n.getFixedT('en')('Slight_scratches_from_use'),
    zh: i18n.getFixedT('zh_CN')('Slight_scratches_from_use'),
    zh_TW: i18n.getFixedT('zh_TW')('Slight_scratches_from_use'),
    ja: i18n.getFixedT('ja')('Slight_scratches_from_use'),
    checked: false,
  },
  {
    name: i18n.t('Normal_scratches_from_use'),
    en: i18n.getFixedT('en')('Normal_scratches_from_use'),
    zh: i18n.getFixedT('zh_CN')('Normal_scratches_from_use'),
    zh_TW: i18n.getFixedT('zh_TW')('Normal_scratches_from_use'),
    ja: i18n.getFixedT('ja')('Normal_scratches_from_use'),
    checked: false,
  },
  {
    name: i18n.t('Scratches'),
    en: i18n.getFixedT('en')('Scratches'),
    zh: i18n.getFixedT('zh_CN')('Scratches'),
    zh_TW: i18n.getFixedT('zh_TW')('Scratches'),
    ja: i18n.getFixedT('ja')('Scratches'),
    checked: false,
  },
  {
    name: i18n.t('Ink_marks'),
    en: i18n.getFixedT('en')('Ink_marks'),
    zh: i18n.getFixedT('zh_CN')('Ink_marks'),
    zh_TW: i18n.getFixedT('zh_TW')('Ink_marks'),
    ja: i18n.getFixedT('ja')('Ink_marks'),
    checked: false,
  },
  {
    name: i18n.t('Odor'),
    en: i18n.getFixedT('en')('Odor'),
    zh: i18n.getFixedT('zh_CN')('Odor'),
    zh_TW: i18n.getFixedT('zh_TW')('Odor'),
    ja: i18n.getFixedT('ja')('Odor'),
    checked: false,
  },
];

export const handrailListDefault = () => [
  {
    name: i18n.t('Handle_small_scratches'),
    en: i18n.getFixedT('en')('Handle_small_scratches'),
    zh: i18n.getFixedT('zh_CN')('Handle_small_scratches'),
    zh_TW: i18n.getFixedT('zh_TW')('Handle_small_scratches'),
    ja: i18n.getFixedT('ja')('Handle_small_scratches'),
    checked: false,
  },
  {
    name: i18n.t('Handle_scratches'),
    en: i18n.getFixedT('en')('Handle_scratches'),
    zh: i18n.getFixedT('zh_CN')('Handle_scratches'),
    zh_TW: i18n.getFixedT('zh_TW')('Handle_scratches'),
    ja: i18n.getFixedT('ja')('Handle_scratches'),
    checked: false,
  },
  {
    name: i18n.t('Slight_stains_on_the_handle'),
    en: i18n.getFixedT('en')('Slight_stains_on_the_handle'),
    zh: i18n.getFixedT('zh_CN')('Slight_stains_on_the_handle'),
    zh_TW: i18n.getFixedT('zh_TW')('Slight_stains_on_the_handle'),
    ja: i18n.getFixedT('ja')('Slight_stains_on_the_handle'),
    checked: false,
  },
  {
    name: i18n.t('Stains_on_the_handle'),
    en: i18n.getFixedT('en')('Stains_on_the_handle'),
    zh: i18n.getFixedT('zh_CN')('Stains_on_the_handle'),
    zh_TW: i18n.getFixedT('zh_TW')('Stains_on_the_handle'),
    ja: i18n.getFixedT('ja')('Stains_on_the_handle'),
    checked: false,
  },
  {
    name: i18n.t('Deformation'),
    en: i18n.getFixedT('en')('Deformation'),
    zh: i18n.getFixedT('zh_CN')('Deformation'),
    zh_TW: i18n.getFixedT('zh_TW')('Deformation'),
    ja: i18n.getFixedT('ja')('Deformation'),
    checked: false,
  },
  {
    name: i18n.t('Discoloration'),
    en: i18n.getFixedT('en')('Discoloration'),
    zh: i18n.getFixedT('zh_CN')('Discoloration'),
    zh_TW: i18n.getFixedT('zh_TW')('Discoloration'),
    ja: i18n.getFixedT('ja')('Discoloration'),
    checked: false,
  },
  {
    name: i18n.t('Slight_peeling_on_the_edge'),
    en: i18n.getFixedT('en')('Slight_peeling_on_the_edge'),
    zh: i18n.getFixedT('zh_CN')('Slight_peeling_on_the_edge'),
    zh_TW: i18n.getFixedT('zh_TW')('Slight_peeling_on_the_edge'),
    ja: i18n.getFixedT('ja')('Slight_peeling_on_the_edge'),
    checked: false,
  },
];

export const shoulderStrapListDefault = () => [
  {
    name: i18n.t('Shoulder_Strap_Small_scratches'),
    en: i18n.getFixedT('en')('Shoulder_Strap_Small_scratches'),
    zh: i18n.getFixedT('zh_CN')('Shoulder_Strap_Small_scratches'),
    zh_TW: i18n.getFixedT('zh_TW')('Shoulder_Strap_Small_scratches'),
    ja: i18n.getFixedT('ja')('Shoulder_Strap_Small_scratches'),
    checked: false,
  },
  {
    name: i18n.t('Shoulder_Strap_Scratches'),
    en: i18n.getFixedT('en')('Shoulder_Strap_Scratches'),
    zh: i18n.getFixedT('zh_CN')('Shoulder_Strap_Scratches'),
    zh_TW: i18n.getFixedT('zh_TW')('Shoulder_Strap_Scratches'),
    ja: i18n.getFixedT('ja')('Shoulder_Strap_Scratches'),
    checked: false,
  },
  {
    name: i18n.t('Shoulder_Strap_Slight_indentations_from_use'),
    en: i18n.getFixedT('en')('Shoulder_Strap_Slight_indentations_from_use'),
    zh: i18n.getFixedT('zh_CN')('Shoulder_Strap_Slight_indentations_from_use'),
    zh_TW: i18n.getFixedT('zh_TW')('Shoulder_Strap_Slight_indentations_from_use'),
    ja: i18n.getFixedT('ja')('Shoulder_Strap_Slight_indentations_from_use'),
    checked: false,
  },
  {
    name: i18n.t('Shoulder_Strap_Normal_indentations_from_use'),
    en: i18n.getFixedT('en')('Shoulder_Strap_Normal_indentations_from_use'),
    zh: i18n.getFixedT('zh_CN')('Shoulder_Strap_Normal_indentations_from_use'),
    zh_TW: i18n.getFixedT('zh_TW')('Shoulder_Strap_Normal_indentations_from_use'),
    ja: i18n.getFixedT('ja')('Shoulder_Strap_Normal_indentations_from_use'),
    checked: false,
  },
  {
    name: i18n.t('Shoulder_Strap_Slight_stains_on_the_handle'),
    en: i18n.getFixedT('en')('Shoulder_Strap_Slight_stains_on_the_handle'),
    zh: i18n.getFixedT('zh_CN')('Shoulder_Strap_Slight_stains_on_the_handle'),
    zh_TW: i18n.getFixedT('zh_TW')('Shoulder_Strap_Slight_stains_on_the_handle'),
    ja: i18n.getFixedT('ja')('Shoulder_Strap_Slight_stains_on_the_handle'),
    checked: false,
  },
  {
    name: i18n.t('Shoulder_Strap_Stains_on_the_handle'),
    en: i18n.getFixedT('en')('Shoulder_Strap_Stains_on_the_handle'),
    zh: i18n.getFixedT('zh_CN')('Shoulder_Strap_Stains_on_the_handle'),
    zh_TW: i18n.getFixedT('zh_TW')('Shoulder_Strap_Stains_on_the_handle'),
    ja: i18n.getFixedT('ja')('Shoulder_Strap_Stains_on_the_handle'),
    checked: false,
  },
];

export const othersListDefault = () => [
  {
    name: i18n.t('Others_Stains_on_dustbag'),
    en: i18n.getFixedT('en')('Others_Stains_on_dustbag'),
    zh: i18n.getFixedT('zh_CN')('Others_Stains_on_dustbag'),
    zh_TW: i18n.getFixedT('zh_TW')('Others_Stains_on_dustbag'),
    ja: i18n.getFixedT('ja')('Others_Stains_on_dustbag'),
    checked: false,
  },
];

export const brightListDefault = () => [
  {
    name: i18n.t('Discontinued_model'),
    en: i18n.getFixedT('en')('Discontinued_model'),
    zh: i18n.getFixedT('zh_CN')('Discontinued_model'),
    zh_TW: i18n.getFixedT('zh_TW')('Discontinued_model'),
    ja: i18n.getFixedT('ja')('Discontinued_model'),
    checked: false,
  },
  {
    name: i18n.t('Discontinued_leather'),
    en: i18n.getFixedT('en')('Discontinued_leather'),
    zh: i18n.getFixedT('zh_CN')('Discontinued_leather'),
    zh_TW: i18n.getFixedT('zh_TW')('Discontinued_leather'),
    ja: i18n.getFixedT('ja')('Discontinued_leather'),
    checked: false,
  },
  {
    name: i18n.t('Protective_film_on_the_bottom_studs'),
    en: i18n.getFixedT('en')('Protective_film_on_the_bottom_studs'),
    zh: i18n.getFixedT('zh_CN')('Protective_film_on_the_bottom_studs'),
    zh_TW: i18n.getFixedT('zh_TW')('Protective_film_on_the_bottom_studs'),
    ja: i18n.getFixedT('ja')('Protective_film_on_the_bottom_studs'),
    checked: false,
  },
  {
    name: i18n.t('No_deformation_on_the_body'),
    en: i18n.getFixedT('en')('No_deformation_on_the_body'),
    zh: i18n.getFixedT('zh_CN')('No_deformation_on_the_body'),
    zh_TW: i18n.getFixedT('zh_TW')('No_deformation_on_the_body'),
    ja: i18n.getFixedT('ja')('No_deformation_on_the_body'),
    checked: false,
  },
  {
    name: i18n.t('Protective_film_on_the_metal_parts'),
    en: i18n.getFixedT('en')('Protective_film_on_the_metal_parts'),
    zh: i18n.getFixedT('zh_CN')('Protective_film_on_the_metal_parts'),
    zh_TW: i18n.getFixedT('zh_TW')('Protective_film_on_the_metal_parts'),
    ja: i18n.getFixedT('ja')('Protective_film_on_the_metal_parts'),
    checked: false,
  },
  {
    name: i18n.t('Interior_is_clean_no_scratches'),
    en: i18n.getFixedT('en')('Interior_is_clean_no_scratches'),
    zh: i18n.getFixedT('zh_CN')('Interior_is_clean_no_scratches'),
    zh_TW: i18n.getFixedT('zh_TW')('Interior_is_clean_no_scratches'),
    ja: i18n.getFixedT('ja')('Interior_is_clean_no_scratches'),
    checked: false,
  },
  {
    name: i18n.t('No_wear_on_the_corners'),
    en: i18n.getFixedT('en')('No_wear_on_the_corners'),
    zh: i18n.getFixedT('zh_CN')('No_wear_on_the_corners'),
    zh_TW: i18n.getFixedT('zh_TW')('No_wear_on_the_corners'),
    ja: i18n.getFixedT('ja')('No_wear_on_the_corners'),
    checked: false,
  },
];

export const headTextData = {
  Hardware: {
    en: i18n.getFixedT('en')('Hardware'),
    zh: i18n.getFixedT('zh_CN')('Hardware'),
    zh_TW: i18n.getFixedT('zh_TW')('Hardware'),
    ja: i18n.getFixedT('ja')('Hardware'),
  },
  Edges: {
    en: i18n.getFixedT('en')('Edges'),
    zh: i18n.getFixedT('zh_CN')('Edges'),
    zh_TW: i18n.getFixedT('zh_TW')('Edges'),
    ja: i18n.getFixedT('ja')('Edges'),
  },
  Outer: {
    en: i18n.getFixedT('en')('Outer'),
    zh: i18n.getFixedT('zh_CN')('Outer'),
    zh_TW: i18n.getFixedT('zh_TW')('Outer'),
    ja: i18n.getFixedT('ja')('Outer'),
  },
  Inner: {
    en: i18n.getFixedT('en')('Inner'),
    zh: i18n.getFixedT('zh_CN')('Inner'),
    zh_TW: i18n.getFixedT('zh_TW')('Inner'),
    ja: i18n.getFixedT('ja')('Inner'),
  },
  Handle: {
    en: i18n.getFixedT('en')('Handle'),
    zh: i18n.getFixedT('zh_CN')('Handle'),
    zh_TW: i18n.getFixedT('zh_TW')('Handle'),
    ja: i18n.getFixedT('ja')('Handle'),
  },
  ShoulderStrap: {
    en: i18n.getFixedT('en')('shoulder_strap'),
    zh: i18n.getFixedT('zh_CN')('shoulder_strap'),
    zh_TW: i18n.getFixedT('zh_TW')('shoulder_strap'),
    ja: i18n.getFixedT('ja')('shoulder_strap'),
  },
  Others: {
    en: i18n.getFixedT('en')('others'),
    zh: i18n.getFixedT('zh_CN')('others'),
    zh_TW: i18n.getFixedT('zh_TW')('others'),
    ja: i18n.getFixedT('ja')('others'),
  },
  Highlights: {
    en: i18n.getFixedT('en')('Highlights'),
    zh: i18n.getFixedT('zh_CN')('Highlights'),
    zh_TW: i18n.getFixedT('zh_TW')('Highlights'),
    ja: i18n.getFixedT('ja')('Highlights'),
  },
};

export const handleAppend = (
  list: SelectOptionWarp[],
  text: Required<nameValue>
): Required<nameValue> => {
  list.forEach(({ labelEn, label, labelJa, labelTw, labelCn }, i) => {
    text.en += `${labelEn}${i === list.length - 1 ? '' : ' '}`;
    text.ja += `${labelJa}${i === list.length - 1 ? '' : ' '}`;
    text.zh += `${labelCn}${i === list.length - 1 ? '' : ' '}`;
    text.zh_TW += `${labelTw}${i === list.length - 1 ? '' : ' '}`;
  });
  return text;
};

export const handleSubText = (textList: string[], prefixText: string) => {
  if (prefixText) {
    const mateFind = textList.find((d) => d.indexOf(prefixText) > -1);
    const subText = mateFind?.substring(prefixText.length, mateFind.length);
    return subText || '';
  }
  return '';
};
