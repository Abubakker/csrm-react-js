import { useEffect, useState } from 'react';
import { getMemberById } from 'apis/ums';
import { UmsMember } from 'types/ums';
import { OmsRecycleOrderDetail } from 'types/oms';

const useMember = (data: OmsRecycleOrderDetail) => {
  const [memberData, setMemberData] = useState<UmsMember>();

  useEffect(() => {
    if (data?.omsRecycleOrder) {
      getMember(data?.omsRecycleOrder?.memberId!);
    }
  }, [data]);

  const getMember = (memberId: number) => {
    getMemberById(memberId).then((data) => {
      const { data: memberData } = data;
      setMemberData(memberData);
    });
  };

  return {
    memberData,
  };
};

export default useMember;
