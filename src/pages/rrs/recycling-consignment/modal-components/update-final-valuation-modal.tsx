import { useState, useEffect, useCallback } from 'react';
import styles from './index.module.scss';
import {
  Form,
  Modal,
  InputNumber,
  message,
  Popconfirm,
  Button,
  Input,
} from 'antd';
import {
  OmsRecycleOrderDetail,
  OmsRecycleOrderValuationPayload,
  OmsRecycleOrderItem,
  OmsRecycleOrder,
} from 'types/oms';
import { fetchUpdateFinalValuation } from 'apis/oms';
import { thousands } from 'utils/tools';
import BriefProductInfo from '../components/brief-product-info';
import useProductFormData from 'commons/hooks/useProductFormData';
import {
  OMS_RECYCLE_ORDER_STATUS_MAP,
  LANGUAGE_NAME_MAPPING, LANGUAGE_PLACEHOLDER_MAPPING
} from 'constants/RecyclingConsignment';
import useMember from 'commons/hooks/useMember';
import i18n from 'i18next';
import LOCALS from '../../../../commons/locals';

interface Props {
  open: boolean;
  onClose: () => void;
  data: OmsRecycleOrderDetail;
  reload: () => void;
  modalOption: { status: number };
}

/** 修改最终估值 */
const UpdateFinalValuationModal = ({
  open,
  onClose,
  data,
  reload,
  modalOption,
}: Props) => {
  const [form] = Form.useForm<OmsRecycleOrderValuationPayload>();
  const [info, setInfo] = useState<OmsRecycleOrderItem & OmsRecycleOrder>({});
  const [loading, setLoading] = useState(false);

  const { showData, setProductInfo } = useProductFormData();
  const { status } = modalOption;
  const { memberData } = useMember(data);
  const lang = LANGUAGE_NAME_MAPPING[memberData?.language || 'en'];
  const lang_placeholder = LANGUAGE_PLACEHOLDER_MAPPING[memberData?.language || 'en'];

  useEffect(() => {
    if (data?.omsRecycleOrderItem && data?.omsRecycleOrder) {
      const { finalRecyclePrice, finalSalePrice } = data.omsRecycleOrderItem;
      setProductInfo(data.omsRecycleOrderProduct || {});
      const { currency } = data?.omsRecycleOrder;
      const info = {
        finalRecyclePrice,
        finalSalePrice,
        currency,
      };
      setInfo(info);
    }
  }, [data, setProductInfo]);

  const onFinish = useCallback(() => {
    form.validateFields().then((values: any) => {
      setLoading(true);
      const { finalSalePrice, finalRecyclePrice, emailRemark } = values;
      const id = data?.omsRecycleOrder?.id;
      let payload = {
        finalSalePrice,
        finalRecyclePrice,
        id: `${id}`,
        emailRemark: emailRemark?.replace(/\n/g, '<br/>'),
      };
      fetchUpdateFinalValuation(payload)
        .then(() => {
          message.success(i18n.t(LOCALS.final_quote_successful));
          onClose();
          reload();
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [data, onClose, reload, form]);

  return (
    <Modal
      open={open}
      title={
        status === OMS_RECYCLE_ORDER_STATUS_MAP.ON_SALE
          ? i18n.t(LOCALS.modify_quote)
          : i18n.t(LOCALS.modify_quote)
      }
      onCancel={() => onClose()}
      onOk={onFinish}
      className={styles.UpdateFinalValuationModal}
      destroyOnClose
      footer={[
        <Button onClick={() => onClose()} key={'cancel'}>
          {i18n.t(LOCALS.cancel)}
        </Button>,
        <Popconfirm
          title={i18n.t(LOCALS.caution)}
          key={'ok'}
          description={<div className={styles.Popconfirm}>{i18n.t(LOCALS.confirm_submission)}</div>}
          onConfirm={() => onFinish()}
          okText={i18n.t(LOCALS.confirm)}
          cancelText={i18n.t(LOCALS.cancel)}
        >
          <Button
            type="primary"
            loading={loading}
            onClick={() => form.validateFields()}
          >
            {i18n.t(LOCALS.confirm)}
          </Button>
        </Popconfirm>,
      ]}
    >
      <BriefProductInfo data={data} showData={showData} />
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{ isPirce: 1 }}
      >
        <Form.Item label={i18n.t(LOCALS.consignment_price)}>
          {info.currency}&nbsp;&nbsp;
          {thousands(info.finalSalePrice)}
        </Form.Item>
        <Form.Item label={i18n.t(LOCALS.recycle_price)}>
          {info.currency}&nbsp;&nbsp;{thousands(info.finalRecyclePrice)}
        </Form.Item>
        <Form.Item
          label={i18n.t(LOCALS.consignment_confirmation_quote)}
          name="finalSalePrice"
          rules={[
            {
              validator: (_, value) => {
                const finalRecyclePrice =
                  form.getFieldValue('finalRecyclePrice');
                if (value && finalRecyclePrice && value < finalRecyclePrice) {
                  return Promise.reject(i18n.t(LOCALS.consignment_valuation_w));
                }
                if (!value && !form.getFieldValue('finalRecyclePrice')) {
                  return Promise.reject(i18n.t(LOCALS.filled_in_at_least_one));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            inputMode="numeric"
            max={1000000000}
            addonBefore={info.currency}
            style={{ width: '100%' }}
            min={1}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
          />
        </Form.Item>
        {status !== OMS_RECYCLE_ORDER_STATUS_MAP.ON_SALE && (
          <Form.Item
            label={i18n.t(LOCALS.recycling_confirmation_quote)}
            name="finalRecyclePrice"
            rules={[
              {
                validator: (_, value) => {
                  if (!value && !form.getFieldValue('finalSalePrice')) {
                    return Promise.reject(i18n.t(LOCALS.filled_in_at_least_one));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              inputMode="numeric"
              max={1000000000}
              addonBefore={info.currency}
              style={{ width: '100%' }}
              min={1}
              // disabled={status === 6}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
            />
          </Form.Item>
        )}
        <Form.Item
          label={
            <div>
              <div>{i18n.t(LOCALS.email_notes)}</div>
              <div className="text-xs text-right">({lang})</div>
            </div>
          }
          name="emailRemark"
        >
          <Input.TextArea rows={5} placeholder={lang_placeholder} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateFinalValuationModal;
