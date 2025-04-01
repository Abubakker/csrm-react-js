import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { selectUserInfo } from 'store/slices/userInfoSlice';

const useCurrentShopStaffs = () => {
  const { isLoading, shop } = useAppSelector(selectUserInfo);
  const { staffSelectOptions } = useAppSelector(selectGlobalInfo);

  if (isLoading) return [];

  // 对于没有所属店铺的账号，返回所有的工作人员
  if (!shop) return staffSelectOptions;

  return staffSelectOptions.filter((i) => i.shop === shop);
};

export default useCurrentShopStaffs;
