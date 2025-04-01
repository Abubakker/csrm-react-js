import { Descriptions, Pagination, Spin, Empty, Badge } from 'antd';
import React from 'react';
import { PaginationProps } from 'antd/es/pagination';
import { useDescProps } from 'commons/hooks/useDescProps';

// 定义列接口
interface ColumnProps<T> {
  title: string | React.ReactNode;
  key: string;
  dataIndex?: string | number;
  render?: (text: any, record: T) => React.ReactNode | string | undefined;
}

// 定义列数组类型
export type ColumnsProps<T> = ColumnProps<T>[];

interface Props<T> {
  columns: ColumnsProps<T>;
  dataSource: T[];
  loading?: boolean;
  pagination?: PaginationProps;
}

const DescriptionsMobileList = <T extends { [key: string]: any }>({
  dataSource,
  columns,
  loading,
  pagination,
}: Props<T>) => {
  const descProps = useDescProps({ mode: 2 });
  return (
    <>
      <Spin spinning={loading}>
        <div className="abs">
          {dataSource.map((item, i) => (
            <div key={i}>
              <Badge.Ribbon text={`No.${i + 1}`} />
              <Descriptions bordered {...descProps} className="mb-2">
                {columns.map((column, ii) => {
                  const dataIndex =
                    column.dataIndex && item[column.dataIndex]
                      ? item[column.dataIndex]
                      : null;
                  return (
                    <Descriptions.Item label={column.title} key={ii}>
                      {column.render
                        ? column.render(dataIndex, item)
                        : dataIndex}
                    </Descriptions.Item>
                  );
                })}
              </Descriptions>
            </div>
          ))}
          {dataSource.length === 0 && <Empty />}
          {dataSource.length && (
            <div className="flex justify-end">
              <Pagination {...pagination} />
            </div>
          )}
        </div>
      </Spin>
    </>
  );
};
export default DescriptionsMobileList;
