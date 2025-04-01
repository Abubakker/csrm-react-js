import { useState } from 'react';

const usePagination = <T>() => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  return {
    loading,
    setLoading,
    dataSource,
    setDataSource,
    pageNum,
    setPageNum,
    pageSize,
    setPageSize,
    total,
    setTotal,
  };
};

export default usePagination;
