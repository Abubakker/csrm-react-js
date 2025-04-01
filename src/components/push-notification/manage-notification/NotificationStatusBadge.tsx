import { NotificationStatus } from './ManageNotification';

interface NotificationStatusBadgeProps {
  status: NotificationStatus;
}

const NotificationStatusBadge = ({ status }: NotificationStatusBadgeProps) => {
  const statusClass = [
    NotificationStatus.Draft,
    NotificationStatus.Unpublished,
  ].includes(status)
    ? 'bg-[#DADDEB]'
    : [NotificationStatus.Published, NotificationStatus.Scheduled].includes(
        status
      )
    ? 'bg-[#E5EAFF]'
    : 'bg-[#FFE5E5]';

  return (
    <span
      className={`${statusClass} font-bold text-[12px] rounded-[10px] px-2 py-[2px] text-[#3F4252] tracking-[1px]`}
    >
      {status}
    </span>
  );
};

export default NotificationStatusBadge;
