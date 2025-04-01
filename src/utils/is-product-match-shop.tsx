import { SHOP_MAP, STOCK_PLACE_MAP } from 'commons/options';

const isProductMatchShop = ({
  shopId,
  stockPlace,
}: {
  shopId?: number;
  stockPlace?: string;
}) => {
  if (shopId === SHOP_MAP.GINZA && stockPlace === STOCK_PLACE_MAP.JAPAN)
    return true;

  if (shopId === SHOP_MAP.HONGKONG && stockPlace === STOCK_PLACE_MAP.HONGKONG)
    return true;

  if (
    stockPlace &&
    shopId === SHOP_MAP.SINGAPORE &&
    [STOCK_PLACE_MAP.SINGAPORE_ASU, STOCK_PLACE_MAP.SINGAPORE_GX].includes(
      stockPlace
    )
  )
    return true;

  return false;
};

export default isProductMatchShop;
