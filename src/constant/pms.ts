/** 翻译对应字段Map 只有英文和日文 */
export const langMap: any = {
  1: 'labelJa',
  2: 'labelEn',
  3: 'labelEn',
};
/** 补充名称 */
export const NameOptions = [
  {
    label: 'Shadow',
    value: 'Shadow',
  },
  {
    label: 'In & Out',
    value: 'In & Out',
  },
  {
    label: 'Touch',
    value: 'Touch',
  },
  {
    label: 'Ghillies',
    value: 'Ghillies',
  },
  {
    label: 'Himalaya',
    value: 'Himalaya',
  },
  {
    label: 'Lakis',
    value: 'Lakis',
  },
  {
    label: 'Colormatic',
    value: 'Colormatic',
  },
];
/** 价签成色 */
export const RankOption = [
  {
    value: 'N',
    labelEn: 'Rank N',
    labelJa: 'ランク N',
  },
  {
    value: 'NS',
    labelEn: 'Rank NS',
    labelJa: 'ランク NS',
  },
  {
    value: 'SA',
    labelEn: 'Rank SA',
    labelJa: 'ランク SA',
  },
  {
    value: 'A',
    labelEn: 'Rank A',
    labelJa: 'ランク A',
  },
  {
    value: 'AB',
    labelEn: 'Rank AB',
    labelJa: 'ランク AB',
  },
  {
    value: 'B',
    labelEn: 'Rank B',
    labelJa: 'ランク B',
  },
  {
    value: 'BC',
    labelEn: 'Rank BC',
    labelJa: 'ランク BC',
  },
];
/** 价签语言 1日语 2、3英语 */
interface LangageAttributeType {
  [key: string]: {
    [key: number]: string;
  };
}

export const LangageAttribute: LangageAttributeType = {
  color: {
    1: '色',
    2: 'Color',
    3: 'Color',
  },
  material: {
    1: '素材',
    2: 'Material',
    3: 'Material',
  },
  hardware: {
    1: '金具',
    2: 'Hardware',
    3: 'Hardware',
  },
  stamp: {
    1: '刻印',
    2: 'Stamp',
    3: 'Stamp',
  },
};
