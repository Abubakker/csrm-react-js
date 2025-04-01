import { Button, Image, Switch, Table, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { CmsApi, CmsHelpCategory } from 'apis/cms';
import LOCALS from 'commons/locals';
import i18n from 'i18n';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import CmsArticleCategoryEditModal from './edit-modal';

const CmsArticleCategoryPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectData, setSelectData] = useState<CmsHelpCategory>();
  const [helpCategoryList, setHelpCategoryList] = useState<CmsHelpCategory[]>(
    []
  );

  const getList = useCallback(() => {
    setLoading(true);
    CmsApi.getHelpCategory()
      .then((res) => {
        setHelpCategoryList(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => getList(), [getList]);

  const columns: ColumnsType<CmsHelpCategory> = useMemo(() => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '10%',
      },
      {
        title: i18n.t('title'),
        dataIndex: 'name',
        key: 'name',
        width: '30%',
      },
      {
        title: i18n.t('category_icon'),
        dataIndex: 'icon',
        key: 'icon',
        width: '20%',
        render(icon?: string) {
          if (!icon) return '-';
          return <Image src={icon} alt="" height={100} />;
        },
      },
      {
        title: i18n.t('status'),
        dataIndex: 'showStatus',
        key: 'showStatus',
        width: '10%',
        render(showStatus, data: CmsHelpCategory) {
          return (
            <Switch
              checked={showStatus === 1}
              onChange={async () => {
                setLoading(true);
                await CmsApi.getHelpCategoryEdit({
                  ...data,
                  showStatus: showStatus ? 0 : 1,
                });
                getList();
              }}
            />
          );
        },
      },
      {
        key: 'options',
        title: <Trans i18nKey={LOCALS.options} />,
        fixed: 'right',
        width: '10%',
        render: (data: CmsHelpCategory) => {
          return (
            <div>
              <Button
                type="link"
                onClick={() => {
                  setSelectData(data);
                  setOpen(true);
                }}
              >
                <Trans i18nKey={LOCALS.edit} />
              </Button>

              <Popconfirm
                title={i18n.t('delete')}
                description={
                  <div className="w-[150px]">
                    {i18n.t('are_you_sure_to_delete')}
                  </div>
                }
                onConfirm={async () => {
                  await CmsApi.helpCategoryDelete(data.id);
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
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSelectData(undefined);
            setOpen(true);
          }}
        >
          {i18n.t('add')}
        </Button>
      </div>
      <Table
        tableLayout="fixed"
        bordered
        loading={loading}
        rowKey={'id'}
        style={{
          marginTop: 12,
        }}
        dataSource={helpCategoryList}
        columns={columns}
      />

      {open && (
        <CmsArticleCategoryEditModal
          open={open}
          onClose={() => setOpen(false)}
          data={selectData}
          onLoad={getList}
        />
      )}
    </div>
  );
};

export default CmsArticleCategoryPage;
