import { useMemo } from 'react';
import { useAppSelector } from 'store/hooks';
import { selectUserInfo } from 'store/slices/userInfoSlice';

/**
 * @description 用户权限点判断 hook
 */
const useResource = (resource: string) => {
  const { isLoading, resources } = useAppSelector(selectUserInfo);

  const flag = useMemo(() => {
    // 权限还没加载，返回 false
    if (isLoading) {
      return false;
    }

    return !!resources.find((i) => i.url === resource);
  }, [isLoading, resource, resources]);

  return flag;
};

export default useResource;
