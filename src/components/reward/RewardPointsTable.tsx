import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import type { ColumnsType } from 'antd/es/table';
import InputField from './reward-table/InputField';
import { Table } from 'antd';
import { TableData } from './ViewReward';
import { useState } from 'react';

interface RewardPointsTableProps {
  rewardPointsData: any[];
  setSearchKeyword: (value: string) => void;
}

const RewardPointsTable = ({
  rewardPointsData,
  setSearchKeyword,
}: RewardPointsTableProps) => {
  const [keyword, setKeyword] = useState('');

  const handleSearchPoints = () => {
    setSearchKeyword(keyword);
  };

  const { t } = useTranslation();

  const columns: ColumnsType<TableData> = [
    {
      title: t('user_id_title'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('user_name_title'),
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: t('email_title'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('total_availed_title'),
      dataIndex: 'availed_count',
      key: 'availed_count',
    },
  ];

  return (
    <>
      <div className="flex gap-4 items-end">
        <InputField
          id="keyword"
          label={t('keyword_label')}
          placeholder={t('search_placeholder') || ''}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <Button
          type="primary"
          onClick={handleSearchPoints}
          className="h-[42px] rounded-[10px] font-bold text-[12px]"
        >
          {t('search_btn')}
        </Button>
      </div>

      <div className="custom-table mt-6">
        <Table
          columns={columns}
          dataSource={rewardPointsData}
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
                  }}
                />
              ),
            },
          }}
        />
      </div>
    </>
  );
};

export default RewardPointsTable;
