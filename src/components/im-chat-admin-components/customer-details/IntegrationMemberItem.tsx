import { LinkOutlined } from '@ant-design/icons';
import { TickCircleIcon } from 'assets/images';
import { useTranslation } from 'react-i18next';

interface IntegrationMemberItemProps {
  member: any;
  integrating: { id: null | number; status: boolean };
  isIntegrated: { id: null | number; status: boolean };
  countDown: number | null;
  onStartIntegration: (id: number) => void;
  onCancel: () => void;
}

const IntegrationMemberItem = ({
  member,
  integrating,
  isIntegrated,
  countDown,
  onStartIntegration,
  onCancel,
}: IntegrationMemberItemProps) => {
  const { t } = useTranslation();
  const shortenString = (str: string, maxLength: number) =>
    str?.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;

  return (
    <div className="p-2 hover:bg-[#EBF3FF] rounded flex items-center justify-between gap-1 group">
      <div className="space-y-1 w-[calc(100%-50px)] overflow-hidden">
        <p className="text-[14px] text-[#3F4252] mb-0">
          {`${member.firstName} ${member.lastName}`}
        </p>
        <p className="text-[14px] text-[#3F4252] mb-0" title={member.email}>
          {shortenString(member.email, 25)}
        </p>
        <p className="text-[14px] text-[#3F4252] mb-0">
          {member.phone || 'N/A'}
        </p>
      </div>

      {isIntegrated.id === member.id && isIntegrated.status ? (
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-[#1677FF] font-bold">
            {t('integrated')}
          </span>
          <img src={TickCircleIcon} alt="" className="w-4 h-4" />
        </div>
      ) : integrating.id === member.id && integrating.status ? (
        <div className="text-center">
          <p className="text-[#8B8FA3] font-medium text-[12px] mb-2">
            {`${t('integrating_in_3s')} ${countDown}s`}
          </p>
          <button
            onClick={onCancel}
            className="bg-[#FF2A00] rounded-lg py-1 px-3 text-white"
          >
            {t('cancel')}
          </button>
        </div>
      ) : (
        <button
          onClick={() => onStartIntegration(member.id)}
          className="p-3 rounded-[10px] bg-[#1677FF] text-white text-[16px] hidden opacity-0 group-hover:opacity-100 group-hover:block transition-opacity duration-300"
        >
          <LinkOutlined />
        </button>
      )}
    </div>
  );
};

export default IntegrationMemberItem;
