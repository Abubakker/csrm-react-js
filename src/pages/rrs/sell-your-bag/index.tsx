import { Button, Form, Input, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { getSellYourBagList } from 'apis/oms';
import useIsMobile from 'commons/hooks/useIsMobile';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import { useCallback, useEffect, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SellYourBagRecord } from 'types/oms';
import formatTime from 'utils/formatTime';

type SearchDataDto = {
  productName: string;
};

const initSearchData: SearchDataDto = {
  productName: '',
};

const SellYourBag = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<SearchDataDto>();
  const {
    loading,
    setLoading,
    dataSource,
    setDataSource,
    pageSize,
    setPageSize,
    pageNum,
    setPageNum,
    total,
    setTotal,
  } = usePagination<SellYourBagRecord>();

  const columns: ColumnsType<SellYourBagRecord> = useMemo(() => {
    return [
      {
        dataIndex: 'productPics',
        key: 'productPics',
        title: <Trans i18nKey={LOCALS.product_pictures} />,
        render: (productPics) => {
          const [pic1] = productPics;
          return <img style={{ width: 100 }} src={pic1.src} alt={pic1.name} />;
        },
      },
      {
        dataIndex: 'productName',
        key: 'productName',
        title: <Trans i18nKey={LOCALS.product_name} />,
        render: (productName) => {
          return <div style={{ maxWidth: 200 }}>{productName}</div>;
        },
      },
      {
        key: 'memberInfo',
        title: <Trans i18nKey={LOCALS.member_info} />,
        render: (data: SellYourBagRecord) => {
          return (
            <div>
              <p>{data.email}</p>
              <p>{data.phone}</p>
            </div>
          );
        },
      },
      {
        dataIndex: 'createTime',
        key: 'createTime',
        title: <Trans i18nKey={LOCALS.created_time} />,
        render: (createTime) => {
          return formatTime(createTime);
        },
      },
      {
        key: 'options',
        title: <Trans i18nKey={LOCALS.options} />,
        render: ({ id }: SellYourBagRecord) => {
          return (
            <div>
              <Button
                type="link"
                onClick={() => {
                  navigate(`/rrs/sell-your-bag-edit/${id}`);
                }}
              >
                <Trans i18nKey={LOCALS.details} />
              </Button>
            </div>
          );
        },
      },
    ];
  }, [navigate]);

  const getDataSource = useCallback(async () => {
    setLoading(true);
    const { productName } = form.getFieldsValue();
    const {
      data: { total, records },
    } = await getSellYourBagList({
      productName,
      current: pageNum,
      size: pageSize,
    });

    setTotal(total);
    setDataSource(records);
    setLoading(false);
  }, [form, pageNum, pageSize, setDataSource, setLoading, setTotal]);

  useEffect(() => {
    getDataSource();
  }, [getDataSource]);

  const onReset = () => {
    form.resetFields();
    if (pageNum === 1) {
      getDataSource();
    } else {
      setPageNum(1);
    }
  };

  const onFinish = () => {
    if (pageNum === 1) {
      getDataSource();
    } else {
      setPageNum(1);
    }
  };

  const handleClickPrint = () => {
    const win = window.open(
      `${window.location.origin}/prints/cash-register?title=Herm%C3%A8s&subTitle=Lindy%2026&rank=Rank%20A&curreny=HKD&price=4746464&productSn=0004747474`,
      '__blank'
    );
    if (win) {
      win.onload = () => {
        win?.print();
      };
    }
  };

  const isMobile = useIsMobile();

  return (
    <div>
      <Form
        form={form}
        layout={isMobile ? 'vertical' : 'inline'}
        initialValues={initSearchData}
        onFinish={onFinish}
      >
        <Form.Item
          label={<Trans i18nKey={LOCALS.keyword} />}
          name="productName"
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              <Trans i18nKey={LOCALS.search} />
            </Button>

            <Button htmlType="button" onClick={onReset}>
              <Trans i18nKey={LOCALS.reset} />
            </Button>

            <Button onClick={handleClickPrint}>print</Button>
          </Space>
        </Form.Item>
      </Form>

      <Table
        pagination={{
          total,
          pageSize,
          current: pageNum,
          onChange: (page, pageSize) => {
            setPageNum(page);
            setPageSize(pageSize);
          },
        }}
        loading={loading}
        rowKey={'id'}
        style={{
          marginTop: 12,
        }}
        dataSource={dataSource}
        columns={columns}
      ></Table>
    </div>
  );
};

export default SellYourBag;
