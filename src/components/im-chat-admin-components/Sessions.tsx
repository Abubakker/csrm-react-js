import { Typography } from 'antd';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SessionList } from './SessionList';
import { SessionInfo } from './SessionInfo';
import SessionTab from './SessionTab';
import { useState } from 'react';

const { Title } = Typography;

export const Sessions: React.FC = () => {
  const [sessionStatus, setSessionStatus] = useState(1);

  const resetCurrentSessionList = useSelector(
    (state: any) => state.imManagerSettings.resetCurrentSessionList
  );
  const { t } = useTranslation();

  return (
    <div className="flex justify-center flex-col gap-6 bg-[#F5F6FC] h-full">
      <Title className="mx-3 mt-6 !mb-0 font-bold !text-[20px] font-NotoSans">
        {t('sessions')}
      </Title>
      <SessionInfo />
      <SessionTab
        setSessionStatus={setSessionStatus}
        sessionStatus={sessionStatus}
      />
      <SessionList
        key={resetCurrentSessionList}
        sessionStatus={sessionStatus}
      />
    </div>
  );
};
