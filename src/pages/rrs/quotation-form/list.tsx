import { Button, DatePicker, Form, Input, Modal, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  deleteQuotationForm,
  searchQuotationForm,
  SearchQuotationFormDto,
} from 'apis/oms';
import useIsMobile from 'commons/hooks/useIsMobile';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import {
  findLabelByValue,
  QUOTATION_FORM_TYPE_OPTION_LIST,
} from 'commons/options';
import LinkButton from 'components/link-button';
import i18n from 'i18n';
import { useCallback, useEffect, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageQuery } from 'types/base';
import { QuotationForm } from 'types/oms';
import formatTime from 'utils/formatTime';

type SearchFormData = {
  dateRange?: [string, string];
  keyword?: string;
};

const QuotationFormList = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [modal, contextHolder] = Modal.useModal();
  const [form] = Form.useForm<SearchFormData>();
  const {
    loading,
    setLoading,
    pageNum,
    pageSize,
    dataSource,
    total,
    setPageNum,
    setPageSize,
    setDataSource,
    setTotal,
  } = usePagination<QuotationForm>();

  const getDataSource = useCallback(
    async (pageData: PageQuery) => {
      const { dateRange, keyword } = form.getFieldsValue();
      const data: SearchQuotationFormDto = {
        keyword,
        ...pageData,
      };

      if (dateRange) {
        const [startTime, endTime] = dateRange;
        data.startTime = startTime;
        data.endTime = endTime;
      }

      setLoading(true);
      const res = await searchQuotationForm(data);
      setDataSource(res.data.list);
      setTotal(res.data.total);
      setLoading(false);
    },
    [form, setDataSource, setLoading, setTotal]
  );

  useEffect(() => {
    getDataSource({ pageNum: 1, pageSize: 10 });
  }, [getDataSource]);

  const onClickAdd = () => {
    navigate('/rrs/quotation-form-add');
  };

  const onFinish = () => {
    setPageNum(1);
    getDataSource({ pageNum: 1, pageSize });
  };

  const onReset = () => {
    form.resetFields();
    onFinish();
  };

  const onClickDelete = useCallback(
    (id: number) => {
      modal.confirm({
        title: <Trans i18nKey={LOCALS.delete} />,
        content: <Trans i18nKey={LOCALS.are_you_sure_to_delete} />,
        cancelText: <Trans i18nKey={LOCALS.cancel} />,
        okText: <Trans i18nKey={LOCALS.confirm} />,
        onOk: async () => {
          await deleteQuotationForm(id);
          getDataSource({ pageNum, pageSize });
        },
      });
    },
    [getDataSource, modal, pageNum, pageSize]
  );

  const columns: ColumnsType<QuotationForm> = useMemo(() => {
    return [
      {
        dataIndex: 'id',
        key: 'id',
        title: 'id',
      },
      {
        dataIndex: 'category',
        key: 'category',
        title: <Trans i18nKey={LOCALS.bag_style} />,
      },
      {
        dataIndex: 'material',
        key: 'material',
        title: <Trans i18nKey={LOCALS.material} />,
      },
      {
        dataIndex: 'productPics',
        key: 'productPics',
        title: <Trans i18nKey={LOCALS.product_pictures} />,
        render: (productPics: string) => {
          const [firstPic] = productPics.split(',');

          if (!firstPic) return '-';

          return <img style={{ width: 120 }} src={firstPic} alt={firstPic} />;
        },
      },
      {
        dataIndex: 'type',
        key: 'type',
        title: <Trans i18nKey={LOCALS.type} />,
        render: (type) => {
          return findLabelByValue(type, QUOTATION_FORM_TYPE_OPTION_LIST);
        },
      },
      {
        dataIndex: 'createdTime',
        key: 'createdTime',
        title: <Trans i18nKey={LOCALS.created_time} />,
        render: (createdTime: string) => {
          return formatTime(createdTime);
        },
      },
      {
        dataIndex: 'createdBy',
        key: 'createdBy',
        title: <Trans i18nKey={LOCALS.created_by} />,
      },
      {
        key: 'options',
        title: <Trans i18nKey={LOCALS.options} />,
        render: ({ id }: QuotationForm) => {
          return (
            <div>
              <Space>
                <LinkButton href={`/rrs/quotation-form-detail/${id}`}>
                  <Trans i18nKey={LOCALS.details} />
                </LinkButton>

                <LinkButton href={`/rrs/quotation-form-edit/${id}`}>
                  <Trans i18nKey={LOCALS.edit} />
                </LinkButton>

                <Button
                  type="link"
                  danger
                  onClick={() => {
                    if (id) {
                      onClickDelete(id);
                    }
                  }}
                >
                  <Trans i18nKey={LOCALS.delete} />
                </Button>
              </Space>
            </div>
          );
        },
      },
    ];
  }, [onClickDelete]);

  return (
    <div>
      {contextHolder}
      <Form
        form={form}
        layout={isMobile ? 'vertical' : 'inline'}
        onFinish={onFinish}
      >
        <Form.Item name="keyword" label={<Trans i18nKey={LOCALS.keyword} />}>
          <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
        </Form.Item>
        <Form.Item
          name="dateRange"
          label={<Trans i18nKey={LOCALS.date_range} />}
        >
          <DatePicker.RangePicker placement="topLeft" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              <Trans i18nKey={LOCALS.search} />
            </Button>

            <Button htmlType="button" onClick={onReset}>
              <Trans i18nKey={LOCALS.reset} />
            </Button>
            <Button onClick={onClickAdd}>
              <Trans i18nKey={LOCALS.add} />
            </Button>
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

export default QuotationFormList;
