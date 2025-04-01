import {
  Button,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Table,
  message,
  Dropdown,
  Tag,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  getMemberListV2,
  getUmsMemberTagOptions,
  umsMemberUpdateStatus,
} from 'apis/ums';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import {
  MEMBER_LEVEL_MAP,
  MEMBER_LEVEL_OPTION_LIST,
  SHOP_MAP,
  SHOP_OPTION_LIST,
  findLabelByValue,
} from 'commons/options';
import i18n from 'i18n';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { UmsMember } from 'types/ums';
import formatTime from 'utils/formatTime';
import setQueryParameters from 'utils/setQueryParameters';
import queryString from 'query-string';
import { PageQuery, UnwrapPromise } from 'types/base';
import { DownOutlined } from '@ant-design/icons';
import useSysDict from 'commons/hooks/use-sys-dict';
import { SorterResult } from 'antd/es/table/interface';
import { CreateOrderTypeList } from 'constants/RecyclingConsignment';
import {
  removeRecyclingConsignmentStore,
  ITEM_NAME_MAP,
} from 'pages/rrs/recycling-consignment-order/components/utils';

const MemberList = () => {
  const [form] = Form.useForm<{
    keyword: string;
    createSource: number[];
    memberLevel: string[];
    tags: string[];
  }>();
  const navigate = useNavigate();
  const [sorter, setSorter] = useState<{
    sortField?: string;
    sortOrder?: string;
  }>();

  const [tagOptions, setTagOptions] = useState<string[]>([]);
  useEffect(() => {
    getUmsMemberTagOptions().then((res) => {
      setTagOptions(res);
    });
  }, []);

  const tagConfig = useSysDict<[string[], { [key: string]: string }]>(
    'ums_member_tags_config'
  );

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
  } =
    usePagination<
      UnwrapPromise<ReturnType<typeof getMemberListV2>>['list'][number]
    >();

  const getDataSource = useCallback(
    async ({
      pageNum,
      pageSize,
      sortField,
      sortOrder,
    }: PageQuery & { sortField?: string; sortOrder?: string }) => {
      const data = {
        ...form.getFieldsValue(),
        pageNum,
        pageSize,
        sortField,
        sortOrder,
      };

      setQueryParameters(data);

      try {
        setLoading(true);
        const { list, total } = await getMemberListV2(data);
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

    if (parsed.createSource)
      // @ts-ignore
      parsed.createSource = parsed.createSource.split(',').map((i) => {
        return +i;
      });

    // @ts-ignore
    if (parsed.memberLevel) parsed.memberLevel = parsed.memberLevel.split(',');

    // @ts-ignore
    if (parsed.tags) parsed.tags = parsed.tags.split(',');

    form.setFieldsValue(parsed);
    const pageNum = parsed.pageNum ? +parsed.pageNum : 1;
    const pageSize = parsed.pageSize ? +parsed.pageSize : 10;
    setPageNum(pageNum);
    setPageSize(pageSize);

    const sortField = parsed.sortField as string;
    const sortOrder = parsed.sortOrder as string;
    setSorter({ sortField, sortOrder });

    getDataSource({ pageNum, pageSize, sortField, sortOrder });
  }, [form, getDataSource, setPageNum, setPageSize, setSorter]);

  const onFinish = async () => {
    setPageNum(1);
    setSorter({});
    getDataSource({ pageNum: 1, pageSize });
  };

  const onReset = () => {
    form.resetFields();
    onFinish();
  };

  const onViewDetails = useCallback(
    (id: UmsMember['id']) => {
      navigate(`/ums/member-view/${id}`);
    },
    [navigate]
  );

  const onAdd = () => {
    navigate('/ums/member-add');
  };

  const onEdit = useCallback(
    (id: UmsMember['id']) => {
      navigate(`/ums/member-edit/${id}`);
    },
    [navigate]
  );

  const onMenuClick = useCallback(
    (key: string, { email, id }: Pick<UmsMember, 'id' | 'email'>) => {
      let url = '';
      let state = {};
      if (key === '1') {
        url = '/oms/order-create';
        state = { memberEmail: email, memberId: id };
      } else if (key === '2') {
        removeRecyclingConsignmentStore(ITEM_NAME_MAP.RECYCLING_CONSIGNMENT_CONTRACT);
        url = '/rrs/recycling-contract-order';
        state = { memberEmail: email };
      } else if (key === '4') {
        removeRecyclingConsignmentStore(ITEM_NAME_MAP.RECYCLING_CONSIGNMENT_CONTRACT);
        url = '/rrs/consignment-contract-order';
        state = { memberEmail: email };
      } else if (key === '3') {
        url = '/rrs/recycling-consignment-intention';
        state = { memberEmail: email };
      }
      navigate(url, { state });
    },
    [navigate]
  );

  const onSortOrder = useCallback(
    (field: string) => {
      if (sorter?.sortField === field) {
        return sorter.sortOrder === 'DESC' ? 'descend' : 'ascend';
      }
      return null;
    },
    [sorter]
  );

  const columns: ColumnsType<
    UnwrapPromise<ReturnType<typeof getMemberListV2>>['list'][number]
  > = useMemo(() => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        sorter: true,
        sortOrder: onSortOrder('id'),
      },
      {
        title: (
          <>
            <Trans i18nKey={LOCALS.email} />
            {'/'}
            <Trans i18nKey={LOCALS.name} />
            {'/'}
            <Trans i18nKey={LOCALS.phone_number} />
          </>
        ),
        key: 'email',
        width: 250,
        render: ({
          id,
          email,
          showName,
          showPhone,
        }: UnwrapPromise<
          ReturnType<typeof getMemberListV2>
        >['list'][number]) => {
          return (
            <div>
              <a href={`/ums/member-view/${id}`}>{email}</a>
              <div>{showName}</div>
              <div>{showPhone}</div>
            </div>
          );
        },
      },
      {
        title: <Trans i18nKey={LOCALS.total_pay_amount} />,
        dataIndex: 'totalPayAmount',
        key: 'totalPayAmount',
        width: 120,
      },
      {
        title: <Trans i18nKey={LOCALS.points} />,
        key: 'integration',
        dataIndex: 'integration',
        width: 120,
        render: (points) => {
          return points || 0;
        },
      },
      {
        title: <Trans i18nKey={LOCALS.created_from} />,
        key: 'createSource',
        width: 100,
        dataIndex: 'createSource',
        render: (createSource: number) => {
          return findLabelByValue(
            createSource || SHOP_MAP.WEBSITE,
            SHOP_OPTION_LIST
          );
        },
      },
      {
        title: <Trans i18nKey={LOCALS.member_level} />,
        key: 'memberLevel',
        width: 100,
        dataIndex: 'memberLevel',
        render: (memberLevel: string) => {
          const COLOR_MAP = {
            [MEMBER_LEVEL_MAP.BRONZE]: '#A57E52',
            [MEMBER_LEVEL_MAP.SILVER]: '#C0C0C0',
            [MEMBER_LEVEL_MAP.GOLD]: '#FFD700',
          };

          return (
            <span
              style={{
                color: COLOR_MAP[memberLevel],
              }}
            >
              {memberLevel}
            </span>
          );
        },
      },
      {
        title: <Trans i18nKey={LOCALS.khvsAbbLJs} />,
        key: 'tags',
        width: 150,
        dataIndex: 'tags',
        render: (tags?: string[]) => {
          if (!tags || tags.length === 0) return '-';

          return (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => {
                return (
                  <Tag color={(tagConfig && tagConfig[1][tag]) || ''} key={tag}>
                    {tag}
                  </Tag>
                );
              })}
            </div>
          );
        },
      },
      {
        title: <Trans i18nKey={LOCALS.status} />,
        key: 'status',
        dataIndex: 'status',
        width: 100,
        render: (
          status: UmsMember['status'],
          {
            id,
          }: UnwrapPromise<ReturnType<typeof getMemberListV2>>['list'][number]
        ) => {
          return (
            <Switch
              checked={!!status}
              onChange={(value) => {
                umsMemberUpdateStatus({ id, status: value ? 1 : 0 }).then(
                  () => {
                    message.success(i18n.t('successful_operation'));
                    getDataSource({ pageNum, pageSize, ...sorter });
                  }
                );
              }}
            />
          );
        },
      },
      {
        title: <Trans i18nKey={LOCALS.registration_time} />,
        key: 'createTime',
        dataIndex: 'createTime',
        width: 170,
        render: (createTime: string) => {
          return formatTime(createTime);
        },
      },
      {
        title: <Trans i18nKey={LOCALS.last_login_time} />,
        key: 'lastLoginTime',
        dataIndex: 'lastLoginTime',
        width: 170,
        render: (lastLoginTime: UmsMember['lastLoginTime']) => {
          return formatTime(lastLoginTime);
        },
      },
      {
        title: <Trans i18nKey={LOCALS.expiration_time} />,
        key: 'pointExpireTime',
        dataIndex: 'pointExpireTime',
        width: 170,
        sorter: true,
        sortOrder: onSortOrder('pointExpireTime'),
        render: (pointExpireTime: UmsMember['pointExpireTime']) => {
          return formatTime(pointExpireTime);
        },
      },
      {
        title: <Trans i18nKey={LOCALS.created_by} />,
        key: 'createdBy',
        dataIndex: 'createdBy',
        width: 100,
        render: (createdBy: string) => {
          return createdBy || '-';
        },
      },
      {
        key: 'options',
        title: <Trans i18nKey={LOCALS.options} />,
        fixed: 'right',
        width: 220,
        render: ({ id, email }: UmsMember) => {
          return (
            <div>
              <Button
                type="link"
                onClick={() => {
                  onViewDetails(id);
                }}
              >
                <Trans i18nKey={LOCALS.details} />
              </Button>
              <Button
                type="link"
                onClick={() => {
                  onEdit(id);
                }}
              >
                <Trans i18nKey={LOCALS.edit} />
              </Button>
              <Dropdown
                menu={{
                  items: CreateOrderTypeList,
                  onClick: (e) => onMenuClick(e.key, { id, email }),
                }}
              >
                <a href="/" onClick={(e) => e.preventDefault()}>
                  <Space>
                    {i18n.t('create_order')}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </div>
          );
        },
      },
    ];
  }, [
    onSortOrder,
    tagConfig,
    getDataSource,
    pageNum,
    pageSize,
    sorter,
    onViewDetails,
    onEdit,
    onMenuClick,
  ]);

  return (
    <div>
      <Form form={form} layout={'inline'} onFinish={onFinish}>
        <Form.Item name="keyword" label={<Trans i18nKey={LOCALS.keyword} />}>
          <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
        </Form.Item>

        <Form.Item
          name="createSource"
          label={<Trans i18nKey={LOCALS.created_from} />}
        >
          <Select
            mode="multiple"
            placeholder={i18n.t(LOCALS.please_select) || ''}
            style={{ minWidth: 150 }}
            options={SHOP_OPTION_LIST.map(({ value, label }) => {
              return {
                value,
                label,
              };
            })}
          />
        </Form.Item>

        <Form.Item
          name="memberLevel"
          label={<Trans i18nKey={LOCALS.member_level} />}
        >
          <Select
            mode="multiple"
            placeholder={i18n.t(LOCALS.please_select) || ''}
            style={{ minWidth: 150 }}
            options={MEMBER_LEVEL_OPTION_LIST}
          />
        </Form.Item>

        <Form.Item name="tags" label={<Trans i18nKey={LOCALS.khvsAbbLJs} />}>
          <Select
            mode="multiple"
            placeholder={i18n.t(LOCALS.please_select) || ''}
            style={{ minWidth: 150 }}
            options={tagOptions.map((tag) => ({
              value: tag,
              label: tag,
            }))}
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
            <Button onClick={onAdd}>
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
            getDataSource({ pageNum: page, pageSize, ...sorter });
          },
        }}
        onChange={(
          _pagination,
          _filters,
          sorter: SorterResult<any> | SorterResult<any>[],
          extra: { action: 'paginate' | 'sort' | 'filter' }
        ) => {
          const sorterResult = Array.isArray(sorter) ? sorter[0] : sorter;
          if (extra.action === 'sort') {
            if (sorterResult.order) {
              setSorter({
                sortField: sorterResult?.field as string,
                sortOrder: sorterResult.order === 'descend' ? 'DESC' : 'ASC',
              });
              setPageNum(1);
              getDataSource({
                pageNum: 1,
                pageSize,
                sortField: sorterResult?.field as string,
                sortOrder: sorterResult.order === 'descend' ? 'DESC' : 'ASC',
              });
            } else {
              setSorter({});
              setPageNum(1);
              getDataSource({
                pageNum: 1,
                pageSize,
              });
            }
          }
        }}
        size="small"
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

export default MemberList;
