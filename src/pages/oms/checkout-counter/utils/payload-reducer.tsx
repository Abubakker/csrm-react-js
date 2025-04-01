import { StoreCreateOrderDto } from 'types/oms';
import { PmsProduct } from 'types/pms';

export type State = Omit<StoreCreateOrderDto, 'productList' | 'paymentList'> & {
  totalIntegration: number;
  productList: (StoreCreateOrderDto['productList'][number] &
    Pick<PmsProduct, 'currency' | 'stockPlace' | 'name'>)[];
};

export enum ActionType {
  UPDATE_BATCH = 'UPDATE_BATCH',
  RESET = 'RESET',
}

type UpdateAction = {
  type: ActionType.UPDATE_BATCH | ActionType.RESET;
  payload?: Partial<State>;
};

export type Action = UpdateAction;

// 初始值
export const initState: State = {
  memberId: undefined,
  useIntegration: 0,
  promotionAmount: 0,
  isPointsGiven: true,
  payMode: 0,
  createdFrom: undefined,
  staffName: '',
  totalIntegration: 0,
  productList: [],
  couponCode: '',
};

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionType.UPDATE_BATCH:
      return { ...state, ...action.payload };
    case ActionType.RESET:
      return { ...initState };
    default:
      throw new Error();
  }
}
