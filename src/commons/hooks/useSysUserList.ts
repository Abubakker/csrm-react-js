import { getSysUserSimpleList } from 'apis/sys';
import { useEffect, useState } from 'react';
import { SysUser } from 'types/sys';

const useSysUserList = () => {
  const [sysUserList, setSysUserList] = useState<SysUser[]>([]);

  useEffect(() => {
    getSysUserSimpleList().then((res) => {
      setSysUserList(res.data);
    });
  }, []);

  return sysUserList;
};

export default useSysUserList;
