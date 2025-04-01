import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getLocalStorageLanguage } from 'commons';
import { RootState } from 'store';
import { CascaderOption, SelectOption, I18nLabel } from 'types/base';
import { SysUser } from 'types/sys';

type SelectOptionLabelList = (SelectOption & I18nLabel)[];

export interface GlobalInfoState {
  language: string;
  colorSelectOptions: SelectOptionLabelList;
  stampSelectOptions: SelectOptionLabelList;
  rankSelectOptions: SelectOptionLabelList;
  materialCascaderOptionsMap: { [key: string]: CascaderOption[] };
  productCategoryCascaderOptions: CascaderOption[];
  staffSelectOptions: (SelectOption & Pick<SysUser, 'shop'>)[];
  typeSelectOptions: SelectOption[];
  hueSelectOptions: SelectOption[];
  hardwareSelectOptions: SelectOptionLabelList;
  accessorySelectOptions: SelectOption[];
  collectionSelectOptionsMap: { [key: string]: SelectOption[] };
  orderStatusOptions: SelectOption[];
  payStatusOptions: SelectOption[];
  orderTypeOptions: SelectOption[];
  countryOptions: SelectOption[];
  countryCodeOptions: SelectOption[];
}

const initialState: GlobalInfoState = {
  language: getLocalStorageLanguage(),
  colorSelectOptions: [],
  stampSelectOptions: [],
  rankSelectOptions: [],
  materialCascaderOptionsMap: {},
  productCategoryCascaderOptions: [],
  staffSelectOptions: [],
  typeSelectOptions: [],
  hueSelectOptions: [],
  hardwareSelectOptions: [],
  accessorySelectOptions: [],
  collectionSelectOptionsMap: {},
  orderStatusOptions: [],
  payStatusOptions: [],
  orderTypeOptions: [],
  countryOptions: [],
  countryCodeOptions: [],
};

export const globalInfoSlice = createSlice({
  name: 'globalInfo',
  initialState,
  reducers: {
    setLanguage: (
      state,
      action: PayloadAction<GlobalInfoState['language']>
    ) => {
      state.language = action.payload;
    },
    setMaterialCascaderOptionMap: (
      state,
      action: PayloadAction<GlobalInfoState['materialCascaderOptionsMap']>
    ) => {
      state.materialCascaderOptionsMap = action.payload;
    },
    setColorSelectOptions: (
      state,
      action: PayloadAction<GlobalInfoState['colorSelectOptions']>
    ) => {
      state.colorSelectOptions = action.payload;
    },
    setStampSelectOptions: (
      state,
      action: PayloadAction<GlobalInfoState['stampSelectOptions']>
    ) => {
      state.stampSelectOptions = action.payload;
    },
    setRankSelectOptions: (
      state,
      action: PayloadAction<GlobalInfoState['rankSelectOptions']>
    ) => {
      state.rankSelectOptions = action.payload;
    },
    setProductCategoryCascaderOptions: (
      state,
      action: PayloadAction<GlobalInfoState['productCategoryCascaderOptions']>
    ) => {
      state.productCategoryCascaderOptions = action.payload;
    },
    setStaffSelectOptions: (
      state,
      action: PayloadAction<GlobalInfoState['staffSelectOptions']>
    ) => {
      state.staffSelectOptions = action.payload;
    },
    setTypeSelectOptions: (
      state,
      action: PayloadAction<GlobalInfoState['typeSelectOptions']>
    ) => {
      state.typeSelectOptions = action.payload;
    },
    setHueSelectOptions: (
      state,
      action: PayloadAction<GlobalInfoState['hueSelectOptions']>
    ) => {
      state.hueSelectOptions = action.payload;
    },
    setHardwareSelectOptions: (
      state,
      action: PayloadAction<GlobalInfoState['hardwareSelectOptions']>
    ) => {
      state.hardwareSelectOptions = action.payload;
    },
    setAccessorySelectOptions: (
      state,
      action: PayloadAction<GlobalInfoState['accessorySelectOptions']>
    ) => {
      state.accessorySelectOptions = action.payload;
    },
    setCollectionSelectOptionsMap: (
      state,
      action: PayloadAction<GlobalInfoState['collectionSelectOptionsMap']>
    ) => {
      state.collectionSelectOptionsMap = action.payload;
    },
    setOrderStatusOptions: (
      state,
      action: PayloadAction<GlobalInfoState['orderStatusOptions']>
    ) => {
      state.orderStatusOptions = action.payload;
    },
    setPayStatusOptions: (
      state,
      action: PayloadAction<GlobalInfoState['payStatusOptions']>
    ) => {
      state.payStatusOptions = action.payload;
    },
    setOrderTypeOptions: (
      state,
      action: PayloadAction<GlobalInfoState['orderTypeOptions']>
    ) => {
      state.orderTypeOptions = action.payload;
    },
    setCountryOptions: (
      state,
      action: PayloadAction<GlobalInfoState['countryOptions']>
    ) => {
      state.countryOptions = action.payload;
    },
    setCountryCodeOptions: (
      state,
      action: PayloadAction<GlobalInfoState['countryCodeOptions']>
    ) => {
      state.countryCodeOptions = action.payload;
    },
  },
});

export const {
  setLanguage,
  setMaterialCascaderOptionMap,
  setColorSelectOptions,
  setStampSelectOptions,
  setRankSelectOptions,
  setProductCategoryCascaderOptions,
  setStaffSelectOptions,
  setTypeSelectOptions,
  setHueSelectOptions,
  setHardwareSelectOptions,
  setAccessorySelectOptions,
  setCollectionSelectOptionsMap,
  setOrderStatusOptions,
  setPayStatusOptions,
  setOrderTypeOptions,
  setCountryOptions,
  setCountryCodeOptions,
} = globalInfoSlice.actions;

export const selectGlobalInfo = (state: RootState) => state.globalInfo;

export default globalInfoSlice.reducer;
