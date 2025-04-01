import { Button, Popconfirm, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { CmsApi, CmsSubjectProductRelations, CmsSubject } from 'apis/cms';
import LOCALS from 'commons/locals';
import i18n from 'i18n';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CmsSubjectProductAddModal from './add-modal';
const CmsSubjectProductRelationListPage = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>();
  const [open, setOpen] = useState<boolean>();
  const [detail, setDetail] = useState<CmsSubject>();
  const [dataSource, setDataSource] = useState<CmsSubjectProductRelations[]>(
    []
  );
  // const [selectedRows, setSelectedRows] = useState<
  //   CmsSubjectProductRelations[]
  // >([]);

  const getList = useCallback(async () => {
    setLoading(true);
    CmsApi.getSubjectDetail(Number(id)).then((data) => {
      setDetail(data);
      setDataSource(data.cmsSubjectProductRelations);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    getList();
  }, [getList]);

  const columns: ColumnsType<CmsSubjectProductRelations> = useMemo(() => {
    return [
      {
        title: i18n.t('product_sn'),
        dataIndex: 'productSn',
        key: 'productSn',
        render: (_, record: CmsSubjectProductRelations) => {
          return record?.pmsProduct?.productSn || '-';
        },
      },
      {
        title: i18n.t('product_name_1'),
        dataIndex: 'name',
        key: 'name',
        render: (_, record: CmsSubjectProductRelations) => {
          return record?.pmsProduct?.name || '-';
        },
      },

      {
        title: i18n.t('list_remark'),
        dataIndex: 'productSubTitle',
        key: 'productSubTitle',
        render: (_, record: CmsSubjectProductRelations) => {
          return record?.pmsProduct?.note || '-';
        },
      },
      {
        key: 'options',
        title: <Trans i18nKey={LOCALS.options} />,
        fixed: 'right',
        width: 220,
        render: ({ id }: CmsSubjectProductRelations) => {
          return (
            <div>
              <Popconfirm
                title={i18n.t('delete')}
                description={
                  <div className="w-[150px]">
                    {i18n.t('are_you_sure_to_delete')}
                  </div>
                }
                onConfirm={async () => {
                  await CmsApi.subjectProductDelete(id);
                  getList();
                }}
              >
                <Button type="link" danger>
                  <Trans i18nKey={LOCALS.delete} />
                </Button>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
  }, [getList]);

  return (
    <div>
      <div className="flex">
        <div className="w-[50%]">
          <Button
            className="mr-4"
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              window.history.back();
            }}
          >
            {i18n.t('back')}
          </Button>
          <span className="font-bold mr-4 text-xl">{detail?.title}</span>
        </div>
        <div className="w-[50%] flex justify-end">
          <Button
            className="mr-4"
            onClick={() => {
              setOpen(true);
            }}
          >
            {i18n.t('add')}
          </Button>
        </div>
      </div>
      <Table
        tableLayout="fixed"
        bordered
        // rowSelection={{
        //   selectedRowKeys: selectedRows.map((d) => d.id) as React.Key[],
        //   onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        // }}
        loading={loading}
        rowKey={'id'}
        style={{
          marginTop: 12,
        }}
        dataSource={dataSource}
        columns={columns}
      />

      {open && (
        <CmsSubjectProductAddModal
          open={open}
          onClose={() => setOpen(false)}
          data={detail}
          onLoad={getList}
        />
      )}
    </div>
  );
};

export default CmsSubjectProductRelationListPage;
