import { Form, Input, Modal, Select, message, Radio } from 'antd';
import { useCityList } from 'apis/home';
import { modifyOmsRecycleOrderDetails } from 'apis/oms';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import i18n from '../../../i18n';
import LOCALS from '../../../commons/locals';
import { useState, useCallback, useEffect } from 'react';
import { getMemberReceiveAddressListV1 } from 'apis/ums';
import { UmsMemberReceiveAddressV1 } from 'types/ums';
import { OmsRecycleOrderDetail } from 'types/oms';
import classNames from 'classnames';

type Props = {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  data: OmsRecycleOrderDetail;
};

export const Options = [
  { label: i18n.t('select_address'), value: 1 },
  { label: i18n.t('enter_address_manually'), value: 2 },
];

const ModifyLogistics = ({ open, onCancel, onSuccess, data }: Props) => {
  const [form] = Form.useForm();
  const { countryOptions } = useAppSelector(selectGlobalInfo);
  const countryValue = Form.useWatch('logisticsCountry', form);
  const addressId = Form.useWatch('addressId', form);
  const selectedType = Form.useWatch('selectedType', form);
  // const [selectedType, setSelectedType] = useState(2);

  const cityList = useCityList(countryValue);
  const [addressList, setAddressList] = useState<UmsMemberReceiveAddressV1[]>(
    []
  );

  /** 用户寄件地址 */
  const fetchMemberReceiveAddressList = useCallback((memberId: number) => {
    getMemberReceiveAddressListV1(memberId)
      .then(({ data }) => {
        setAddressList(data);
      })
      .finally(() => {});
  }, []);

  useEffect(() => {
    if (data.omsRecycleOrder?.memberId) {
      fetchMemberReceiveAddressList(data.omsRecycleOrder?.memberId);
    }
  }, [fetchMemberReceiveAddressList, data]);

  useEffect(() => {
    if (data.omsRecycleOrder) {
      const { name, phone, postCode, country, city, detailAddress } =
        data.omsRecycleOrderLogistics || {};
      const p = {
        logisticsName: name,
        logisticsPhone: phone,
        logisticsPostCode: postCode,
        logisticsCountry: country,
        logisticsCity: city,
        logisticsDetailAddress: detailAddress,
        id: data.omsRecycleOrder.id,
      };
      form.setFieldsValue({ ...p });
    }
  }, [data, form]);

  return (
    <Modal
      open={open}
      title={i18n.t(LOCALS.modify_logistics_information)}
      onCancel={onCancel}
      onOk={async () => {
        const { selectedType, addressId, ...rest } = form.getFieldsValue();
        if (selectedType === 1) {
          const address = addressList.find((d) => d.id === addressId);
          const { name, phoneNumber, postCode, city, detailAddress, country } =
            address!;
          const payload = {
            id: rest.id,
            logisticsName: name,
            logisticsPhone: phoneNumber,
            logisticsPostCode: postCode,
            logisticsCountry: country.code,
            logisticsCity: city.code,
            logisticsDetailAddress: detailAddress,
          };
          await modifyOmsRecycleOrderDetails(payload);
        } else {
          const payload = {
            ...rest,
          };
          await modifyOmsRecycleOrderDetails(payload);
        }

        message.success(i18n.t(LOCALS.successful_operation));
        onSuccess();
      }}
    >
      <Form
        form={form}
        labelCol={{ span: 4 }}
        initialValues={{
          selectedType: 2,
        }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="selectedType" label={i18n.t('address')}>
          <Radio.Group
            options={Options}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>
        {selectedType === 2 ? (
          <>
            <Form.Item label={i18n.t(LOCALS.name)} name="logisticsName">
              <Input />
            </Form.Item>
            <Form.Item
              label={i18n.t(LOCALS.phone_number)}
              name="logisticsPhone"
            >
              <Input prefix="+" />
            </Form.Item>
            <Form.Item
              label={i18n.t(LOCALS.postal_code)}
              name="logisticsPostCode"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={i18n.t(LOCALS.country_region)}
              name="logisticsCountry"
            >
              <Select
                onChange={() => {
                  form.setFieldValue('logisticsCity', '');
                }}
                options={countryOptions}
                showSearch
                filterOption={(input: string, option?: any) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              ></Select>
            </Form.Item>
            <Form.Item
              label={i18n.t(LOCALS.state_province_city)}
              name="logisticsCity"
            >
              <Select
                showSearch
                filterOption={(input: string, option?: any) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={cityList.map(({ code, name }) => {
                  return { value: code, label: name };
                })}
              ></Select>
            </Form.Item>
            <Form.Item
              label={i18n.t(LOCALS.detail_address)}
              name="logisticsDetailAddress"
            >
              <Input.TextArea rows={5} />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item label={i18n.t(LOCALS.detail_address)} name="addressId">
              <Radio.Group className="w-full">
                {addressList?.length &&
                  addressList.map((d) => (
                    <div
                      key={d.id}
                      className={classNames('bg-[#F9F9F9] py-2 px-4 mt-2', {
                        'bg-[#FFF6EA]': d.id === addressId,
                      })}
                    >
                      <Radio value={d.id}>
                        {d.name} | {d.phoneNumber} | {d.province}
                        {d.detailAddress}
                      </Radio>
                    </div>
                  ))}
              </Radio.Group>
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ModifyLogistics;
