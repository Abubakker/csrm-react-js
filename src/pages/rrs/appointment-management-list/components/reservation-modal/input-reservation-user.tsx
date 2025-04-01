import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { Input, Row, Col, message } from 'antd';
import { umsSearchMember } from 'apis/ums';
import i18n from '../../../../../i18n';
import LOCALS from '../../../../../commons/locals';

export interface ReservationUserType {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  username?: string;
  memberId?: number;
}

interface Props {
  onChange?: (data: ReservationUserType) => void;
}

const InputReservationUser = ({ onChange }: Props) => {
  const [searchLoading, setSearchLoading] = useState(false);
  const [formData, setFormData] = useState<ReservationUserType>({});

  useEffect(() => {
    if (onChange) {
      const { firstName = '', lastName = '' } = formData;
      const username = firstName + lastName;
      const data = { ...formData };
      if (username) data.username = username;
      onChange(data);
    }
  }, [formData]);

  /** 用户搜索 */
  const getSearchMemberList = (keyword: string) => {
    setSearchLoading(true);
    umsSearchMember(keyword)
      .then((data) => {
        if (data.data) {
          const { email, firstName, lastName, phone, id, countryCode } =
            data.data;
          setFormData({
            email,
            firstName: lastName,
            lastName: firstName,
            phone: phone ? `${countryCode} ${phone}` : '',
            memberId: id,
          });
          // message.success('查询成功');
        } else {
          message.warning('查询不到该用户');
        }
      })
      .catch(() => {
        message.warning('查询失败');
      })
      .finally(() => {
        setSearchLoading(false);
      });
  };

  const handleChange = (field: string, value: string) => {
    const t: any = { ...formData };
    t[field] = value;
    setFormData(t);
  };

  return (
    <div className={styles.InputReservationUser}>
      <Row>
        <Col span={24} className={styles.formItems}>
          <Input.Search
            placeholder={i18n.t(LOCALS.search_member_information)||''}
            enterButton
            loading={searchLoading}
            // value={'huziwei@ginzaxiaoma.com'}
            onSearch={(e) => {
              getSearchMemberList(e);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12} className={styles.formItems}>
          <div className={styles.label}>{i18n.t(LOCALS.last_name)}：</div>
          <div className={styles.input}>
            <Input
              placeholder={i18n.t(LOCALS.please_enter)||''}
              value={formData?.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
          </div>
        </Col>
        <Col span={12} className={styles.formItems}>
          <div className={styles.label}>{i18n.t(LOCALS.first_name)}：</div>
          <div className={styles.input}>
            <Input
              placeholder={i18n.t(LOCALS.please_enter)||''}
              value={formData?.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={12} className={styles.formItems}>
          <div className={styles.label}>{i18n.t(LOCALS.phone_number)}：</div>
          <div className={styles.input}>
            <Input
              placeholder={i18n.t(LOCALS.please_enter)||''}
              value={formData?.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
        </Col>
        <Col span={12} className={styles.formItems}>
          <div className={styles.label}>{i18n.t(LOCALS.email)}：</div>
          <div className={styles.input}>
            <Input
              placeholder={i18n.t(LOCALS.please_enter)||''}
              value={formData?.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default InputReservationUser;
