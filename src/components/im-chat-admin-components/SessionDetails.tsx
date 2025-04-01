import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ReactTimeAgo from 'react-time-ago';
import { sessionContent } from './helpers/sessionContentHelper.js';
import { CheckMarkIcon } from './assets/IMChatIcons.jsx';
import {
  resetMessageList,
  setSelectedSession,
} from '../../store/im-chat-stores/imManagerSettingsSlice.js';
import { DoubleCheckIcon } from './assets/IMChatIcons.jsx';
import { parseAndValidateJSON, shortenString } from './helpers/utils';
import convertToHtml from './helpers/convertToHtml';
import { useEffect, useState } from 'react';

interface SessionDetailsProps {
  session: any;
}

export const SessionDetails = ({ session }: SessionDetailsProps) => {
  const dispatch = useDispatch();
  const { t: translation } = useTranslation();
  const selectedSession = useSelector(
    (state: any) => state.imManagerSettings.selectedSession
  );
  const locale = useSelector((state: any) => state.imManagerSettings.locale);

  // Extract session content with translation
  const { lastMessage, personType } = sessionContent(session, translation);
  const [convertedMessage, setConvertedMessage] = useState('');

  // Handle click to select session
  const handleClick = () => {
    if (session?.id !== selectedSession?.id) {
      dispatch(resetMessageList());
      dispatch(setSelectedSession(session));
    }
  };
  // Date formatting
  const date = new Date(
    session?.latestImMessage?.createdAt || session?.createdAt
  ).toLocaleDateString();

  const isParsedDataCampaign = () => {
    const parsedData = parseAndValidateJSON(session?.last_message, [
      'title',
      'imageUrl',
      'buttons',
      'language',
    ]);
    return parsedData !== null;
  };

  useEffect(() => {
    const converted = convertToHtml(lastMessage);
    setConvertedMessage(converted || lastMessage);
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={`mb-4 p-[10px] rounded-[10px] h-[64px] hover:bg-white hover:shadow-md flex items-center space-x-2 cursor-pointer ${
        selectedSession?.id === session?.id ? 'bg-white shadow-md' : ''
      }`}
    >
      <div className="grow flex flex-col">
        <div className="flex justify-between items-center space-x-2">
          <p
            className={`text-[14px] leading-5 mb-0 ${
              session?.unRead > 0 ? 'font-bold' : ''
            }`}
          >
            <ReactTimeAgo
              date={
                new Date(
                  session?.latestImMessage?.createdAt || session?.createdAt
                )
              }
              locale={locale}
            />
          </p>
          <p className="mb-0 text-[12px] leading-3 text-[#C5C8D9]">{date}</p>
        </div>
        <div className="flex justify-between items-end space-x-4 overflow-x-hidden h-6">
          {isParsedDataCampaign() ? (
            <p
              className={`text-[#797D91] mb-0 text-[12px] leading-[18px] tracking-[1px] grow overflow-hidden truncate ${
                session?.unRead > 0 ? 'font-bold' : ''
              }`}
            >
              Campaign Message
            </p>
          ) : (
            <p
              className={`text-[#797D91] mb-0 text-[12px] leading-[18px] tracking-[1px] grow overflow-hidden truncate ${
                session?.unRead > 0 ? 'font-bold' : ''
              }`}
              dangerouslySetInnerHTML={{
                __html: shortenString(
                  convertedMessage?.replace(/<[^>]*>/g, ''),
                  20
                ),
              }}
            />
          )}

          <p className="text-[12px] mb-0">
            {session?.unRead > 0 && (
              <div className="ml-1 h-2 w-2 bg-[#1677FF] rounded-full"></div>
            )}
            {session?.unRead === 0 &&
              (personType === 'user' ? <CheckMarkIcon /> : <DoubleCheckIcon />)}
          </p>
        </div>
      </div>
    </div>
  );
};
