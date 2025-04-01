import React from 'react';
import { Status } from './CouponDataTable';

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getBackgroundColor = (status: Status) => {
    switch (status) {
      case Status.Draft:
        return 'bg-[#DADDEB]';
      case Status.Active:
        return 'bg-[#E5EAFF]';
      case Status.Inactive:
        return 'bg-[#99FFEE]';
      case Status.Expired:
        return 'bg-[#FFE5E5]';
      default:
        return '';
    }
  };

  return (
    <span
      className={`${getBackgroundColor(
        status
      )} font-bold text-[12px] rounded-[10px] px-2 py-[2px] text-[#3F4252] tracking-[1px]`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
