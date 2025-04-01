import { BRAND_LIST, LANGUAGE_MAP } from 'commons/options';
import { useEffect, useState } from 'react';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { SelectOption } from 'types/base';

export type BrandType = SelectOption & {
  descJa: string;
  descZh: string;
  descEn: string;
  descZhTw: string;
};

const useBrandList = () => {
  const { language } = useAppSelector(selectGlobalInfo);

  const [list, setList] = useState<BrandType[]>([]);

  useEffect(() => {
    if (language) {
      const t = BRAND_LIST.map(({ value, nameZh, nameEn, nameJa, ...rest }) => {
        const labelMap = {
          [LANGUAGE_MAP.EN]: nameEn,
          [LANGUAGE_MAP.JA]: nameJa,
          [LANGUAGE_MAP.ZH_CN]: nameZh,
        };
        return { value, label: labelMap[language], ...rest };
      });
      setList(t);
    }
  }, [language]);

  return {
    BrandList: list,
    DefaultBrand: list[0] || [],
    SourceBrandList: BRAND_LIST,
  };
};

export default useBrandList;
