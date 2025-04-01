import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popover,
  Radio,
  Select,
  Spin,
  Switch,
  Table,
  DatePicker,
} from 'antd';
import { useAppSelector } from '../../../store/hooks';
import { selectUserInfo } from '../../../store/slices/userInfoSlice';
import { useEffect, useMemo, useState } from 'react';
import { SHOP_MAP, SHOP_OPTION_LIST } from '../../../commons/options';
import { Trans } from 'react-i18next';
import LOCALS from '../../../commons/locals';
import { useToggle } from 'react-use';
import { StaffReserveHistory, UmsStaff } from '../../../types/ums';
import usePagination from 'commons/hooks/usePagination';
import {
  deleteStaff,
  getUmsStaffList,
  reserveList,
  upsertStaff,
} from '../../../apis/ums';
import { ColumnsType } from 'antd/es/table';
import i18n from '../../../i18n';
import FormImageUpload from '../../../components/form-image-upload';
import ImageSliceShow from '../../../components/image-slice-show';
import ImageUploader from '../../../components/image-uploader';
import { debounce } from 'lodash-es';
import dayjs from 'dayjs';

const Attendance = () => {
  const { shop: userShop, isLoading } = useAppSelector(selectUserInfo);
  const [selectedShopId, setSelectedShopId] = useState(SHOP_MAP.GINZA);
  const shopOptionList = useMemo(() => {
    return [
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
  }, []);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [productPics, setProductPics] = useState<
    { url: string; name: string }[]
  >([]);

  const [modalOpen, toggleModalOpen] = useToggle(false);
  const [form] = Form.useForm<
    UmsStaff & {
      languages: string[];
    }
  >();
  const [historyModalOpen, toggleHistoryModalOpen] = useToggle(false);
  const [dataSourceStaffReserveHistory, setStaffReserveHistoryDataSource] =
    useState<StaffReserveHistory[]>([]);
  const [historyForm] = Form.useForm<StaffReserveHistory>();
  const {
    dataSource: historySource,
    setDataSource: setHistorySource,
    loading: historyLoading,
    pageNum: historyPageNum,
    setPageNum: setHistoryPageNum,
    pageSize: historyPageSize,
    setPageSize: setHistoryPageSize,
    total: historyTotal,
  } = usePagination<StaffReserveHistory>();

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
  } = usePagination<UmsStaff>();

  useEffect(() => {
    setLoading(true);
    getUmsStaffList({
      storeId: selectedShopId,
      pageNum,
      pageSize,
      name: searchKeyword,
    })
      .then((res) => {
        setDataSource(res);
        setTotal(res.length);
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
    searchKeyword,
  ]);
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchKeyword(value);
        setPageNum(1);
      }, 500),
    [setSearchKeyword, setPageNum]
  );

  // 添加清理防抖函数的 useEffect
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  const [inputValue, setInputValue] = useState('');

  const fetchDataSource = () => {
    historyForm.validateFields().then(async (values) => {
      const date = historyForm.getFieldValue('date');
      const startTime = date.startOf('day').format('YYYY-MM-DD HH:mm:ss');
      const endTime = date.endOf('day').format('YYYY-MM-DD HH:mm:ss');
      await reserveList({
        storeId: selectedShopId,
        startTime: startTime,
        endTime: endTime,
      }).then((res) => {
        setStaffReserveHistoryDataSource(res);
        setHistorySource(res);
      });
    });
  };

  const columns: ColumnsType<UmsStaff> = [
    {
      title: '店舗',
      dataIndex: 'storeId',
      key: 'storeId',
      width: 100,
      render: (storeId: number) => {
        return SHOP_OPTION_LIST.find((shop) => shop.value === storeId)?.label;
      },
    },
    {
      title: '名前/ローマ字',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (value: string, { romanName }: UmsStaff) => {
        return (
          <span>
            {value}/{romanName}
          </span>
        );
      },
    },
    {
      title: '自己紹介',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (description: string) => {
        return (
          <Popover
            placement="top"
            content={<div className="max-w-md">{description}</div>}
          >
            <div className="overflow-hidden line-clamp-3">{description}</div>
          </Popover>
        );
      },
    },
    {
      title: 'プロフィール画像',
      dataIndex: 'avatar',
      key: 'avatar',
      align: 'center',
      width: 200,
      render: (avatar: string) => {
        if (!avatar) return <span>-</span>;
        let picList: string[] = avatar.split(',');
        return (
          <ImageSliceShow
            imgList={picList}
            endSliceNumber={1}
            style={{ marginRight: 0 }}
          />
        );
      },
    },
    {
      title: '写真',
      dataIndex: 'personalPhoto',
      key: 'personalPhoto',
      align: 'center',
      width: 200,
      render: (personalPhoto: string) => {
        if (!personalPhoto) return <span>-</span>;
        let picList: string[] = personalPhoto.split(',');
        return (
          <ImageSliceShow
            imgList={picList}
            endSliceNumber={1}
            style={{ marginRight: 0 }}
          />
        );
      },
    },
    {
      title: '対応言語',
      dataIndex: 'languages',
      key: 'languages',
      width: 210,
      render: (languages: string) => {
        if (!languages) return '-';
        return (
          <div className="flex gap-2 flex-wrap">
            {languages.split(',').map((value) => {
              return (
                <span key={value}>
                  {langOptionList.find((lang) => lang.value === value)?.label}
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      title: '表示順',
      dataIndex: 'sort',
      key: 'sort',
      width: 100,
      render: (_: any, { sort }: UmsStaff) => {
        return <span>{sort}</span>;
      },
    },
    {
      title: '一般対応',
      dataIndex: 'regularVisit',
      key: 'regularVisit',
      width: 100,
      render: (regularVisit: UmsStaff['regularVisit'], { id }: UmsStaff) => {
        return (
          <Switch
            checked={!!regularVisit}
            onChange={(checked) => {
              upsertStaff({ id, regularVisit: checked ? 1 : 0 })
                .then((res) => {
                  message.success(i18n.t(LOCALS.successful_operation));
                  setDataSource((prevData) =>
                    prevData.map((staff) =>
                      staff.id === id
                        ? { ...staff, regularVisit: checked ? 1 : 0 }
                        : staff
                    )
                  );
                })
                .catch((err) => message.error(err.message));
            }}
          ></Switch>
        );
      },
    },
    {
      title: '査定対応',
      dataIndex: 'appraisal',
      key: 'appraisal',
      width: 100,
      render: (appraisal: UmsStaff['appraisal'], { id }: UmsStaff) => {
        return (
          <Switch
            checked={!!appraisal}
            onChange={(checked) => {
              upsertStaff({ id, appraisal: checked ? 1 : 0 })
                .then((res) => {
                  message.success(i18n.t(LOCALS.successful_operation));
                  setDataSource((prevData) =>
                    prevData.map((staff) =>
                      staff.id === id
                        ? { ...staff, appraisal: checked ? 1 : 0 }
                        : staff
                    )
                  );
                })
                .catch((err) => message.error(err.message));
            }}
          ></Switch>
        );
      },
    },
    {
      title: '稼働状態',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (_: any, { status, enabled, id }: UmsStaff) => {
        return (
          <div className="mb-2 text-center">
            <Select
              disabled={enabled !== 1}
              style={{ width: '120px' }}
              options={[
                {
                  label: <span style={{ color: '#52c41a' }}>対応可能</span>,
                  value: 'available',
                },
                {
                  label: <span style={{ color: '#ff4d4f' }}>対応中</span>,
                  value: 'busy',
                },
              ]}
              value={status}
              onChange={(newStatus) => {
                if (enabled === 1) {
                  upsertStaff({ id, status: newStatus })
                    .then(() => {
                      message.success(i18n.t(LOCALS.successful_operation));
                      setDataSource((prevData) =>
                        prevData.map((staff) =>
                          staff.id === id
                            ? {
                                ...staff,
                                status: newStatus,
                              }
                            : staff
                        )
                      );
                    })
                    .catch((err) => message.error(err.message));
                } else {
                  message.warning('该员工未启用');
                }
              }}
            />
          </div>
        );
      },
    },
    {
      title: '有効/無効',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (_: any, { enabled, id }: UmsStaff) => {
        return (
          <div className="mb-2 text-center">
            <Switch
              checked={enabled === 1}
              onChange={(checked) => {
                upsertStaff({ id, enabled: checked ? 1 : 0 })
                  .then((res) => {
                    message.success(i18n.t(LOCALS.successful_operation));
                    setDataSource((prevData) =>
                      prevData.map((staff) =>
                        staff.id === id
                          ? { ...staff, enabled: checked ? 1 : 0 }
                          : staff
                      )
                    );
                  })
                  .catch((err) => message.error(err.message));
              }}
            />
          </div>
        );
      },
    },
    {
      title: i18n.t(LOCALS.option),
      dataIndex: 'option',
      key: 'option',
      width: 100,
      render: (_, record) => (
        <div>
          <Button
            type="link"
            onClick={() => {
              form.setFieldsValue({
                ...record,
                languages: record.languages ? record.languages.split(',') : [],
              });

              if (record.personalPhoto) {
                setProductPics(
                  record.personalPhoto.split(',').map((url, index) => {
                    return { url, name: `${index}` };
                  })
                );
              } else {
                setProductPics([]);
              }
              toggleModalOpen(true);
            }}
          >
            {i18n.t(LOCALS.edit)}
          </Button>
          <Button
            type="link"
            danger
            onClick={() => {
              Modal.confirm({
                title: <Trans i18nKey={LOCALS.delete} />,
                content: <Trans i18nKey={LOCALS.are_you_sure_to_delete} />,
                cancelText: <Trans i18nKey={LOCALS.cancel} />,
                okText: <Trans i18nKey={LOCALS.confirm} />,
                onOk() {
                  deleteStaff(record.id)
                    .then(() => {
                      setDataSource((prevData) =>
                        prevData.filter((item) => item.id !== record.id)
                      );
                    })
                    .catch((err) => message.error(err.message));
                },
              });
            }}
          >
            {i18n.t(LOCALS.delete)}
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Spin />;
  }

  const langOptionList = [
    {
      label: '🇯🇵日本語',
      value: 'Japanese',
    },
    {
      label: '🇬🇧English',
      value: 'English',
    },
    {
      label: '🇨🇳中文',
      value: 'Chinese',
    },
    {
      label: '🇻🇳Tiếng Việt',
      value: 'Vietnamese',
    },
  ];

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
          }}
        />
      </div>

      <div>
        <div className="grid grid-cols-3 gap-4">
          <Form.Item label={i18n.t(LOCALS.search)}>
            <Input
              value={inputValue}
              placeholder={i18n.t(LOCALS.keyword) || ''}
              onChange={(e) => {
                const newValue = e.target.value;
                setInputValue(newValue);
                debouncedSearch(newValue);
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              onClick={() => {
                toggleModalOpen(true);
              }}
            >
              {i18n.t('add')}
            </Button>
            {/* <Button
              onClick={async () => {
                fetchDataSource();
                toggleHistoryModalOpen(true);
              }}
            >
              {i18n.t('attendance_record')}
            </Button> */}
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
        />
      </div>

      <Modal
        width={1100}
        open={modalOpen}
        onCancel={() => {
          form.resetFields();
          toggleModalOpen(false);
        }}
        onOk={() => {
          form.validateFields().then(async (values: UmsStaff) => {
            await upsertStaff({
              ...values,
              personalPhoto: productPics.map((d) => d.url).join(','),
              languages: values.languages.toString(),
            });
            message.success(i18n.t('successful_operation'));
            setTimeout(() => {
              window.location.reload();
            }, 500);
          });
        }}
        title={i18n.t('edit')}
      >
        <Form form={form} layout="horizontal" labelCol={{ span: 3 }}>
          <Form.Item name="id" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item
            label={i18n.t(LOCALS.shop)}
            name="storeId"
            required
            rules={[{ required: true }]}
          >
            <Select
              options={shopOptionList}
              value={selectedShopId}
              placeholder={i18n.t(LOCALS.please_select) || ''}
            />
          </Form.Item>
          <Form.Item
            label={i18n.t(LOCALS.name)}
            name="name"
            required
            rules={[{ required: true }]}
          >
            <Input
              placeholder={i18n.t(LOCALS.please_enter) || ''}
              maxLength={50}
            />
          </Form.Item>
          <Form.Item
            label="ローマ字"
            name="romanName"
            rules={[{ required: true }]}
          >
            <Input
              placeholder={i18n.t(LOCALS.please_enter) || ''}
              maxLength={50}
            />
          </Form.Item>
          <Form.Item
            label="自己紹介"
            name="description"
            required
            rules={[{ required: true }]}
          >
            <Input.TextArea
              placeholder={i18n.t(LOCALS.please_enter) || ''}
              rows={6}
            />
          </Form.Item>
          <Form.Item
            label="プロフィール画像"
            name="avatar"
            required
            rules={[{ required: true }]}
          >
            <FormImageUpload />
          </Form.Item>
          <Form.Item label="写真">
            <ImageUploader
              onChange={setProductPics}
              imgList={productPics}
              mode="multiple"
              autoSort={false}
              showRemoveBackground={false}
              max={2}
            />
          </Form.Item>
          <Form.Item name="languages" label="対応言語" initialValue={[]}>
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
          <Form.Item name="sort" label={i18n.t('sort')}>
            <InputNumber className="w-full" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        footer={null}
        onCancel={() => {
          toggleHistoryModalOpen(false);
          setHistorySource([]);
          setStaffReserveHistoryDataSource([]);
          historyForm.resetFields();
        }}
        title={i18n.t('attendance_record')}
        open={historyModalOpen}
        width={1000}
      >
        <Form form={historyForm} layout="horizontal">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'nowrap' }}>
            <Form.Item
              label={i18n.t(LOCALS.sales_date)}
              name="date"
              initialValue={dayjs()}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item label={i18n.t('name')} name="name">
              <Input
                placeholder={i18n.t(LOCALS.please_enter) || ''}
                onChange={(e) => {
                  const keyword = e.target.value.toLowerCase();
                  const filteredData = dataSourceStaffReserveHistory.filter(
                    (item) => item.name?.toLowerCase().includes(keyword)
                  );
                  setHistorySource(filteredData);
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={fetchDataSource}>
                {i18n.t(LOCALS.search)}
              </Button>
            </Form.Item>
          </div>
          <Table
            rowKey="historyId"
            dataSource={historySource}
            loading={historyLoading}
            pagination={{
              current: historyPageNum,
              pageSize: historyPageSize,
              total: historyTotal,
              onChange: (page, pageSize) => {
                setHistoryPageNum(page);
                setHistoryPageSize(pageSize);
              },
            }}
            columns={[
              {
                title: i18n.t(LOCALS.shop),
                dataIndex: 'storeId',
                key: 'storeId',
                render: (storeId) => {
                  const shopInfo = SHOP_OPTION_LIST.find(
                    (item) => item.value === storeId
                  );
                  return shopInfo?.label || storeId;
                },
              },
              {
                title: i18n.t(LOCALS.name),
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: i18n.t(LOCALS.start_time),
                dataIndex: 'startTime',
                key: 'startTime',
                render: (startTime) => {
                  return dayjs(startTime).format('YYYY-MM-DD HH:mm:ss');
                },
              },
              {
                title: i18n.t(LOCALS.end_time),
                dataIndex: 'endTime',
                key: 'endTime',
                render: (endTime) => {
                  return dayjs(endTime).format('YYYY-MM-DD HH:mm:ss');
                },
              },
            ]}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default Attendance;
