import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { CascaderOption, SelectOption } from 'types/base';
import { useCallback, useState, useEffect } from 'react';
import findCascaderOptionById from 'utils/findCascaderOptionById';
import { OmsRecycleOrderProduct } from 'types/oms';


/** 回填FormItem的参数 */
interface FormDataType {
  color?: string[];
  rank?: string;
  hardware?: string[];
  stamp?: string;
  material?: string[];
  productCategoryId?: number[];
  accessory?: string[];
  imageList?: string[];
}

/** 更具回填值算出来的显示内容 */
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
  imageList?: string[];
}

const useProductFormData = () => {
  /** 接口加载数据 */
  const [prodInfo, setProdInfo] = useState<OmsRecycleOrderProduct>({});
  /** FormData填充数据 */
  const [FormData, setFormData] = useState<FormDataType>({});
  /** LabelData展示数据 */
  const [LabelData, setLabelData] = useState<LabelDataType>({});
  // const prodRef = useRef<LabelDataType>({});

  const {
    productCategoryCascaderOptions,
    colorSelectOptions,
    rankSelectOptions,
    stampSelectOptions,
    materialCascaderOptionsMap,
    hardwareSelectOptions,
    accessorySelectOptions,
  } = useAppSelector(selectGlobalInfo);

  /**
   * 将接口数据转换成 Form 表单使用的数据
   * @param data product接口数据
   * @returns FormData
   */
  const handleTransformFormData = useCallback(
    (prodInfoData: OmsRecycleOrderProduct) => {
      const {
        attrColor,
        attrHardware,
        attrMaterial,
        attrStamp,
        rank,
        productCategoryId,
        attrAccessory,
        albumPics,
      } = prodInfoData;
      let productCategoryIds: number[] = [];
      let attrMaterialArr: any[] = [];
      let mateList: CascaderOption[] = [];

      if (productCategoryId) {
        const target = findCascaderOptionById(
          productCategoryId,
          productCategoryCascaderOptions
        );
        productCategoryIds = target?.treeIds?.split(',').map(Number) || [];
        const level = productCategoryIds[0];
        mateList = materialCascaderOptionsMap[level] || [];
        // 实际值
        if (attrMaterial) {
          const tempArr = attrMaterial.split(',');
          tempArr.forEach((material) => {
            const target = findCascaderOptionById(material, mateList);
            const tempStrArr = target?.treeIds?.split(',');
            if (tempStrArr) attrMaterialArr.push(tempStrArr);
          });
        }
      }
      let imageList: string[] = [];
      if (albumPics) {
        imageList = albumPics.split(',');
      }
      return {
        rank,
        color: attrColor?.split(','),
        hardware: attrHardware?.split(','),
        stamp: attrStamp,
        material: attrMaterialArr,
        productCategoryId: productCategoryIds,
        accessory: attrAccessory?.split(','),
        imageList,
      };
    },
    [materialCascaderOptionsMap, productCategoryCascaderOptions]
  );
  const getTransformFormData = useCallback((): FormDataType => {
    return handleTransformFormData(prodInfo);
  }, [prodInfo, handleTransformFormData]);

  /**
   * 将 FormData 数据转换成 LabelData数据
   */
  const handleTransformLabelData = useCallback(
    (FormDataParam: FormDataType) => {
      const {
        color,
        rank,
        hardware,
        stamp,
        material,
        productCategoryId,
        imageList,
        accessory,
      } = FormDataParam;
      let Obj: LabelDataType = { imageList };
      const colorSelect: SelectOption[] = [];
      if (color && color instanceof Array) {
        color?.forEach((value) => {
          const t = colorSelectOptions.find((dd) => dd.value === value);
          if (t) colorSelect.push(t);
        });
        Obj.colorSelectList = colorSelect;
        Obj.colorSelectLabelList = colorSelect.map((d) => d.label);
      }
      //
      let rankSelect: SelectOption;
      if (rank) {
        rankSelect = rankSelectOptions.find((d) => d.value === rank)!;
        Obj.rankSelect = rankSelect;
        Obj.rankSelectLabel = rankSelect && rankSelect.label;
      }
      //
      const hardwareSelect: SelectOption[] = [];
      if (hardware && hardware instanceof Array) {
        hardware?.forEach((value) => {
          const t = hardwareSelectOptions.find((dd) => dd.value === value);
          if (t) hardwareSelect.push(t);
        });
        Obj.hardwareSelectList = hardwareSelect;
        Obj.hardwareSelectLabel = hardwareSelect.map((d) => d.label);
      }
      //
      const accessorySelect: SelectOption[] = [];
      if (accessory && accessory instanceof Array) {
        accessory?.forEach((value) => {
          const t = accessorySelectOptions.find((dd) => dd.value === value);
          if (t) accessorySelect.push(t);
        });
        Obj.accessorySelectList = accessorySelect;
        Obj.accessorySelectLabel = accessorySelect.map((d) => d.label);
      }
      //
      let stampSelect: SelectOption;
      if (stamp) {
        stampSelect = stampSelectOptions.find((d) => d.value === stamp)!;
        Obj.stampSelect = stampSelect;
        Obj.stampSelectLabel = stampSelect && stampSelect.label;
      }
      //
      const materialSelect: CascaderOption[] = [];
      const materialLabel: string[] = [];
      if (material && material instanceof Array && productCategoryId) {
        const level = productCategoryId[0];
        const mateList = materialCascaderOptionsMap[level] || [];
        const tempArr = material?.map((d) => d[d.length - 1]) || [];
        tempArr.forEach((material) => {
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
      //
      let pcList: CascaderOption;
      if (productCategoryId && productCategoryId instanceof Array) {
        pcList = findCascaderOptionById(
          productCategoryId[productCategoryId?.length - 1],
          productCategoryCascaderOptions
        )!;
        if (pcList) {
          Obj.productCategorySelectList = pcList;
          Obj.productCategorySelectLabelList = pcList.label;
        }
      }
      return Obj;
    },
    [
      materialCascaderOptionsMap,
      productCategoryCascaderOptions,
      accessorySelectOptions,
      colorSelectOptions,
      hardwareSelectOptions,
      rankSelectOptions,
      stampSelectOptions,
    ]
  );
  const getTransformLabelData = useCallback((): LabelDataType => {
    return handleTransformLabelData(FormData);
  }, [FormData, handleTransformLabelData]);

  /**
   * prodInfo改变 计算 FormData
   **/
  useEffect(() => {
    if (!prodInfo || Object.keys(prodInfo).length === 0) return;
    if (
      !productCategoryCascaderOptions ||
      productCategoryCascaderOptions.length === 0
    )
      return;
    if (
      !productCategoryCascaderOptions ||
      Object.keys(materialCascaderOptionsMap).length === 0
    )
      return;
    const tt = getTransformFormData();
    // console.log('🚀 表单填充数据:', tt);
    // 逻辑
    setFormData(tt);
  }, [
    materialCascaderOptionsMap,
    productCategoryCascaderOptions,
    prodInfo,
    getTransformFormData,
  ]);

  /** FormData 改变 计算 LabelData */
  useEffect(() => {
    if (Object.keys(FormData).length === 0) return;
    const tt = getTransformLabelData();
    // console.log('🚀 Label展示数据:', tt);
    setLabelData(tt);
  }, [FormData, getTransformLabelData]);

  /** 设置Prod获得其Label */
  // const setProdInfoGetLabel123 = useMemo(
  //   (ProductData: OmsRecycleOrderProduct): any => {
  //     console.log(
  //       '🚀  内  materialCascaderOptionsMap:',
  //       materialCascaderOptionsMap
  //     );
  //     console.log(
  //       '🚀  内  productCategoryCascaderOptions:',
  //       productCategoryCascaderOptions
  //     );
  //     const productFormData = handleTransformFormData(ProductData);
  //     console.log('🚀  Form:', productFormData);
  //     const productLabelData = handleTransformLabelData(productFormData);
  //     console.log('🚀  Label:', productLabelData);
  //     return productLabelData;
  //   },
  //   [
  //     materialCascaderOptionsMap,
  //     productCategoryCascaderOptions,
  //     handleTransformFormData,
  //     handleTransformLabelData,
  //   ]
  // );

  // const setProdInfoGetLabel =
  // useEffect(() => {
  //   const productFormData = handleTransformFormData(prodInfo);
  //   console.log('🚀  Form:', productFormData);
  //   const productLabelData = handleTransformLabelData(productFormData);
  //   console.log('🚀  Label:', productLabelData);
  //   prodRef.current = productLabelData;
  // }, [handleTransformFormData, handleTransformLabelData, prodInfo]);

  return {
    setProdInfo,
    FormData,
    LabelData,
    //
    productCategoryList: productCategoryCascaderOptions,
    colorList: colorSelectOptions,
    rankList: rankSelectOptions,
    stampList: stampSelectOptions,
    materialCascaderOptionsMap,
    hardwareList: hardwareSelectOptions,
    accessoryList: accessorySelectOptions,
  };
};

export default useProductFormData;

/**
 * 以后可能用得着的记录
 * 1、如果想要一个同步方法，就必须确保上游数据已经拿到了
 * 2、如果想要使用hooks方式，就只能在外层调用，内从不可以
 *  */
