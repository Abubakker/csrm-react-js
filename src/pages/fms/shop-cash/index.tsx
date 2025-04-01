import { PlusCircleOutlined } from '@ant-design/icons';
import { MinusCircleOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Spin,
  Table,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { addShopCashLog, getShopCashLogList, getSysShopList } from 'apis/fms';
import classNames from 'classnames';
import usePagination from 'commons/hooks/usePagination';
import LOCALS from 'commons/locals';
import {
  CASH_LOG_TYPE_MAP,
  SHOP_MAP,
  SHOP_OPTION_LIST,
  TYPE_OPTIONS,
} from 'commons/options';
import dayjs, { Dayjs } from 'dayjs';
import i18n from 'i18n';
import { useEffect, useMemo } from 'react';
import { useState } from 'react';
import { Trans } from 'react-i18next';
import { useToggle } from 'react-use';
import { useAppSelector } from 'store/hooks';
import { selectUserInfo } from 'store/slices/userInfoSlice';
import { FmsShopCashLog } from 'types/fms';
import { SysShop } from 'types/sys';
import useDebounce from '../../../commons/hooks/useDebounce';
import ShopCashExportCsv from './shop-cash-export-csv';

type ActionType = 'add' | 'subtract';

const ShopCash = () => {
  const { shop: userShop, isLoading } = useAppSelector(selectUserInfo);
  const [selectedShopId, setSelectedShopId] = useState(SHOP_MAP.GINZA);
  const shopOptionList = [
    {
      value: SHOP_MAP.GINZA,
      label: <Trans i18nKey={LOCALS.ginza_shop} />,
    },
    {
      value: SHOP_MAP.HONGKONG,
      label: <Trans i18nKey={LOCALS.hongkong_shop} />,
    },
    {
      value: SHOP_MAP.SINGAPORE,
      label: <Trans i18nKey={LOCALS.singapore_shop} />,
    },
  ];
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const debouncedKeyword = useDebounce(searchKeyword);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [modalOpen, toggleModalOpen] = useToggle(false);
  const [form] = Form.useForm<{
    amount: number;
    note: string;
  }>();
  const [actionType, setActionType] = useState<ActionType>('add');
  useEffect(() => {
    if (userShop) {
      setSelectedShopId(userShop);
    }
  }, [userShop]);

  const {
    loading,
    setLoading,
    dataSource,
    setDataSource,
    pageNum,
    setPageNum,
    pageSize,
    setPageSize,
    total,
    setTotal,
  } = usePagination<FmsShopCashLog>();

  const [sysShopList, setSysShopList] = useState<SysShop[]>([]);
  const currentShop = sysShopList.find(({ id }) => id === selectedShopId);

  useEffect(() => {
    getSysShopList().then((res) => {
      setSysShopList(res);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    getShopCashLogList({
      shopId: selectedShopId,
      pageNum,
      pageSize,
      keyword: debouncedKeyword,
      startDate: startDate?.startOf('day').format(),
      endDate: endDate?.endOf('day').format(),
      types: selectedTypes.map(String),
    })
      .then((res) => {
        setDataSource(res.list);
        setTotal(res.total);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    pageNum,
    pageSize,
    setDataSource,
    setTotal,
    selectedShopId,
    setLoading,
    debouncedKeyword,
    startDate,
    endDate,
    selectedTypes,
  ]);

  const columns: ColumnsType<FmsShopCashLog> = [
    {
      title: '店舗',
      dataIndex: 'shopId',
      key: 'shopId',
      render: (shopId: number) => {
        return SHOP_OPTION_LIST.find((shop) => shop.value === shopId)?.label;
      },
    },
    {
      title: '変動前',
      dataIndex: 'balanceBefore',
      key: 'balanceBefore',
      render: (balanceBefore: number) => {
        return <span>{balanceBefore.toLocaleString('en-US')}</span>;
      },
    },
    {
      title: '変動金額',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => {
        return (
          <span
            className={classNames({
              'text-red-500': amount < 0,
              'text-green-500': amount > 0,
            })}
          >
            {`${amount > 0 ? '+' : '-'}${Math.abs(amount).toLocaleString(
              'en-US',
            )}`}
          </span>
        );
      },
    },
    {
      title: '変動後',
      dataIndex: 'balanceAfter',
      key: 'balanceAfter',
      render: (balanceAfter: number) => {
        return <span>{balanceAfter.toLocaleString('en-US')}</span>;
      },
    },
    {
      title: '分類',
      dataIndex: 'type',
      key: 'type',
      render: (type: number | null) => {
        if (type === null || type === undefined) {
          return '-';
        }
        return CASH_LOG_TYPE_MAP[type] || '-';
      },
    },
    {
      title: i18n.t(LOCALS.operator),
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: i18n.t(LOCALS.updated_time),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => {
        return <span>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: i18n.t(LOCALS.remark),
      dataIndex: 'note',
      key: 'note',
      render: (note?: string) => {
        if (!note) {
          return <span>-</span>;
        }
        return <div dangerouslySetInnerHTML={{ __html: note }}></div>;
      },
    },
  ];

  if (isLoading) {
    return <Spin />;
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-center">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          options={shopOptionList}
          value={selectedShopId}
          onChange={(e) => {
            setSelectedShopId(e.target.value);
            setPageNum(1);
            setSearchKeyword('');
            setSelectedTypes([]);
          }}
        />
      </div>

      <div className="flex justify-center items-center gap-4">
        <Button
          icon={<MinusCircleOutlined />}
          shape="circle"
          onClick={() => {
            setActionType('subtract');
            toggleModalOpen();
          }}
        />

        <div className="text-5xl md:text-9xl font-bold">
          {`${currentShop?.currency || ''} ${currentShop?.cashBalance.toLocaleString('en-US') || ''}`}
        </div>
        <Button
          icon={<PlusCircleOutlined />}
          shape="circle"
          onClick={() => {
            setActionType('add');
            toggleModalOpen();
          }}
        />
      </div>

      <div>
        <div className="grid grid-cols-4 gap-4">
          <Form.Item label={i18n.t(LOCALS.search)}>
            <Input
              value={searchKeyword}
              placeholder={i18n.t(LOCALS.keyword) || ''}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setPageNum(1);
              }}
            />
          </Form.Item>
          <Form.Item label="分類">
            <Select
              mode="multiple"
              placeholder="分類を選択"
              value={selectedTypes}
              onChange={(values) => {
                setSelectedTypes(values);
                setPageNum(1);
              }}
              options={TYPE_OPTIONS}
              className="w-full"
            />
          </Form.Item>
          <Form.Item label={i18n.t(LOCALS.start_date)}>
            <DatePicker
              className="w-full"
              value={startDate}
              onChange={(value) => {
                setStartDate(value);
              }}
            />
          </Form.Item>
          <Form.Item label={i18n.t(LOCALS.end_date)}>
            <DatePicker
              className="w-full"
              value={endDate}
              onChange={(value) => {
                setEndDate(value);
              }}
            />
          </Form.Item>
        </div>
        <Table
          rowKey="id"
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            onChange: (page, pageSize) => {
              setPageNum(page);
              setPageSize(pageSize);
            },
          }}
          title={() => (
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium"> </span>
              <ShopCashExportCsv
                onFetchData={(paginationParams) =>
                  getShopCashLogList({
                    shopId: selectedShopId,
                    keyword: debouncedKeyword,
                    startDate: startDate?.startOf('day').format(),
                    endDate: endDate?.endOf('day').format(),
                    types: selectedTypes.map(String),
                    ...paginationParams,
                  })
                }
                loading={loading}
                currency={currentShop?.currency}
                disabled={!dataSource.length}
              />
            </div>
          )}
        />
      </div>

      <Modal
        open={modalOpen}
        onCancel={toggleModalOpen}
        onOk={() => {
          form.validateFields().then(async ({ amount, note }) => {
            await addShopCashLog({
              amount: actionType === 'add' ? amount : -amount,
              note,
              shopId: selectedShopId,
            });
            message.success(i18n.t('successful_operation'));
            setTimeout(() => {
              window.location.reload();
            }, 500);
          });
        }}
        title={actionType === 'add' ? '金額増加' : '金額減少'}
      >
        <Form form={form} layout="horizontal" labelCol={{ span: 4 }}>
          <Form.Item
            label="金額"
            name="amount"
            required
            rules={[{ required: true }]}
          >
            <InputNumber
              min={1}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
              prefix={actionType === 'add' ? '+' : '-'}
              className="w-full"
            />
          </Form.Item>
          <Form.Item
            label={i18n.t(LOCALS.remark)}
            name="note"
            required
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShopCash;
