import { useCallback, useState } from 'react';
import styles from './index.module.scss';
import { Form, Modal, message, Radio, Input, Select, Row, Col } from 'antd';
import { OmsRecycleOrderDetail } from 'types/oms';
import { UmsMemberReceiveAddress } from 'types/ums';
import { umsAddMemberAddress } from 'apis/ums';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { getCityListByCountryCode } from 'apis/home';
import { MallCity } from 'types/home';
import i18n from 'i18n';
import LOCALS from 'commons/locals';
import { SelectOption } from 'types/base';

interface Props {
  open: boolean;
  onClose: () => void;
  data?: OmsRecycleOrderDetail;
  getLoad: () => void;
  memberId: number;
  title?: string;
}

interface UmsMemberReceiveAddress_ extends UmsMemberReceiveAddress {
  areaCode?: string;
  phone?: string;
}

const AddressAdd = ({ open, onClose, getLoad, memberId, title }: Props) => {
  const [form] = Form.useForm<UmsMemberReceiveAddress_>();
  const [loading, setLoading] = useState(false);
  const { countryOptions, countryCodeOptions } =
    useAppSelector(selectGlobalInfo);
  const [cityList, setCityList] = useState<MallCity[]>([]);

  const getCityList = (country: string) => {
    form.setFieldValue('city', '');
    setCityList([]);
    getCityListByCountryCode(country).then((res) => {
      setCityList(res.data.cityList || []);
    });
  };

  const onFinish = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true);
        const { areaCode, phone, ...rest } = values;
        umsAddMemberAddress({
          ...rest,
          phoneNumber: `${areaCode} ${phone}`,
          memberId,
        })
          .then((d) => {
            message.success(i18n.t(LOCALS.successful_operation));
            onClose();
            getLoad();
          })
          .catch((e) => {
            message.error(e.message);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(() => {});
  }, [memberId, form, getLoad, onClose]);

  const SelectFilter = useCallback(
    (input: string, option: SelectOption | undefined) =>
      (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
    [],
  );

  return (
    <Modal
      open={open}
      title={title || i18n.t(LOCALS.add)}
      onCancel={() => onClose()}
      onOk={onFinish}
      className={styles.AddressAdd}
      destroyOnClose
      width={700}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{ defaultStatus: 0 }}
      >
        <Form.Item
          label={i18n.t(LOCALS.name)}
          rules={[{ required: true }]}
          name="name"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={
            <span>
              <span style={{ color: 'red', marginRight: 4 }}>*</span>
              {i18n.t(LOCALS.phone_number)}
            </span>
          }
          rules={[{ required: true }]}
          className="mb-0"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item rules={[{ required: true }]} name="areaCode">
                <Select options={countryCodeOptions} showSearch />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item rules={[{ required: true }]} name="phone">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          label={i18n.t(LOCALS.zip_code)}
          rules={[{ required: true }]}
          name="postCode"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={i18n.t(LOCALS.country_region)}
          name={'province'}
          rules={[{ required: true }]}
        >
          <Select
            placeholder={i18n.t(LOCALS.country_region)}
            options={countryOptions}
            onChange={(e) => getCityList(e)}
            showSearch
            filterOption={SelectFilter}
          />
        </Form.Item>
        <Form.Item
          label={i18n.t(LOCALS.state_province_city)}
          name="city"
          // rules={[{ required: cityList.length > 0 }]}
        >
          <Select
            placeholder={i18n.t(LOCALS.state_province_city)}
            showSearch
            filterOption={SelectFilter}
            options={cityList.map(({ name, code }) => {
              return {
                value: code,
                label: name,
              };
            })}
          />
        </Form.Item>
        <Form.Item
          label={i18n.t(LOCALS.detail_address)}
          name="detailAddress"
          rules={[{ required: true }]}
        >
          <Input.TextArea
            rows={3}
            placeholder={i18n.t(LOCALS.detail_address) || ''}
          />
        </Form.Item>
        <Form.Item
          label={i18n.t(LOCALS.default_address)}
          name="defaultStatus"
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value={1}>{i18n.t(LOCALS.yes)}</Radio>
            <Radio value={0}>{i18n.t(LOCALS.no)}</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddressAdd;
