import { useSelector } from 'react-redux';
import { MessageList } from './MessageList';

export const Messages = () => {
  const session = useSelector(
    (state: any) => state.imManagerSettings.selectedSession
  );

  return <MessageList session={session} />;
};
