import { OmsRecycleOrderCreateProducts_Form } from './product-info';
import { PayInfoForm } from './pay-info';
import { UserInfoForm } from './user-info';

export const ITEM_NAME_MAP = {
  RECYCLING_CONSIGNMENT_CONTRACT: 'recycling-consignment-contract',
  RECYCLING_CONSIGNMENT_INTENTION: 'recycling-consignment-intention',
};

export const setRecyclingConsignmentStore = (
  name: string,
  data: {
    products?: OmsRecycleOrderCreateProducts_Form[];
    payInfo?: PayInfoForm;
    userInfo?: UserInfoForm;
  }
) => {
  const dataParse = getRecyclingConsignmentStore(name);
  const newData = JSON.stringify({ ...dataParse, ...data });
  localStorage.setItem(name, newData);
};

export const getRecyclingConsignmentStore = (name: string) => {
  const dataParse = JSON.parse(localStorage.getItem(name) || '{}');
  return dataParse;
};

export const removeRecyclingConsignmentStore = (name: string) => {
  localStorage.removeItem(name);
};
