import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Space, Switch, Table, message } from 'antd';
import type { TableColumnsType } from 'antd';
import {
  ProductCateType,
  ProductCateListPayload,
  ProductCateUpdateNavStatusPayload,
  ProductCateUpdateShowStatusPayload,
} from 'types/pms';
import usePagination from 'commons/hooks/usePagination';
import {
  getProductCateList,
  getProductCateUpdateNavStatus,
  getProductCateUpdateShowStatus,
  getProductCateOperation,
} from 'apis/pms';
import queryString from 'query-string';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToggle } from 'react-use';
import EditModal from './edit';
import i18n from 'i18n';
import LOCALS from 'commons/locals';
import { Trans } from 'react-i18next';
import { getLocalStorageLanguage } from 'commons';
import { LeftOutlined } from '@ant-design/icons';

const ProductCate = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  } = usePagination<ProductCateType>();
  const language = getLocalStorageLanguage();

  // const [payload, setPayload] = useState<ProductCateListPayload>({});
  const [open, toggleOpen] = useToggle(false);
  const [editData, setEditData] = useState<ProductCateType>();

  const getList = useCallback(
    (id: ProductCateListPayload['id']) => {
      setLoading(true);
      getProductCateList({
        id,
        pageNum,
        pageSize,
      }).then(({ data }) => {
        const { list, total } = data;
        setLoading(false);
        setDataSource(list);
        setTotal(total);
      });
    },
    [setDataSource, setLoading, setTotal, pageNum, pageSize]
  );

  const getReload = () => {
    setPageNum(1);
    getList(payloadID);
  };

  // 当前ID
  const payloadID = useMemo(() => {
    const parsed = queryString.parse(location.search);
    return Number(parsed.id) || 0;
  }, [location]);

  // 父级ID
  const payloadPrevId = useMemo(() => {
    const parsed = queryString.parse(location.search);
    return Number(parsed.prevId) || 0;
  }, [location]);

  // URL参数 改变 查询接口
  useEffect(() => {
    console.log('🚀  useEffect  payloadID:', payloadID);
    getList(payloadID);
  }, [payloadID, getList, pageNum, pageSize]);

  const updateNavStatus = (data: ProductCateUpdateNavStatusPayload) => {
    getProductCateUpdateNavStatus(data).then(() => {
      message.success(i18n.t('successful_operation'));
      getReload();
    });
  };

  const updateShowStatus = (data: ProductCateUpdateShowStatusPayload) => {
    getProductCateUpdateShowStatus(data).then(() => {
      message.success(i18n.t('successful_operation'));
      getReload();
    });
  };

  const cateOperation = (data: ProductCateType) => {
    const type = data.enabled ? 'disable' : 'enable';
    getProductCateOperation(data.id, type).then(() => {
      message.success(i18n.t('successful_operation'));
      getReload();
    });
  };

  const columns: TableColumnsType<ProductCateType> = [
    {
      title: <Trans i18nKey={LOCALS.cate_no} />,
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: <Trans i18nKey={LOCALS.category_name} />,
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        if (language === 'en') {
          return record.name;
        } else if (language === 'zh_CN') {
          return record.nameZh;
        } else if (language === 'ja') {
          return record.nameJa;
        }
      },
    },
    {
      title: <Trans i18nKey={LOCALS.level} />,
      dataIndex: 'level',
      key: 'level',
      render: (d) => {
        const l = d + 1;
        if (language === 'en' || language === 'ja') {
          return `${i18n.t('level')}${l}`;
        } else if (language === 'zh_CN') {
          return ['一级', '二级', '三级'][d];
        }
      },
    },
    {
      title: <Trans i18nKey={LOCALS.sort} />,
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: <Trans i18nKey={LOCALS.navigation_bar} />,
      dataIndex: 'navStatus',
      key: 'navStatus',
      render: (d, record) => (
        <Switch
          defaultChecked={d}
          onChange={() =>
            updateNavStatus({
              ids: `${record.id}`,
              navStatus: d === 0 ? 1 : 0,
            })
          }
          disabled={record.level !== 1}
        />
      ),
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (d, record) => {
        return <Switch checked={d} onChange={() => cateOperation(record)} />;
      },
    },
    {
      title: <Trans i18nKey={LOCALS.sidebar_filter} />,
      dataIndex: 'showStatus',
      key: 'showStatus',
      render: (d, record) => (
        <Switch
          defaultChecked={d}
          onChange={() =>
            updateShowStatus({
              ids: `${record.id}`,
              showStatus: d === 0 ? 1 : 0,
            })
          }
          disabled={record.level !== 2}
        />
      ),
    },
    {
      title: <Trans i18nKey={LOCALS.set_up} />,
      dataIndex: 'set',
      key: 'set',
      render: (d, record) => (
        <Button
          disabled={record.level !== 0 && record.level !== 1}
          onClick={() => {
            setPageNum(1);
            const parsed = queryString.stringify({
              id: record.id,
              prevId: payloadID,
            });
            navigate(`${window.location.pathname}?${parsed}`);
          }}
        >
          <Trans i18nKey={LOCALS.check_subordinates} />
        </Button>
      ),
    },
    {
      title: <Trans i18nKey={LOCALS.cate_options} />,
      dataIndex: 'opt',
      key: 'opt',
      render: (d, record) => {
        return (
          <Space>
            <Button
              onClick={() => {
                setEditData(record);
                toggleOpen();
              }}
            >
              <Trans i18nKey={LOCALS.edit} />
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Button
          type="link"
          onClick={() => {
            setPageNum(1);
            navigate(-1);
          }}
          disabled={!payloadID}
          icon={<LeftOutlined />}
        >
          {i18n.t('back')}
        </Button>
        <Button
          onClick={() => {
            toggleOpen();
            setEditData(undefined);
          }}
        >
          {i18n.t('addTo')}
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey={'id'}
        pagination={{
          total,
          pageSize,
          current: pageNum,
          onChange: (page, pageSize) => {
            setPageNum(page);
            setPageSize(pageSize);
          },
        }}
      />

      {/* 编辑 */}
      {open && (
        <EditModal
          onCancel={() => toggleOpen()}
          onOk={() => {
            toggleOpen();
            getReload();
          }}
          open={open}
          payload={{
            id: payloadID,
            prevId: payloadPrevId,
          }}
          editData={editData}
        />
      )}
    </div>
  );
};

export default ProductCate;
