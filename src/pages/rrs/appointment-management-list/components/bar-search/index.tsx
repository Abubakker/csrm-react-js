import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { Button, Space, Form, Row, Col, Select } from 'antd';
import { statusOption } from 'constants/appointment-management';
import { Trans } from 'react-i18next';
import LOCALS from 'commons/locals';
import SelectSearch from './select-search';
import {
  OmsAppointmentPayload,
  OmsAppointmentStatusTotal,
} from 'types/oms';
import { SelectOption } from 'types/base';
import i18n from '../../../../../i18n';

const TotalOptions = [
  { label: i18n.t(LOCALS.weekly_appointments_total), value: 0 },
  { label: i18n.t(LOCALS.arrived), value: 0 },
  { label: i18n.t(LOCALS.booked), value: 0 },
  { label: i18n.t(LOCALS.cancelled), value: 0 },
  { label: i18n.t(LOCALS.no_show), value: 0 },
];

interface Props {
  onSearch: (data: OmsAppointmentPayload) => void;
  total: number;
  statusTotal: OmsAppointmentStatusTotal;
}

const BarSearch = ({ total, onSearch, statusTotal }: Props) => {
  const [form] = Form.useForm<any>();
  const [statusList, setStatusList] = useState<SelectOption[]>([]);

  /** 搜索 */
  const onFinish = () => {
    form.validateFields().then((values: any) => {
      const { status, selectSearch } = values;
      const { field, value } = selectSearch;
      const payload = {
        status,
        [field]: value,
      };
      onSearch(payload);
    });
  };

  useEffect(() => {
    if (statusTotal && Object.keys(statusTotal).length > 0) {
      const t = [...TotalOptions];
      t[0].value = Object.values(statusTotal).reduce((a, b) => a + b);
      t[1].value = statusTotal?.arrived || 0;
      t[2].value = statusTotal.reserved || 0;
      t[3].value = statusTotal.cancel || 0;
      t[4].value = statusTotal.timeout || 0;
      setStatusList(t);
    }
  }, [statusTotal, total]);

  return (
    <div className={styles.barSearch}>
      <Row>
        <Col span={24} className={styles.warp}>
          <div className={styles.subTitle}>{i18n.t(LOCALS.appointment_overview)}</div>
          <div className={styles.items}>
            {statusList.map((d, i) => (
              <div className={styles.item} key={i}>
                <div className={styles.label}>{d.label}：</div>
                <div className={styles.value}>{d.value}</div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form
            form={form}
            onFinish={onFinish}
            initialValues={{ status: '' }}
            className={styles.form}
          >
            <Row gutter={[12, 12]}>
              <Col span={3}>
                <Form.Item name={'status'}>
                  <Select options={statusOption}></Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name={'selectSearch'}>
                  <SelectSearch />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      <Trans i18nKey={LOCALS.search} />
                    </Button>
                    <Button
                      htmlType="button"
                      onClick={() => {
                        form.resetFields();
                        onFinish();
                      }}
                    >
                      <Trans i18nKey={LOCALS.reset} />
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
              <Col span={13} className={styles.pageTotal}>
                {i18n.t(LOCALS.quantity)}：{total}
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
export default BarSearch;
