export type I18n = { ja: string; en: string; zh_CN: string };

export type MallCountry = {
  id: number;
  areaCode: string;
  code: string;
  name: string;
  lanuage: string;
  cityList?: MallCity[];
  nameI18n: I18n;
};

export type MallCity = {
  id: number;
  code: string;
  countryCode: string;
  name: string;
  nameI18n: I18n;
};