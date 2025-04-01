import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  message,
} from 'antd';
import { getCityListByCountryCode } from 'apis/home';
import { getMemberById, umsMemberUpdate, umsMemberCreateAPI } from 'apis/ums';
import LOCALS from 'commons/locals';
import {
  GENDER_OPTION_LIST,
  SHOP_MAP,
  SHOP_OPTION_LIST,
  SOCIAL_MEDIA_MAP,
  SOCIAL_MEDIA_OPTION_LIST,
  LANGUAGE_MAP,
} from 'commons/options';
import dayjs, { Dayjs } from 'dayjs';
import i18n from 'i18n';
import { useEffect, useState, useCallback } from 'react';
import { Trans } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { MallCity } from 'types/home';
import { UmsMember } from 'types/ums';
import { useToggle } from 'react-use';
import { useSelector } from 'react-redux';
import { selectUserInfo } from 'store/slices/userInfoSlice';
import { getLocalStorageLanguage } from 'commons';
import { japaneseToGregorian, gregorianToJapanese } from './utils';
import { SelectOption } from 'types/base';
import { CreateOrderTypeList } from 'constants/RecyclingConsignment';
import {
  removeRecyclingConsignmentStore,
  ITEM_NAME_MAP,
} from 'pages/rrs/recycling-consignment-order/components/utils';

type MemberAddEditProps = {
  mode: 'add' | 'edit';
  memberId?: UmsMember['id'];
  // 收银台的创建
  source?: 'checkout-counter';
  onClose?: () => void;
  setUmsMember?: (data: UmsMember) => void;
};

const MemberAddEdit = ({
  memberId,
  mode,
  source,
  onClose,
  setUmsMember,
}: MemberAddEditProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm<
    Omit<UmsMember, 'birthday'> & {
      birthday?: Dayjs;
      jpDate?: string;
    }
  >();
  const [country, setCountry] = useState('');
  const [cityList, setCityList] = useState<MallCity[]>([]);
  const { countryOptions, countryCodeOptions } =
    useAppSelector(selectGlobalInfo);
  const { shop } = useSelector(selectUserInfo);
  const [open, toggleOpen] = useToggle(false);
  const [radioValue, setRadioValue] = useState<string>();
  const [createMember, setCreateMenber] = useState<UmsMember>();

  const showIdCertificate = useCallback(() => {
    const pathname = location.pathname;
    let b = false;
    [
      '/rrs/recycling-contract-order',
      '/rrs/consignment-contract-order',
      '/rrs/recycling-consignment-intention',
      '/ums/member-edit',
    ].forEach((d) => {
      if (pathname.indexOf(d) > -1) b = true;
    });
    return b;
  }, [location]);

  useEffect(() => {
    if (!country) return;

    getCityListByCountryCode(country).then((res) => {
      setCityList(res.data.cityList || []);
    });
  }, [country]);

  useEffect(() => {
    const map = {
      [SHOP_MAP.GINZA]: '81',
      [SHOP_MAP.HONGKONG]: '852',
      [SHOP_MAP.SINGAPORE]: '65',
    };
    if (mode === 'add') {
      form.setFieldsValue({
        gender: 0,
        countryCode: shop ? map[shop] || '81' : '81',
        socialName: SOCIAL_MEDIA_MAP.WHATSAPP,
        createSource: shop ? shop : SHOP_MAP.WEBSITE,
        language: 'en',
      });
    }

    if (mode === 'edit' && memberId) {
      getMemberById(memberId).then(({ data }) => {
        setCountry(data.country);

        form.setFieldsValue({
          ...data,
          birthday: data.birthday ? dayjs(data.birthday) : undefined,
          jpDate: data.birthday
            ? gregorianToJapanese(data.birthday)
            : undefined,
        });
      });
    }
  }, [form, memberId, mode, shop]);

  const onFinish = async () => {
    if (source === 'checkout-counter') {
      Modal.confirm({
        title: <Trans i18nKey={LOCALS.confirm_submit} />,
        onOk: async () => {
          const birthday = form.getFieldsValue().birthday
            ? form.getFieldsValue().birthday?.format('YYYY-MM-DD')
            : undefined;
          const data: Omit<UmsMember, 'id'> = {
            ...form.getFieldsValue(),
            birthday,
          };
          const t = await umsMemberCreateAPI(data);
          message.success(i18n.t(LOCALS.successful_operation));
          setUmsMember?.({ ...t, showName: `${t.firstName} ${t.lastName}` });
          onClose?.();
        },
      });
    } else {
      Modal.confirm({
        title: <Trans i18nKey={LOCALS.confirm_submit} />,
        onOk: async () => {
          const birthday = form.getFieldsValue().birthday
            ? form.getFieldsValue().birthday?.format('YYYY-MM-DD')
            : undefined;

          if (mode === 'add') {
            const data: Omit<UmsMember, 'id'> = {
              ...form.getFieldsValue(),
              birthday,
            };

            // TODO: 可能需要跳转订单创建页面
            const t = await umsMemberCreateAPI(data);
            setCreateMenber(t);
            message.success(i18n.t(LOCALS.successful_operation));
            toggleOpen();
          }

          if (mode === 'edit' && memberId) {
            const data: UmsMember = {
              ...form.getFieldsValue(),
              id: memberId,
              birthday,
            };

            await umsMemberUpdate(data);

            message.success(i18n.t(LOCALS.successful_operation));
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        },
      });
    }
  };

  const onBack = () => {
    if (source === 'checkout-counter') {
      onClose?.();
    } else {
      navigate('/ums/member-list');
    }
  };

  const onOk = () => {
    let url = '';
    let state = {};
    if (radioValue === '1') {
      url = '/oms/order-create';
      state = { memberEmail: createMember?.email, memberId: createMember?.id };
    } else if (radioValue === '2') {
      removeRecyclingConsignmentStore(
        ITEM_NAME_MAP.RECYCLING_CONSIGNMENT_CONTRACT
      );
      url = '/rrs/recycling-contract-order';
      state = { memberEmail: createMember?.email };
    } else if (radioValue === '4') {
      removeRecyclingConsignmentStore(
        ITEM_NAME_MAP.RECYCLING_CONSIGNMENT_CONTRACT
      );
      url = '/rrs/consignment-contract-order';
      state = { memberEmail: createMember?.email };
    } else if (radioValue === '3') {
      url = '/rrs/recycling-consignment-intention';
      state = { memberEmail: createMember?.email };
    }
    navigate(url, { state });
  };

  const SelectFilter = useCallback(
    (input: string, option: SelectOption | undefined) =>
      (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
    []
  );

  return (
    <div>
      <Form form={form} labelCol={{ xl: 4, sm: 6 }} onFinish={onFinish}>
        <Form.Item
          labelCol={{ xl: 4, sm: 6 }}
          label={<Trans i18nKey={LOCALS.created_from} />}
          name="createSource"
          rules={[
            {
              required: true,
              message: <Trans i18nKey={LOCALS.required_field} />,
            },
          ]}
        >
          <Radio.Group options={SHOP_OPTION_LIST} />
        </Form.Item>

        <Row gutter={18}>
          <Col span={12}>
            <Form.Item
              labelCol={{ xl: 8, sm: 12 }}
              name="firstName"
              label={<Trans i18nKey={LOCALS.first_name} />}
              rules={[
                {
                  required: true,
                  message: <Trans i18nKey={LOCALS.required_field} />,
                },
              ]}
            >
              <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              label={<Trans i18nKey={LOCALS.last_name} />}
              rules={[
                {
                  required: true,
                  message: <Trans i18nKey={LOCALS.required_field} />,
                },
              ]}
            >
              <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={18}>
          <Col span={12}>
            <Form.Item
              labelCol={{ xl: 8, sm: 12 }}
              name="firstNameKatakana"
              label={<Trans i18nKey={LOCALS.first_name_katakana} />}
            >
              <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastNameKatakana"
              label={<Trans i18nKey={LOCALS.last_name_katakana} />}
            >
              <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="gender" label={<Trans i18nKey={LOCALS.gender} />}>
          <Radio.Group>
            {GENDER_OPTION_LIST.map(({ value, label }) => {
              return (
                <Radio key={value} value={value}>
                  {label}
                </Radio>
              );
            })}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          labelCol={{ xl: 4, sm: 6 }}
          name="language"
          label={<Trans i18nKey={LOCALS.CxeLXsjeRo} />}
        >
          <Radio.Group>
            <Radio value="en">{i18n.t('en')}</Radio>
            <Radio value="ja">{i18n.t('ja')}</Radio>
            <Radio value="zh_CN">{i18n.t('zh_CN')}</Radio>
            <Radio value="zh_TW">{i18n.t('zh_TW')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          labelCol={{ xl: 4, sm: 6 }}
          name="email"
          label={<Trans i18nKey={LOCALS.email} />}
          rules={[
            {
              required: true,
              message: <Trans i18nKey={LOCALS.required_field} />,
            },
            { type: 'email' },
          ]}
        >
          <Input
            disabled={mode === 'edit'}
            placeholder={i18n.t(LOCALS.please_enter) || ''}
          />
        </Form.Item>

        <Form.Item
          labelCol={{ xl: 4, sm: 6 }}
          label={<Trans i18nKey={LOCALS.phone_number} />}
          required
          style={{ marginBottom: 0 }}
        >
          <Row gutter={18}>
            <Col span={8}>
              <Form.Item
                name="countryCode"
                rules={[
                  {
                    required: true,
                    message: <Trans i18nKey={LOCALS.required_field} />,
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder={i18n.t(LOCALS.please_select)}
                  options={countryCodeOptions}
                />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="phone"
                rules={[
                  {
                    required: true,
                    message: <Trans i18nKey={LOCALS.required_field} />,
                  },
                ]}
              >
                <Input placeholder={'ハイフンなしで入力してください'} />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        {getLocalStorageLanguage() === LANGUAGE_MAP.JA ? (
          <Form.Item
            label={<Trans i18nKey={LOCALS.birthday} />}
            className="mb-0"
          >
            <Row gutter={18}>
              <Col span={6}>
                <Form.Item name="jpDate">
                  <Input
                    allowClear={false}
                    style={{ width: '100%' }}
                    placeholder="R6/7/12"
                    onBlur={(e) => {
                      const val = e.target.value;
                      if (val) {
                        const gregorianDate = japaneseToGregorian(val);
                        form.setFieldValue('birthday', dayjs(gregorianDate));
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={18}>
                <Form.Item name="birthday">
                  <DatePicker
                    allowClear={false}
                    style={{ width: '100%' }}
                    placeholder="2024-07-12"
                    format={['YYYY-M-D', 'YYYY-MM-DD']}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        ) : (
          <Form.Item
            label={<Trans i18nKey={LOCALS.birthday} />}
            name="birthday"
          >
            <DatePicker
              allowClear={false}
              style={{ width: '100%' }}
              format={['YYYY-M-D', 'YYYY-MM-DD']}
            />
          </Form.Item>
        )}

        <Form.Item
          labelCol={{ xl: 4, sm: 6 }}
          label={<Trans i18nKey={LOCALS.country_region} />}
          name="country"
          rules={[
            {
              required: true,
              message: <Trans i18nKey={LOCALS.required_field} />,
            },
          ]}
        >
          <Select
            placeholder={i18n.t(LOCALS.please_select) || ''}
            onChange={(country) => {
              setCountry(country);
              form.setFieldValue('city', '');
            }}
            options={countryOptions}
            showSearch
            filterOption={SelectFilter}
          />
        </Form.Item>

        <Form.Item
          labelCol={{ xl: 4, sm: 6 }}
          label={<Trans i18nKey={LOCALS.state_province_city} />}
          name="city"
        >
          <Select
            placeholder={i18n.t(LOCALS.please_select) || ''}
            options={cityList.map(({ name, id }) => {
              return {
                value: `${id}`,
                label: name,
              };
            })}
            showSearch
            filterOption={(input: string, option?: any) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          labelCol={{ xl: 4, sm: 6 }}
          label={<Trans i18nKey={LOCALS.detail_address} />}
          name="detailAddress"
        >
          <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
        </Form.Item>

        <Form.Item
          labelCol={{ xl: 4, sm: 6 }}
          label={<Trans i18nKey={LOCALS.social_media} />}
          name="socialAccount"
          className="mb-0"
        >
          <Row gutter={18}>
            <Col span={6}>
              <Form.Item name="socialName">
                <Select
                  options={SOCIAL_MEDIA_OPTION_LIST}
                  placeholder={i18n.t(LOCALS.please_select) || ''}
                />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item name="socialAccount">
                <Input placeholder={i18n.t(LOCALS.social_handle) || ''} />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        {showIdCertificate() && (
          <>
            <Form.Item
              label={<Trans i18nKey={LOCALS.id_certificate} />}
              name="idCertificate"
            >
              <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
            </Form.Item>
            <Form.Item
              label={<Trans i18nKey={LOCALS.payment_details} />}
              name="paymentDetails"
            >
              <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
            </Form.Item>
          </>
        )}

        <Form.Item
          label={<Trans i18nKey={LOCALS.coupon} />}
          name="couponCode"
          hidden={mode === 'edit'}
        >
          <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
        </Form.Item>

        <Form.Item label={<Trans i18nKey={LOCALS.note} />} name="remark">
          <Input.TextArea placeholder={i18n.t(LOCALS.please_enter) || ''} />
        </Form.Item>

        <Form.Item>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Space>
              <Button onClick={onBack}>
                {source === 'checkout-counter' ? (
                  <Trans i18nKey={LOCALS.cancel} />
                ) : (
                  <Trans i18nKey={LOCALS.back} />
                )}
              </Button>
              <Button type="primary" htmlType="submit">
                <Trans i18nKey={LOCALS.submit} />
              </Button>
            </Space>
          </div>
        </Form.Item>
      </Form>
      <Modal
        title="是否创建订单"
        open={open}
        onOk={onOk}
        onCancel={() => onBack()}
      >
        <div className="w-[180px] m-auto my-4">
          <Radio.Group onChange={(e) => setRadioValue(e.target.value)}>
            {CreateOrderTypeList.map((d) => (
              <div key={d.value}>
                <Radio value={d.value}>{d.label}</Radio>
              </div>
            ))}
          </Radio.Group>
        </div>
      </Modal>
    </div>
  );
};

export default MemberAddEdit;
