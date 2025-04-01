import { PaginationProps, Table } from 'antd';

type CouponTableProps = {
  data: any[];
  isLoading?: boolean;
  updateLoading?: boolean;
  columns: any[];
  pagination?: any;
  onChange?: (pagination: PaginationProps) => void;
};

const CouponTable = ({
  data,
  isLoading,
  updateLoading,
  columns,
  pagination,
  onChange,
}: CouponTableProps) => (
  <Table
    loading={isLoading || updateLoading}
    columns={columns}
    dataSource={data}
    pagination={pagination}
    onChange={onChange}
    components={{
      header: {
        cell: (props: any) => (
          <th
            {...props}
            style={{
              backgroundColor: '#EBEDF7',
              color: '#575A6E',
              fontSize: '10px',
              fontWeight: '500',
              lineHeight: '16px',
              letterSpacing: '0.5px',
              padding: '12px 8px',
              textTransform: 'uppercase',
              fontFamily: 'sans-serif',
            }}
          />
        ),
      },
    }}
  />
);

export default CouponTable;
