import type { CascaderProps } from 'antd';

export type BaseRes<T> = {
  code: number;
  message: string;
  data: T;
};

export type PageQuery = {
  pageNum: number;
  pageSize: number;
};

export type I18nLabel = {
  labelEn?: string;
  labelJa?: string;
  labelTw?: string;
  labelCn?: string;
};

export type CascaderOption = {
  value: string | number;
  label: string;
  children?: CascaderOption[];
  treeIds?: string;
  key?: string;
  size?: string;
  sort?: number;
  // 追加
  label_en?: string;
  label_ja?: string;
  labelEn?: string;
  nameJa?: string;
  nameTw?: string;
  nameZh?: string;
  nameEn?: string;
  sizeJa?: string;
  sizeTw?: string;
  sizeZh?: string;
  sizeEn?: string;
};

export type CascaderOptionWarp = {
  value: string | number;
  label: string;
  children?: CascaderOption[];
  treeIds?: string;
  key?: string;
  size?: string;
} & I18nLabel;

export type SelectOption = {
  value: string | number;
  label: string;
  sort?: number;
};

export type SelectOptionWarp = {
  value: string | number;
  label: string;
  sort?: number;
  refProperty2?: string;
  refProperty1?: string;
} & I18nLabel;

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// 现 antd 版本没有 GetProps Cascader需要用到
export type GetProps<T extends React.ComponentType<any> | object> =
  T extends React.ComponentType<infer P> ? P : T extends object ? T : never;
export type GetProp<
  T extends React.ComponentType<any> | object,
  PropName extends keyof GetProps<T>
> = NonNullable<GetProps<T>[PropName]>;
export type DefaultOptionType = GetProp<CascaderProps, 'options'>[number];
