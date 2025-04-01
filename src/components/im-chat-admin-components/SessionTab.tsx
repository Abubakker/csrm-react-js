import { useTranslation } from 'react-i18next';

interface SessionTabProps {
  sessionStatus: number;
  setSessionStatus: (status: number) => void;
}

const SessionTab = ({ sessionStatus, setSessionStatus }: SessionTabProps) => {
  const { t } = useTranslation();
  const tabs = ['opened', 'closed'];

  return (
    <div className="px-3">
      <div className="flex bg-gray-300 p-1 rounded-lg w-full items-center justify-between ">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-sm font-semibold rounded-lg w-1/2 
            ${sessionStatus === index + 1 ? 'bg-primary' : 'bg-transparent'}
          `}
            onClick={() => setSessionStatus(index + 1)}
          >
            {t(tab)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SessionTab;
