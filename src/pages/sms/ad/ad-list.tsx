import {
  Button,
  Form,
  Image,
  Input,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import SmsApi, { Advertise } from 'apis/sms';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import { LANGUAGE_OPTION_LIST } from 'commons/options';
import i18n from 'i18n';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { PageQuery } from 'types/base';
import setQueryParameters from 'utils/setQueryParameters';
import dayjs from 'dayjs';

export const langOptionList = [
  {
    value: 'all',
    label: 'ALL',
  },
  ...LANGUAGE_OPTION_LIST,
  {
    value: 'zh_TW',
    label: '繁体中文',
  },
];

export const typeOptionList = [
  {
    value: 0,
    label: i18n.t('pc_home_page_carousel'),
  },
  {
    value: 1,
    label: i18n.t('app_home_carousel'),
  },
];

const ADList = () => {
  const {
    loading,
    setLoading,
    total,
    setTotal,
    pageNum,
    pageSize,
    setPageSize,
    setPageNum,
    dataSource,
    setDataSource,
  } = usePagination<Advertise>();

  const [form] = Form.useForm<{
    keyword?: string;
    langList?: string[];
    type?: number;
  }>();

  const getDataSource = useCallback(
    async ({ pageNum, pageSize }: PageQuery) => {
      const { keyword, type, langList } = form.getFieldsValue();
      const data = {
        pageNum,
        pageSize,
        keyword,
        type,
        langList: langList && langList.join(','),
      };

      setQueryParameters(data);

      try {
        setLoading(true);
        const { list, total } = await SmsApi.getADList(data);

        setDataSource(list);
        setTotal(total);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [form, setDataSource, setLoading, setTotal]
  );

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);

    if (parsed.categoryIdList) {
      parsed.categoryIdList = parsed.categoryIdList // @ts-ignore
        .split(',') // @ts-ignore
        .map((i) => Number(i));
    }
    if (parsed.langList)
      // @ts-ignore
      parsed.langList = parsed.langList.split(',');

    form.setFieldsValue(parsed);

    const pageNum = parsed.pageNum ? +parsed.pageNum : 1;
    const pageSize = parsed.pageSize ? +parsed.pageSize : 10;
    setPageNum(pageNum);
    setPageSize(pageSize);

    getDataSource({ pageNum, pageSize });
  }, [form, getDataSource, setPageNum, setPageSize]);

  const onFinish = useCallback(async () => {
    setPageNum(1);
    getDataSource({ pageNum: 1, pageSize });
  }, [getDataSource, pageSize, setPageNum]);

  const onReset = useCallback(() => {
    form.resetFields();
    onFinish();
  }, [form, onFinish]);

  const columns: ColumnsType<Advertise> = useMemo(() => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
      },
      {
        title: i18n.t('ad_name'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: i18n.t('ad_placement'),
        dataIndex: 'type',
        key: 'type',
        render: (type: Advertise['type']) =>
          typeOptionList.find((d) => d.value === type)?.label,
      },
      {
        title: i18n.t('language'),
        dataIndex: 'language',
        key: 'language',
        render: (language: string) => {
          return langOptionList.find((i) => i.value === language)?.label || '-';
        },
      },
      {
        title: i18n.t('ad_image'),
        dataIndex: 'pic',
        key: 'pic',
        render: (pic?: string) => {
          if (!pic) return '-';
          return <Image src={pic} className="w-24" />;
        },
      },
      {
        title: i18n.t('time'),
        key: 'time',
        width: 200,
        render: (record: Advertise) => {
          return (
            <div>
              <div>
                <div>{i18n.t('start_time')}：</div>
                {dayjs(record?.startTime).format('YYYY-MM-DD HH:mm:ss')}
              </div>
              <div>
                <div>{i18n.t('end_time')}：</div>
                {dayjs(record?.endTime).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </div>
          );
        },
      },
      {
        title: i18n.t('online_offline'),
        dataIndex: 'status',
        key: 'status',
        render: (status: 0 | 1 | null, record: Advertise) => {
          return (
            <Switch
              checked={status === 1}
              onChange={async (checked) => {
                await SmsApi.AdEditService({
                  ...record,
                  status: checked ? 1 : 0,
                });
                getDataSource({ pageNum, pageSize });
              }}
            ></Switch>
          );
        },
      },
      {
        key: 'options',
        title: <Trans i18nKey={LOCALS.options} />,
        fixed: 'right',
        width: 220,
        render: (record: Advertise) => {
          const id = record.id;
          return (
            <div>
              <Button
                type="link"
                onClick={() => {
                  window.location.href = `/sms/ad-detail?id=${id}`;
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
                  await SmsApi.AdDelete(id);
                  onFinish();
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
  }, [getDataSource, onFinish, pageNum, pageSize]);

  return (
    <div>
      <Form form={form} onFinish={onFinish} layout="inline">
        <Form.Item
          name="keyword"
          label={<Trans i18nKey={LOCALS.keyword} />}
          initialValue=""
        >
          <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
        </Form.Item>

        <Form.Item
          name="type"
          label={i18n.t('ad_placement')}
          initialValue={[]}
          className="w-60"
        >
          <Select
            mode="multiple"
            placeholder={i18n.t(LOCALS.please_select) || ''}
            style={{ minWidth: 120 }}
            options={typeOptionList}
          />
        </Form.Item>

        <Form.Item name="langList" label={i18n.t('language')} initialValue={[]}>
          <Select
            mode="multiple"
            placeholder={i18n.t(LOCALS.please_select) || ''}
            style={{ minWidth: 120 }}
            options={langOptionList.map(({ value, label }) => {
              return {
                value,
                label,
              };
            })}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              <Trans i18nKey={LOCALS.search} />
            </Button>

            <Button htmlType="button" onClick={onReset}>
              <Trans i18nKey={LOCALS.reset} />
            </Button>
            <Button
              onClick={() => {
                window.location.href = '/sms/ad-detail';
              }}
            >
              <Trans i18nKey={LOCALS.add} />
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Table
        tableLayout="fixed"
        bordered
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

export default ADList;
