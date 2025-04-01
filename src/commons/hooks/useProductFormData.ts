import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { CascaderOptionWarp, SelectOptionWarp } from 'types/base';
import { useCallback, useState, useRef, useEffect } from 'react';
import { getProductUpdateInfo } from 'apis/pms';
import findCascaderOptionById from 'utils/findCascaderOptionById';
import { OmsRecycleOrderProduct } from 'types/oms';

/** 回填FormItem的参数 */
interface FillData {
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
export interface ShowDataType {
  colorSelectList?: SelectOptionWarp[];
  colorSelectLabelList?: string[];
  colorSelectLabelList_EN?: string[];
  colorSelectLabelList_JA?: string[];
  colorSelectLabelList_TC?: string[];
  //
  rankSelect?: SelectOptionWarp;
  rankSelectLabel?: string;
  rankSelectLabel_EN?: string;
  rankSelectLabel_JA?: string;
  rankSelectLabel_TC?: string;

  //
  hardwareSelectList?: SelectOptionWarp[];
  hardwareSelectLabel?: string[];
  hardwareSelectLabel_EN?: string[];
  hardwareSelectLabel_JA?: string[];
  hardwareSelectLabel_TC?: string[];

  //
  accessorySelectList?: SelectOptionWarp[];
  accessorySelectLabel?: string[];
  accessorySelectLabel_EN?: string[];
  accessorySelectLabel_JA?: string[];
  accessorySelectLabel_TC?: string[];

  //
  stampSelect?: SelectOptionWarp;
  stampSelectLabel?: string;
  stampSelectLabel_EN?: string;
  stampSelectLabel_JA?: string;
  stampSelectLabel_TC?: string;

  //
  materialSelectList?: CascaderOptionWarp[];
  materialSelectLabelList?: string[];
  materialSelectLabelList_EN?: string[];
  materialSelectLabelList_JA?: string[];
  materialSelectLabelList_TC?: string[];

  //
  productCategorySelectList?: CascaderOptionWarp;
  productCategorySelectLabelList?: string;
  productCategorySelectLabelList_EN?: string;
  productCategorySelectLabelList_JA?: string;
  productCategorySelectLabelList_TC?: string;

  //
  imageList?: string[];
}

/**
 * 1、更具ID生成Form需要的数据。只处理关键信息。
 *  1.1、填充的数据
 *  1.2、填充数据的对象内容
 *  1.3、下拉需要的数值
 * 2、通过填充数据查询填充数据的对象内容的方法
 */
const useProductFormData = () => {
  /** 接口加载数据 */
  const [productInfo, setProductInfo] = useState<OmsRecycleOrderProduct>({});
  /** 填充值对象 */
  const [fillData, setFillData] = useState<FillData>({});
  /** 显示数据 */
  const [showData, setShowData] = useState<ShowDataType>({});

  const {
    productCategoryCascaderOptions,
    colorSelectOptions,
    rankSelectOptions,
    stampSelectOptions,
    materialCascaderOptionsMap,
    hardwareSelectOptions,
    accessorySelectOptions,
  } = useAppSelector(selectGlobalInfo);

  /** 材质跟随包款变化而变化 */
  const [materialCascaderOptions, setMaterialCascaderOptions] = useState<
    CascaderOptionWarp[]
  >([]);
  // materialCascaderOptions拿不到最新值，采用Ref
  const materialCascaderOptionsRef = useRef<CascaderOptionWarp[]>([]);

  /**
   * 加载产品信息
   * @param id 产品id
   */
  const getProductInfo = useCallback((id: number) => {
    getProductUpdateInfo(id).then((d) => {
      const { data } = d;
      setProductInfo(data);
    });
  }, []);

  /** 包款改变 材质下拉跟随改变 */
  const productCategoryChange = (productCategoryId: number | string) => {
    const materialTemp = [
      ...materialCascaderOptionsMap[productCategoryId],
    ].sort((a, b) => a.sort! - b.sort!);
    setMaterialCascaderOptions(materialTemp || []);
    materialCascaderOptionsRef.current = materialTemp;
  };

  /** 将接口数据转换成，可以填充到Form中的数据 */
  const getFormFillData = useCallback(
    (data: OmsRecycleOrderProduct): FillData => {
      const {
        attrColor,
        attrHardware,
        attrMaterial,
        attrStamp,
        rank,
        productCategoryId,
        attrAccessory,
        albumPics,
      } = data;
      let productCategoryIds: number[] = [];
      let attrMaterialArr: any[] = [];

      if (productCategoryId) {
        const target = findCascaderOptionById(
          productCategoryId,
          productCategoryCascaderOptions
        );
        productCategoryIds = target?.treeIds?.split(',').map(Number) || [];
        const level = productCategoryIds[0];
        let mateList: CascaderOptionWarp[] = [];
        if (level && materialCascaderOptionsMap[level]) {
          mateList =
            materialCascaderOptionsMap[level]
              .map((d) => ({ ...d }))
              .sort((a, b) => a.sort! - b.sort!) || [];
          setMaterialCascaderOptions([...mateList]);
          materialCascaderOptionsRef.current = [...mateList];
        }

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

  /** 填充到Form中的数据，可以展示实际内容的数据 */
  const getShowData = useCallback(
    (data: FillData) => {
      const {
        color,
        rank,
        hardware,
        stamp,
        material,
        productCategoryId,
        imageList,
        accessory,
      } = data;
      let Obj: ShowDataType = { imageList };
      const colorSelect: SelectOptionWarp[] = [];

      if (color && color instanceof Array) {
        color?.forEach((value) => {
          const t = colorSelectOptions.find((dd) => dd.value === value);
          if (t) colorSelect.push(t);
        });
        Obj.colorSelectList = colorSelect;
        Obj.colorSelectLabelList = [];
        Obj.colorSelectLabelList_EN = [];
        Obj.colorSelectLabelList_TC = [];
        Obj.colorSelectLabelList_JA = [];
        colorSelect.forEach((d) => {
          Obj.colorSelectLabelList?.push(d.label);
          Obj.colorSelectLabelList_EN?.push(d.labelEn!);
          Obj.colorSelectLabelList_JA?.push(d.labelJa!);
          Obj.colorSelectLabelList_TC?.push(d.labelTw!);
        });
      }
      //
      let rankSelect: SelectOptionWarp;
      if (rank) {
        rankSelect = rankSelectOptions.find((d) => d.value === rank)!;
        Obj.rankSelect = rankSelect;
        if (rankSelect) {
          Obj.rankSelectLabel = rankSelect.label;
          Obj.rankSelectLabel_EN = rankSelect.labelEn;
          Obj.rankSelectLabel_JA = rankSelect.labelJa;
          Obj.rankSelectLabel_TC = rankSelect.labelTw;
        }
      }
      //
      const hardwareSelect: SelectOptionWarp[] = [];
      if (hardware && hardware instanceof Array) {
        hardware?.forEach((value) => {
          const t = hardwareSelectOptions.find((dd) => dd.value === value);
          if (t) hardwareSelect.push(t);
        });
        Obj.hardwareSelectList = hardwareSelect;
        Obj.hardwareSelectLabel = [];
        Obj.hardwareSelectLabel_EN = [];
        Obj.hardwareSelectLabel_JA = [];
        Obj.hardwareSelectLabel_TC = [];
        hardwareSelect.forEach((d) => {
          Obj.hardwareSelectLabel?.push(d.label);
          Obj.hardwareSelectLabel_EN?.push(d.labelEn!);
          Obj.hardwareSelectLabel_JA?.push(d.labelJa!);
          Obj.hardwareSelectLabel_TC?.push(d.labelTw!);
        });
      }
      //
      const accessorySelect: SelectOptionWarp[] = [];
      if (accessory && accessory instanceof Array) {
        accessory?.forEach((value) => {
          const t = accessorySelectOptions.find((dd) => dd.value === value);
          if (t) accessorySelect.push(t);
        });
        Obj.accessorySelectList = accessorySelect;
        Obj.accessorySelectLabel = [];
        Obj.accessorySelectLabel_EN = [];
        Obj.accessorySelectLabel_JA = [];
        Obj.accessorySelectLabel_TC = [];
        accessorySelect.forEach((d) => {
          Obj.accessorySelectLabel?.push(d.label);
          Obj.accessorySelectLabel_EN?.push(d.labelEn!);
          Obj.accessorySelectLabel_JA?.push(d.labelJa!);
          Obj.accessorySelectLabel_TC?.push(d.labelTw!);
        });
      }
      //
      let stampSelect: SelectOptionWarp;
      if (stamp) {
        stampSelect = stampSelectOptions.find((d) => d.value === stamp)!;
        Obj.stampSelect = stampSelect;
        if (stampSelect) {
          Obj.stampSelectLabel = stampSelect.label;
          Obj.stampSelectLabel_EN = stampSelect.labelEn;
          Obj.stampSelectLabel_JA = stampSelect.labelJa;
          Obj.stampSelectLabel_TC = stampSelect.labelTw;
        }
      }
      //
      const materialSelect: CascaderOptionWarp[] = [];
      const materialLabel: string[] = [];
      const materialLabel_EN: string[] = [];
      const materialLabel_JA: string[] = [];
      const materialLabel_TC: string[] = [];
      if (material && material instanceof Array) {
        const tempArr = material?.map((d) => d[d.length - 1]) || [];
        // materialCascaderOptions拿不到最新值，采用Ref
        tempArr.forEach((material) => {
          const target = findCascaderOptionById(
            material,
            materialCascaderOptionsRef.current
          ) as CascaderOptionWarp;
          if (target) {
            materialSelect.push(target);
            materialLabel.push(target.label);
            materialLabel_EN.push(target.labelEn!);
            materialLabel_JA.push(target.labelJa!);
            materialLabel_TC.push(target.labelTw!);
          }
        });
      }
      Obj.materialSelectList = materialSelect;
      Obj.materialSelectLabelList = materialLabel;
      Obj.materialSelectLabelList_EN = materialLabel_EN;
      Obj.materialSelectLabelList_JA = materialLabel_JA;
      Obj.materialSelectLabelList_TC = materialLabel_TC;
      //
      let pcList: CascaderOptionWarp;
      if (productCategoryId && productCategoryId instanceof Array) {
        pcList = findCascaderOptionById(
          productCategoryId[productCategoryId?.length - 1],
          productCategoryCascaderOptions
        ) as CascaderOptionWarp;
        if (pcList) {
          Obj.productCategorySelectList = pcList;
          Obj.productCategorySelectLabelList = pcList.label;
          Obj.productCategorySelectLabelList_EN = pcList.labelEn;
          Obj.productCategorySelectLabelList_JA = pcList.labelJa;
          Obj.productCategorySelectLabelList_TC = pcList.labelTw;
        }
      }
      return Obj;
    },
    [
      accessorySelectOptions,
      colorSelectOptions,
      hardwareSelectOptions,
      productCategoryCascaderOptions,
      rankSelectOptions,
      stampSelectOptions,
    ]
  );

  /** productInfo改变
   *  导致fillData改变
   *  导致showData改变
   *  */
  useEffect(() => {
    if (!productInfo || Object.keys(productInfo).length === 0) return;
    const obj = getFormFillData(productInfo);
    setFillData(obj);
    const obj1 = getShowData(obj);
    setShowData(obj1);
  }, [
    productInfo,
    productCategoryCascaderOptions,
    colorSelectOptions,
    rankSelectOptions,
    stampSelectOptions,
    materialCascaderOptionsMap,
    hardwareSelectOptions,
    accessorySelectOptions,
    getFormFillData,
    getShowData,
  ]);

  return {
    // 接口数据
    productInfo,
    setProductInfo,
    // Form表单需要的内容
    colorList: colorSelectOptions,
    rankList: rankSelectOptions,
    stampList: stampSelectOptions,
    hardwareList: hardwareSelectOptions,
    materialList: materialCascaderOptions,
    productCategoryList: productCategoryCascaderOptions,
    accessoryList: accessorySelectOptions,
    materialCascaderOptionsMap: materialCascaderOptionsMap,
    // 填充值对象
    fillData,
    showData,
    // 方法
    getProductInfo,
    productCategoryChange,
    getShowData,
    getFormFillData,
  };
};

export default useProductFormData;
