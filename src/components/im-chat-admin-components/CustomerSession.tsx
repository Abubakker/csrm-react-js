import { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import ReactTimeAgo from 'react-time-ago';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedCustomer,
  setSelectedSession,
  resetCurrentSession,
} from '../../store/im-chat-stores/imManagerSettingsSlice';

import { CheckMarkIcon, DoubleCheckIcon } from './assets/IMChatIcons';
import {
  useGetUserTagsQuery,
  useReadMediaChatMutation,
} from 'store/im-chat-stores/imManagerChatApi';
import { getSocialIcon, getTagStyles, parseAndValidateJSON, shortenString } from './helpers/utils';
import convertToHtml from './helpers/convertToHtml';

interface CustomerSessionProps {
  session: any;
}

interface Tag {
  id: string;
  color: string;
  name: string;
}

export const CustomerSession = ({ session }: CustomerSessionProps) => {
  const locale = useSelector((state: any) => state.imManagerSettings.locale);
  const customer = useSelector(
    (state: any) => state.imManagerSettings.selectedCustomer
  );
  const [updatedSession, setUpdatedSession] = useState(session);
  const [userTags, setUserTags] = useState([]);
  const [convertedMessage, setConvertedMessage] = useState('');

  const dispatch = useDispatch();
  const [readChat] = useReadMediaChatMutation();

  const userId = session?.user_id;
  const { data: userTagDetails } = useGetUserTagsQuery(
    { userId },
    { skip: !userId }
  );

  useEffect(() => {
    if (userTagDetails) {
      setUserTags(userTagDetails.tag_list);
    }
  }, [userTagDetails]);

  useEffect(() => {
    setUpdatedSession(session);
  }, [session]);

  // Handle session click
  const handleSessionClick = () => {
    readChat({ data: { identifier: session.identifier } });
    dispatch(resetCurrentSession());
    dispatch(setSelectedCustomer(session));
    dispatch(
      session.media_type !== 'im chat'
        ? setSelectedSession(session)
        : setSelectedSession(null)
    );
  };

  const socialIcon = getSocialIcon(session.media_type);

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
    if (session.media_type === 'im chat') {
      const converted = convertToHtml(session?.last_message);
      setConvertedMessage(converted || session?.last_message);
    } else {
      setConvertedMessage(session?.last_message);
    }
  }, [session]);

  return (
    <div
      className={`mb-4 p-2 hover:bg-white bg-[#EBEDF7] hover:shadow-md rounded-[10px] cursor-pointer ${
        customer?.UniqueID === session?.UniqueID ? 'bg-white shadow-md' : ''
      } ${session?.media_type === 'im chat' ? 'h-[94px]' : 'h-[82px]'}`}
      onClick={handleSessionClick}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <Avatar
              size={'40'}
              name={session?.first_name || 'Unknown User'}
              round={true}
              className="size-10"
            />
            {socialIcon && (
              <img
                src={socialIcon}
                alt=""
                className="w-4 bg-white rounded-[3px] p-[1px] absolute left-[27px] top-[27px]"
              />
            )}
          </div>

          <div className="grow flex flex-col justify-start overflow-hidden">
            <div className="flex justify-between items-center">
              <p
                className={`text-[14px] mb-0 leading-5 ${
                  updatedSession?.read_status === 1 ? 'font-bold' : ''
                }`}
              >
                {shortenString(session?.first_name, 15) || 'Unknown User'}
              </p>
              {updatedSession?.read_status === 1 ? (
                <div className="ml-1 h-2 w-2 bg-[#1677FF] rounded-full" />
              ) : updatedSession?.read_status === 2 &&
                session?.media_type !== 'im chat' ? (
                <CheckMarkIcon />
              ) : updatedSession?.read_status === 3 &&
                session?.media_type !== 'im chat' ? (
                <DoubleCheckIcon />
              ) : null}
            </div>

            <div className="flex justify-between items-center gap-2">
              <p className="text-[10px] mb-0 text-[#797D91] overflow-hidden truncate leading-4">
                ID {session?.user_id || 'N/A'}
              </p>
              <p className="text-[12px] mb-0 text-[#9EA1B5] tracking-[1px]">
                <ReactTimeAgo
                  timeStyle="twitter-first-minute"
                  date={new Date(session?.updated_at || session?.updated_at)}
                  locale={locale}
                />
              </p>
            </div>

            {session?.media_type === 'im chat' && (
              <div className="flex items-center gap-1 w-1/2">
                {userTags?.slice(0, 3).map((tag: Tag) => (
                  <div
                    key={tag.id}
                    style={getTagStyles(tag.color)}
                    className="py-1 px-[6px] border rounded text-[10px] font-medium h-[15px] flex items-center justify-center leading-[16px] tracking-[0.5px] font-NotoSans"
                  >
                    {tag.name}
                  </div>
                ))}

                {userTags?.length > 3 && <div>...</div>}
              </div>
            )}
          </div>
        </div>
        {isParsedDataCampaign() ? (
          <p
            className={`text-[#797D91] mb-0 text-[12px] grow overflow-hidden truncate tracking-[1px] leading-[18px] ml-[52px] ${
              session?.read_status === 1 ? 'font-bold' : ''
            }`}
          >
            Campaign Message
          </p>
        ) : (
          <p
            className={`text-[#797D91] mb-0 text-[12px] grow overflow-hidden truncate tracking-[1px] leading-[18px] ml-[52px] ${
              session?.read_status === 1 ? 'font-bold' : ''
            }`}
            dangerouslySetInnerHTML={{
              __html: shortenString(
                convertedMessage?.replace(/<[^>]*>/g, ''),
                28
              ),
            }}
          />
        )}
      </div>
    </div>
  );
};
