import { useState, useCallback, useEffect } from 'react';
import styles from './index.module.scss';
import {
  Form,
  Modal,
  Input,
  message,
  Select,
  Popconfirm,
  Button,
  Collapse,
  Descriptions,
} from 'antd';
import {
  OmsRecycleOrderDetail,
  OmsRecycleOrderValuationPayload,
} from 'types/oms';
import { fetchConfirmReturn } from 'apis/oms';
import BriefProductInfo from '../components/brief-product-info';
import UploadImageTips from '../input-components/upload-image-tips';
import useProductFormData from 'commons/hooks/useProductFormData';
import { CaretRightOutlined } from '@ant-design/icons';
import ClipboardJS from 'clipboard';
import useAddress, { AddressInfoInterface } from 'commons/hooks/useAddress';
import LOCALS from '../../../../commons/locals';
import i18n from 'i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  data: OmsRecycleOrderDetail;
  reload: () => void;
}

/** 确认退货 */
const ConfirmReturnModal = ({ open, onClose, data, reload }: Props) => {
  const [form] = Form.useForm<OmsRecycleOrderValuationPayload>();
  const [loading, setLoading] = useState(false);
  const [returnType, setReturnType] = useState<number>(2);
  const [copyText, setCopyText] = useState('');
  const [returnGoods, setReturnGoods] = useState<
    { label: string; value?: string }[]
  >([]);

  const { showData, setProductInfo } = useProductFormData();
  const { getAddressInfo } = useAddress();

  useEffect(() => {
    new ClipboardJS('.copy-btn');
    //
    setProductInfo(data.omsRecycleOrderProduct || {});
  }, []);

  useEffect(() => {
    const { omsRecycleOrderLogistics } = data;
    if (omsRecycleOrderLogistics) {
      const { city, province, country, detailAddress, phone, postCode, name } =
        omsRecycleOrderLogistics;
      getAddressInfo({
        city,
        province,
        country,
        detailAddress,
      }).then((data) => {
        const { city, country, detailAddress } = data as AddressInfoInterface;
        const info = [
          { label: i18n.t(LOCALS.name), value: name },
          { label: i18n.t(LOCALS.phone_number), value: phone ? `+${phone}` : '-' },
          { label: i18n.t(LOCALS.postal_code), value: postCode },
          { label: i18n.t(LOCALS.country_region), value: country },
          { label: i18n.t(LOCALS.state_province_city), value: city },
          { label: i18n.t(LOCALS.detail_address), value: detailAddress },
        ];
        let copyData = '';
        // 这里需要保留换行
        info.map((d) => (copyData += `${d.label}：${d.value}\n`));
        setCopyText(copyData);
        setReturnGoods(info);
      });
    }
  }, [data]);

  const onFinish = useCallback(() => {
    form.validateFields().then((values: any) => {
      setLoading(true);
      const {
        returnType,
        returnExpressCompany,
        returnTrackingNumber,
        returnVoucher,
      } = values;
      const id = data?.omsRecycleOrder?.id;
      let payload: any = {
        id: `${id}`,
        returnType,
      };
      if (returnType === 2) {
        payload = {
          ...payload,
          returnVoucher,
          returnExpressCompany,
          returnTrackingNumber,
        };
      }
      fetchConfirmReturn(payload)
        .then(() => {
          message.success('确认退货提交成功！');
          onClose();
          reload();
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [data]);

  return (
    <Modal
      open={open}
      title={i18n.t(LOCALS.confirm_return)}
      onCancel={() => onClose()}
      onOk={onFinish}
      className={styles.UpdateFinalValuationModal}
      destroyOnClose
      confirmLoading={loading}
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
      <Collapse
        bordered
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        style={{ background: '#fff' }}
        size="small"
        items={[
          {
            key: '1',
            label: i18n.t(LOCALS.return_information_collection),
            children: (
              <div className={styles.desc}>
                <Descriptions
                  size="small"
                  bordered
                  column={2}
                  layout="vertical"
                  labelStyle={{ width: 200 }}
                  contentStyle={{ width: 200 }}
                  items={returnGoods.map((d, i) => ({
                    key: i,
                    label: d.label,
                    children: (
                      <div style={{ minWidth: 120 }}>{d.value || '-'}</div>
                    ),
                  }))}
                />
                <div className={styles.btn}>
                  <Button
                    type="primary"
                    onClick={() => message.success(i18n.t(LOCALS.successful_operation))}
                    data-clipboard-text={copyText}
                    className="copy-btn"
                  >
                    {i18n.t(LOCALS.copy_return_information)}
                  </Button>
                </div>
              </div>
            ),
          },
        ]}
      />
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{ returnType }}
        className={styles.form}
      >
        <Form.Item
          label= {i18n.t(LOCALS.return_method)}
          name="returnType"
          rules={[{ required: true }]}
        >
          <Select onChange={setReturnType}>
            <Select.Option value={1}>{i18n.t(LOCALS.in_store_pickup)}</Select.Option>
            <Select.Option value={2}>{i18n.t(LOCALS.mail)}</Select.Option>
          </Select>
        </Form.Item>
        {returnType === 2 && (
          <>
            <Form.Item
              label={i18n.t(LOCALS.express_company_name)}
              name="returnExpressCompany"
              rules={[{ required: true }]}
            >
              <Input maxLength={100} />
            </Form.Item>
            <Form.Item
              label={i18n.t(LOCALS.tracking_number)}
              name="returnTrackingNumber"
              rules={[{ required: true }]}
            >
              <Input maxLength={100} />
            </Form.Item>
            <Form.Item
              label={i18n.t(LOCALS.return_receipt)}
              name="returnVoucher"
              rules={[{ required: true }]}
            >
              <UploadImageTips />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ConfirmReturnModal;
