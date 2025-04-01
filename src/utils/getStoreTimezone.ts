import { SHOP_MAP } from 'commons/options';

const TIMEZONE_MAP = {
  TOKYO: 'Asia/Tokyo',
  SHANG_HAI: 'Asia/Shanghai',
};

const getStoreTimezone = (storeId: number | string) => {
  const storeIdNum = +storeId;

  if ([SHOP_MAP.HONGKONG, SHOP_MAP.SINGAPORE].includes(storeIdNum)) {
    return TIMEZONE_MAP.SHANG_HAI;
  } else {
    return TIMEZONE_MAP.TOKYO;
  }
};

export default getStoreTimezone;
