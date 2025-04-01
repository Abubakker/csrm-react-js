import Avatar from 'react-avatar';
import { useSelector } from 'react-redux';

export const SessionInfo = () => {
  const customer = useSelector(
    (state: any) => state.imManagerSettings.selectedCustomer
  );

  return (
    <div className="px-3">
      <div className="flex items-center gap-3 justify-start">
        <Avatar
          size={'40'}
          name={customer?.first_name || 'unknown User'}
          round={true}
          className="cursor-default size-10"
        />
        <div>
          <p className="text-[14px] font-normal leading-5 cursor-default mb-0">
            {customer?.first_name || 'unknown User'}
          </p>
          <p className="text-gray-500 font-medium text-[10px] leading-4 tracking-[0.5px] mb-0 cursor-default">
            ID:&nbsp;{customer?.user_id}
          </p>
        </div>
      </div>
    </div>
  );
};
