// Define enum for status values
export enum BadgeStatus {
  DRAFT = 'Draft',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  EXPIRED = 'Expired',
}

interface StatusBadgeProps {
  status: BadgeStatus;
}

const statusStyles = {
  [BadgeStatus.DRAFT]: 'bg-[#DADDEB]',
  [BadgeStatus.ACTIVE]: 'bg-[#E5EAFF]',
  [BadgeStatus.INACTIVE]: 'bg-[#99FFEE]',
  [BadgeStatus.EXPIRED]: 'bg-[#FFE5E5]',
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span
      className={`${statusStyles[status]} font-bold text-[12px] rounded-[10px] px-2 py-[2px] text-[#3F4252] tracking-[1px]`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
