import { Spin } from 'antd';
import { getMemberByIdV2 } from 'apis/ums';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MemberBaseInfo from './base-info';
import MemberOrderList from './order-list';
import styles from './index.module.scss';
import MemberPointHistory from './point-history';
import MemberAddressList from './address-list';
import MemberMailHistory from './mail-history';
import RecyclingConsignmentHistory from './recycling-consignment-history';
import { UnwrapPromise } from 'types/base';
import LayoutFloatButton from 'components/layout-float-button';

const MemberView = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] =
    useState<UnwrapPromise<ReturnType<typeof getMemberByIdV2>>>();

  useEffect(() => {
    if (!id) return;
    getMemberByIdV2(Number(id)).then((res) => {
      setMember(res);
    });
  }, [id]);

  if (!member) {
    return <Spin />;
  }

  return (
    <div>
      <MemberBaseInfo member={member} />
      <div className={styles.divider} />
      <MemberAddressList memberId={member.id} />
      <div className={styles.divider} />
      <MemberOrderList memberId={member.id} />
      <div className={styles.divider} />
      <MemberPointHistory memberId={member.id} />
      <div className={styles.divider} />
      <RecyclingConsignmentHistory memberId={member.id} member={member} />
      <div className={styles.divider} />
      <MemberMailHistory memberId={member.id} />

      <LayoutFloatButton />
    </div>
  );
};

export default MemberView;
