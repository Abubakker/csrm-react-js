import { getSysDictList } from 'apis/sys';
import { useEffect, useState } from 'react';

const useSysDict = <T>(key: string) => {
  const [data, setData] = useState<T>();

  useEffect(() => {
    getSysDictList().then((res) => {
      const target = res.data.records.find((i) => i.type === key);
      if (target) setData(target.valueList as T);
    });
  }, [key]);

  return data;
};

export default useSysDict;
