import { SHOP_OPTION_LIST, findLabelByValue } from 'commons/options';
import { useAppSelector } from 'store/hooks';
import { selectUserInfo } from 'store/slices/userInfoSlice';

const CurrentShop = () => {
  const { shop } = useAppSelector(selectUserInfo);

  if (!shop) return null;

  return findLabelByValue(shop, SHOP_OPTION_LIST);
};

export default CurrentShop;
