import { getProductAttributeCodeList } from 'apis/pms';
import { getLocalStorageLanguage } from 'commons';
import { LANGUAGE_MAP } from 'commons/options';
import { useEffect, useState } from 'react';
import { ProductAttributeCode, ProductAttributeCodeNames } from 'types/pms';

export interface ProductAttributeCodeOption extends ProductAttributeCode {
  label: string;
  children?: ProductAttributeCode[];
}

const useProductAttributeCodeList = (names: ProductAttributeCodeNames[]) => {
  const [options, setOptions] = useState<ProductAttributeCodeOption[][]>(
    names.map(() => [])
  );
  const language = getLocalStorageLanguage();

  useEffect(() => {
    const newOptions: ProductAttributeCodeOption[][] = [];

    getProductAttributeCodeList().then((res) => {
      const targets = names.map((name) => {
        return res.data.find((i) => i.name === name);
      });

      targets.forEach((target) => {
        const option = target
          ? target.itemList
              .filter((i) => i.enabled)
              .map((i) => {
                const {
                  labelCn,
                  labelEn,
                  labelJa,
                } = i;
                const labelMap = {
                  [LANGUAGE_MAP.EN]: labelEn,
                  [LANGUAGE_MAP.JA]: labelJa,
                  [LANGUAGE_MAP.ZH_CN]: labelCn,
                };

                return {
                  label: labelMap[language] || '',
                  ...i,
                };
              })
              .sort((a, b) => {
                const labelA = a.label.toLowerCase();
                const labelB = b.label.toLowerCase();

                if (labelA > labelB) {
                  return 1;
                } else if (labelA < labelB) {
                  return -1;
                } else {
                  return 0;
                }
              })
          : [];

        newOptions.push(option);
      });

      setOptions(newOptions);
    });
  }, [language, names]);

  return options;
};

export default useProductAttributeCodeList;
