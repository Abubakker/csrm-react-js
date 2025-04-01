import { Button, Modal } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { getMailTemplateList } from 'apis/ums';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { PageQuery } from 'types/base';
import { UmsMemberMailTemplate } from 'types/ums';
import MailTemplateEdit from './mail-template-edit';
import i18n from 'i18n';

const MemberMailTemplate = () => {
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);
  const [mailTemplate, setMailTemplate] =
    useState<UmsMemberMailTemplate | null>(null);

  const {
    loading,
    setLoading,
    pageNum,
    setPageNum,
    pageSize,
    setPageSize,
    total,
    setTotal,
    dataSource,
    setDataSource,
  } = usePagination<UmsMemberMailTemplate>();

  const getDataSource = useCallback(
    async ({ pageNum, pageSize }: PageQuery) => {
      try {
        setLoading(true);
        const {
          data: { list, total },
        } = await getMailTemplateList({
          pageNum,
          pageSize,
        });
        setDataSource(list);
        setTotal(total);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [setDataSource, setLoading, setTotal]
  );

  useEffect(() => {
    getDataSource({ pageNum: 1, pageSize: 10 });
  }, [getDataSource]);

  const columns: ColumnsType<UmsMemberMailTemplate> = useMemo(() => {
    return [
      {
        title: 'KEY',
        key: 'templateName',
        dataIndex: 'templateName',
        width: 200,
      },
      {
        title: <Trans i18nKey={LOCALS.email_template_Description} />,
        key: 'description',
        dataIndex: 'description',
        width: 200,
      },
      {
        width: 250,
        title: <Trans i18nKey={LOCALS.email_template_Subject} />,
        key: 'subject',
        render: ({
          enSubject,
          jaSubject,
          zhCnSubject,
          zhTwSubject,
        }: UmsMemberMailTemplate) => {
          return (
            <div>
              <div className="mb-2">
                <div className="font-semibold">{i18n.t('english')}</div>
                <div>{enSubject}</div>
              </div>

              <div className="mb-2">
                <div className="font-semibold">{i18n.t('japanese')}</div>
                <div>{jaSubject}</div>
              </div>

              <div className="mb-2">
                <div className="font-semibold">{i18n.t('chinese')}</div>
                <div>{zhCnSubject}</div>
              </div>

              <div className="font-semibold">{i18n.t('traditional_chinese')}</div>
              <div>{zhTwSubject}</div>
            </div>
          );
        },
      },
      {
        width: 150,
        title: <Trans i18nKey={LOCALS.email_template_Content} />,
        key: 'content',
        render: ({
          enMailContent,
          jaMailContent,
          zhCnMailContent,
          zhTwMailContent,
        }: UmsMemberMailTemplate) => {
          return (
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="link"
                onClick={() => {
                  setContent(enMailContent || '');
                }}
              >
                {i18n.t('english')}
              </Button>
              <Button
                type="link"
                onClick={() => {
                  setContent(jaMailContent || '');
                }}
              >
                {i18n.t('japanese')}
              </Button>
              <Button
                type="link"
                onClick={() => {
                  setContent(zhCnMailContent || '');
                }}
              >
                {i18n.t('chinese')}
              </Button>
              <Button
                type="link"
                onClick={() => {
                  setContent(zhTwMailContent || '');
                }}
              >
                {i18n.t('traditional_chinese')}
              </Button>
            </div>
          );
        },
      },
      {
        key: 'options',
        title: <Trans i18nKey={LOCALS.options} />,
        width: 150,
        fixed: 'right',
        render: (mailTemplate: UmsMemberMailTemplate) => {
          return (
            <Button
              type="link"
              onClick={() => {
                setOpen(true);
                setMailTemplate({
                  ...mailTemplate,
                });
              }}
            >
              <Trans i18nKey={LOCALS.edit} />
            </Button>
          );
        },
      },
    ];
  }, []);

  return (
    <div>
      <Modal
        open={!!content}
        onCancel={() => {
          setContent('');
        }}
      >
        <p dangerouslySetInnerHTML={{ __html: content }}></p>
      </Modal>

      {mailTemplate && (
        <MailTemplateEdit
          open={open}
          mailTemplate={mailTemplate}
          onClose={() => {
            setOpen(false);
          }}
          onChange={(mailTemplate) => {
            setMailTemplate(mailTemplate);
          }}
          onSuccess={() => {
            setOpen(false);
            getDataSource({ pageNum, pageSize });
          }}
        />
      )}

      <Table
        bordered
        tableLayout="fixed"
        pagination={{
          total,
          pageSize,
          current: pageNum,
          onChange: (page, pageSize) => {
            setPageNum(page);
            setPageSize(pageSize);
            getDataSource({ pageNum: page, pageSize });
          },
        }}
        loading={loading}
        rowKey={'id'}
        style={{
          marginTop: 12,
        }}
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
};

export default MemberMailTemplate;
