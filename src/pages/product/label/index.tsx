import { Trans } from 'react-i18next';
import {
  Button,
  Table,
  Space,
  Radio,
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Modal,
  message,
  Popover,
} from 'antd';
import i18n from 'i18n';
import LOCALS from 'commons/locals';
import styles from './index.module.scss';
import useIsMobile from 'commons/hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import { PriceTagPayload, PriceTagInfo, currencyMap } from 'types/pms';
import { getPriceTagList, deletePriceTag } from 'apis/pms';
import usePagination from 'commons/hooks/usePagination';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { useAppSelector } from 'store/hooks';
import { selectUserInfo } from 'store/slices/userInfoSlice';

const { RangePicker } = DatePicker;
/** 默认分页 */
const defaultPayload = { pageNum: 1, pageSize: 10 };
/** 1-银座 2-香港 3-> 新加坡 */
const optionsCity = [
  { label: 'JP', value: '1' },
  { label: 'HK', value: '2' },
  { label: 'SG', value: '3' },
];
/**  */
const grid_left = { xxl: 20, xl: 20, lg: 24 };
const grid_right = { xxl: 4, xl: 4, lg: 24 };
/** 表格渲染宽度 */
const tdRender = (
  text: string | React.ReactNode,
  width: number | string,
  styles?: object
): React.ReactNode => (
  <div style={{ width, wordWrap: 'break-word', ...styles }}>{text}</div>
);
/** 换行显示 */
const renderEnter = (data: string): React.ReactNode => {
  if (data) {
    return data.split(',').map((d: string) => <div key={d}>{d}</div>);
  }
};

const LabelList = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const payloadRef = useRef<PriceTagPayload>({ ...defaultPayload });
  const [modal, contextHolder] = Modal.useModal();

  const [selectedRows, setSelectedRows] = useState<PriceTagInfo[]>([]);
  /** 店铺id相关 创建时需要传递shopid */
  const { shop } = useAppSelector(selectUserInfo);
  const shopIdRef = useRef<string>('1');

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
  } = usePagination<PriceTagInfo>();

  /** 根据账号管理的店铺 设置默认值 */
  useEffect(() => {
    if (shop === undefined) return;
    // 管理员 没有指定店铺,默认日本
    if (shop === null) {
      // 是否有记录
      let PriceTag_ShopId = localStorage.getItem('PriceTag_ShopId') || '1';
      if (PriceTag_ShopId && !['1', '2', '3'].includes(PriceTag_ShopId)) {
        PriceTag_ShopId = '1';
        localStorage.setItem('PriceTag_ShopId', PriceTag_ShopId);
      }
      payloadRef.current.shopId = PriceTag_ShopId;
      shopIdRef.current = PriceTag_ShopId;
      form.setFieldValue('shopId', PriceTag_ShopId);
      loadPriceTagList();
      // console.log('🚀  useEffect : 管理员', PriceTag_ShopId);
    } else {
      // 有指定店铺
      const PriceTag_ShopId = localStorage.getItem('PriceTag_ShopId') || '';
      if (
        (PriceTag_ShopId && PriceTag_ShopId !== `${shop}`) ||
        !['1', '2', '3'].includes(PriceTag_ShopId)
      ) {
        localStorage.setItem('PriceTag_ShopId', `${shop}`);
      }
      payloadRef.current.shopId = `${shop}`;
      shopIdRef.current = `${shop}`;
      form.setFieldValue('shopId', shop);
      loadPriceTagList();
    }
  }, [shop]);

  /** 搜素按钮 */
  const onFinish = (value: PriceTagPayload) => {
    resetPagination();
    const { time, keyword, shopId } = value;
    let payload = {
      ...defaultPayload,
      shopId,
    } as PriceTagPayload;
    if (time) {
      payload.beginCreateTime = time[0].format('YYYY-MM-DD');
      payload.endCreateTime = time[1].format('YYYY-MM-DD');
    }
    if (keyword && keyword?.indexOf(`\n`) > -1) {
      payload.productSn = keyword;
    } else {
      payload.keyword = keyword;
    }
    payloadRef.current = payload;
    loadPriceTagList();
  };

  /** 列表接口 */
  const loadPriceTagList = async () => {
    try {
      setLoading(true);
      const {
        data: { list, total },
      } = await getPriceTagList({
        ...payloadRef.current,
        shopId: shopIdRef.current,
      });
      setDataSource(list);
      setTotal(total);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  /** 表格列 */
  const getColumns: ColumnsType<PriceTagInfo> = useMemo(() => {
    return [
      {
        title: <Trans i18nKey={LOCALS.product_sn}></Trans>,
        dataIndex: 'productSn',
        //width: '150px',
        render: (d) => tdRender(d, '5vw'),
      },
      {
        title: <Trans i18nKey={LOCALS.product_name_1} />,
        dataIndex: 'name',
        //width: '150px',
        render: (d) => tdRender(d, '7vw'),
      },
      {
        title: <Trans i18nKey={LOCALS.rank} />,
        dataIndex: 'rank',
        //width: '150px',
        render: (d) => tdRender(d, '5vw'),
      },
      {
        title: <Trans i18nKey={LOCALS.color} />,
        dataIndex: 'color',
        //width: '150px',
        render: (d, record) => tdRender(renderEnter(d), '7vw'),
      },
      {
        title: <Trans i18nKey={LOCALS.material} />,
        dataIndex: 'material',
        //width: '150px',
        render: (d, record) => tdRender(renderEnter(d), '7vw'),
      },
      {
        title: <Trans i18nKey={LOCALS.hardware} />,
        dataIndex: 'hardware',
        //width: '150px',
        render: (d, record) => tdRender(renderEnter(d), '7vw'),
      },
      {
        title: <Trans i18nKey={LOCALS.price_1} />,
        dataIndex: 'price',
        //width: '150px',
        render: (text, record) => {
          const d = `${
            currencyMap[record.shopId || '1']
          } ${text.toLocaleString()}`;
          return tdRender(d, '7vw');
        },
      },
      {
        title: <Trans i18nKey={LOCALS.created_time} />,
        dataIndex: 'createTime',
        //width: '150px',
        render: (text) => {
          const d = text ? dayjs(text).format('YYYY-MM-DD') : '-';
          return tdRender(d, '6vw');
        },
      },
      {
        title: <Trans i18nKey={LOCALS.option} />,
        key: 'action',
        width: 120,
        render: (_, record) => (
          <Space size={2}>
            <Button
              size="small"
              type="link"
              onClick={() => handleForwardPrint([record])}
            >
              <Trans i18nKey={LOCALS.print} />
            </Button>
            <Button
              size="small"
              type="link"
              onClick={() => navigate(`/pms/label-edit/${record.id}`)}
            >
              <Trans i18nKey={LOCALS.edit} />
            </Button>

            <Button
              size="small"
              type="link"
              style={{ color: '#ff4d4f' }}
              onClick={() => {
                modal.confirm({
                  title: <Trans i18nKey={LOCALS.delete} />,
                  content: <Trans i18nKey={LOCALS.are_you_sure_to_delete} />,
                  cancelText: <Trans i18nKey={LOCALS.cancel} />,
                  okText: <Trans i18nKey={LOCALS.confirm} />,
                  onOk: () => {
                    handleDeletePriceTag(record.id as string);
                  },
                });
              }}
            >
              <Trans i18nKey={LOCALS.delete} />
            </Button>
            {/* </Popconfirm> */}
          </Space>
        ),
      },
    ];
  }, []);

  /** 删除 */
  const handleDeletePriceTag = async (id: string) => {
    try {
      await deletePriceTag(id);
      message.success(i18n.t('successful_operation'));
      loadPriceTagList();
    } catch (error) {
    } finally {
    }
  };

  /** 跳转打印 */
  const handleForwardPrint = (data: PriceTagInfo[]) => {
    if (data.length > 18) {
      message.warning('最多支持18条');
      return;
    }
    // 填充数据
    const arrayFill = Array.from({ length: 18 }, (_, i) => {
      if (data[i]) {
        return { ...data[i] };
      } else {
        return { id: i };
      }
    });
    localStorage.setItem('printData', JSON.stringify(arrayFill));
    window.open('/prints/cash-register');
  };

  /** 重置分页 */
  const resetPagination = (page = 1, pageSize = 10) => {
    setPageNum(page);
    setPageSize(pageSize);
    payloadRef.current = { pageNum: page, pageSize };
  };

  return (
    <div className={styles.labelWarp}>
      <div className={styles.labelWarp_form}>
        <Row>
          <Col {...grid_left} className={styles.labelWarp_form_left}>
            <Form
              form={form}
              layout={isMobile ? 'vertical' : 'inline'}
              onFinish={onFinish}
              initialValues={{
                shopId: shopIdRef.current,
              }}
            >
              <Form.Item
                name="keyword"
                label={<Trans i18nKey={LOCALS.keyword}></Trans>}
                className={styles.mb}
              >
                <Input.TextArea
                  placeholder={i18n.t(LOCALS.please_enter) || ''}
                  style={{ width: 240, height: 64 }}
                />
              </Form.Item>
              <Form.Item
                name="time"
                label={<Trans i18nKey={LOCALS.created_time}></Trans>}
                className={styles.mb}
              >
                <RangePicker
                  placeholder={[i18n.t(LOCALS.start), i18n.t(LOCALS.end)]}
                  style={{ width: 230 }}
                />
              </Form.Item>
              <Form.Item className={styles.mb}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    <Trans i18nKey={LOCALS.search} />
                  </Button>
                  <Button
                    onClick={() => {
                      resetPagination();
                      form.resetFields();
                      loadPriceTagList();
                    }}
                  >
                    <Trans i18nKey={LOCALS.reset} />
                  </Button>
                </Space>
              </Form.Item>
              <Form.Item name="shopId" className={styles.mb}>
                <Radio.Group
                  options={optionsCity}
                  optionType="button"
                  buttonStyle="solid"
                  disabled={Boolean(shop)}
                  onChange={(e) => {
                    localStorage.setItem('PriceTag_ShopId', e.target.value);
                    shopIdRef.current = e.target.value;
                    resetPagination();
                    loadPriceTagList();
                  }}
                />
              </Form.Item>
            </Form>
          </Col>
          <Col {...{ ...grid_right }} className={styles.mb}>
            <div className={styles.labelWarp_from_btnTool}>
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    navigate(`/pms/label-add`, {
                      state: {
                        shopId: shopIdRef.current,
                      },
                    });
                  }}
                >
                  <Trans i18nKey={LOCALS.add_price_tag} />
                </Button>
                {selectedRows.length === 0 ? (
                  <Popover content={'未选择价签'}>
                    <Button disabled={selectedRows.length === 0}>
                      <Trans i18nKey={LOCALS.batch_print} />
                    </Button>
                  </Popover>
                ) : (
                  <Button
                    onClick={() => handleForwardPrint(selectedRows)}
                    disabled={selectedRows.length === 0}
                  >
                    <Trans i18nKey={LOCALS.batch_print} />
                  </Button>
                )}
              </Space>
            </div>
          </Col>
        </Row>
      </div>

      <Table
        columns={getColumns}
        dataSource={dataSource}
        loading={loading}
        rowKey={'id'}
        rowSelection={{
          selectedRowKeys: selectedRows.map((d) => d.id) as React.Key[],
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        pagination={{
          total,
          pageSize,
          current: pageNum,
          onChange: (page, pageSize) => {
            resetPagination(page, pageSize);
            loadPriceTagList();
          },
        }}
      />

      {contextHolder}
    </div>
  );
};
export default LabelList;
