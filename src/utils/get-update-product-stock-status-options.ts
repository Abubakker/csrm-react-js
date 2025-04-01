import {
  PMS_PRODUCT_STOCK_STATUS,
  PMS_PRODUCT_STOCK_STATUS_OPTION_LIST,
} from 'commons/options';

const getUpdateProductStockStatusOptions = ({
  initStockStatus,
  isProductForSaleToSold,
}: {
  initStockStatus?: string;
  isProductForSaleToSold: boolean;
}) => {
  const map: {
    [key: string]: PMS_PRODUCT_STOCK_STATUS[];
  } = {
    [PMS_PRODUCT_STOCK_STATUS.PENDING_ENTRY]: [
      PMS_PRODUCT_STOCK_STATUS.PENDING_ENTRY,
      PMS_PRODUCT_STOCK_STATUS.STOCKED,
      PMS_PRODUCT_STOCK_STATUS.INVALID,
    ],
    [PMS_PRODUCT_STOCK_STATUS.LENT_OUT]: [
      PMS_PRODUCT_STOCK_STATUS.LENT_OUT,
      PMS_PRODUCT_STOCK_STATUS.STOCKED,
      PMS_PRODUCT_STOCK_STATUS.FOR_SALE,
    ],
    [PMS_PRODUCT_STOCK_STATUS.FOR_SALE]: [
      PMS_PRODUCT_STOCK_STATUS.LENT_OUT,
      PMS_PRODUCT_STOCK_STATUS.FOR_SALE,
      PMS_PRODUCT_STOCK_STATUS.STOCKED,
    ],
    [PMS_PRODUCT_STOCK_STATUS.STOCKED]: [
      PMS_PRODUCT_STOCK_STATUS.STOCKED,
      PMS_PRODUCT_STOCK_STATUS.FOR_SALE,
      PMS_PRODUCT_STOCK_STATUS.LENT_OUT,
      PMS_PRODUCT_STOCK_STATUS.INVALID,
    ],
    [PMS_PRODUCT_STOCK_STATUS.INVALID]: [
      PMS_PRODUCT_STOCK_STATUS.INVALID,
      PMS_PRODUCT_STOCK_STATUS.PENDING_ENTRY,
    ],
    [PMS_PRODUCT_STOCK_STATUS.SOLD]: [
      PMS_PRODUCT_STOCK_STATUS.SOLD,
      PMS_PRODUCT_STOCK_STATUS.STOCKED,
    ],
    [PMS_PRODUCT_STOCK_STATUS.RESERVED]: [PMS_PRODUCT_STOCK_STATUS.RESERVED],
  };
  let options: {
    value: PMS_PRODUCT_STOCK_STATUS;
    label: JSX.Element;
  }[] = [];
  if (isProductForSaleToSold) {
    map[PMS_PRODUCT_STOCK_STATUS.FOR_SALE].push(PMS_PRODUCT_STOCK_STATUS.SOLD);
  }

  if (!initStockStatus) {
    options = PMS_PRODUCT_STOCK_STATUS_OPTION_LIST.filter((i) =>
      [
        PMS_PRODUCT_STOCK_STATUS.PENDING_ENTRY,
        PMS_PRODUCT_STOCK_STATUS.INVALID,
      ].includes(i.value)
    );
  } else if (map[initStockStatus]) {
    options = PMS_PRODUCT_STOCK_STATUS_OPTION_LIST.filter((i) =>
      map[initStockStatus].includes(i.value)
    );
  }
  return options;
};

export default getUpdateProductStockStatusOptions;
