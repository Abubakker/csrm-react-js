import { getProductCategoryTree } from 'apis/pms';
import { getLocalStorageLanguage } from 'commons';
import { LANGUAGE_MAP } from 'commons/options';
import { useEffect, useState } from 'react';
import { CascaderOption } from 'types/base';
import { ProductCategory } from 'types/pms';

const treeTransform = (
  productCategories: ProductCategory[],
  language: string,
  prevTreeIds?: string
) => {
  const options: CascaderOption[] = [];

  productCategories.forEach(
    ({
      children,
      id,
      name,
      nameJa,
      nameZh,
      nameTw,
      value,
      size: sizeEn,
      sizeJa,
      sizeZh,
      sizeTw,
    }) => {
      const labelMap = {
        [LANGUAGE_MAP.EN]: name,
        [LANGUAGE_MAP.JA]: nameJa,
        [LANGUAGE_MAP.ZH_CN]: nameZh,
      };

      const sizeMap = {
        [LANGUAGE_MAP.EN]: sizeEn,
        [LANGUAGE_MAP.JA]: sizeJa,
        [LANGUAGE_MAP.ZH_CN]: sizeZh,
      };

      const label = labelMap[language] || '';
      const size = sizeMap[language] || '';

      const treeIds = prevTreeIds ? `${prevTreeIds},${id}` : `${id}`;
      const option: CascaderOption = {
        value: id,
        label,
        children: children ? treeTransform(children, language, treeIds) : [],
        treeIds,
        key: value,
        size,
        // 追加
        label_en: name,
        label_ja: nameJa,
        nameJa,
        nameTw,
        nameZh,
        nameEn: name,
        sizeJa,
        sizeTw,
        sizeZh,
        sizeEn,
      };
      options.push(option);
    }
  );

  return options;
};

const useProductCategoryTree = () => {
  const [options, setOptions] = useState<CascaderOption[]>([]);
  const language = getLocalStorageLanguage();

  useEffect(() => {
    (async () => {
      const res = await getProductCategoryTree();

      setOptions(treeTransform(res.data, language));
    })();
  }, [language]);

  return options;
};

export default useProductCategoryTree;
