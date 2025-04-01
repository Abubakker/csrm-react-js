import { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  useGetMediaUserMessagesQuery,
  useGetMediaUserSessionsQuery,
  useGetSessionMessagesQuery,
  useReadChatMutation,
} from '../../store/im-chat-stores/imManagerChatApi.js';
import { MessageLoader } from './loader/MessageLoader.jsx';
import { MessageBody } from './message-body/MessageBody';
import { MessageForm } from './message-form/MessageForm';
import {
  insertMessage,
  resetMessageList,
} from '../../store/im-chat-stores/imManagerSettingsSlice.js';
import { SkeletonLoader } from './loader/SkeletonLoader.jsx';

export const MessageList = ({ session }: any) => {
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [allMessages, setAllMessages] = useState<any>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const { data: customerSessionDetails } = useGetMediaUserSessionsQuery(
    {
      customer: session?.identifier,
      page: 1,
    },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: mediaUsersMessages,
    isLoading,
    isSuccess,
    isFetching,
  } = useGetMediaUserMessagesQuery(
    {
      page,
      mediaType: session?.media_type,
      session: customerSessionDetails?.data[0]?.UniqueID,
      identifier: customerSessionDetails?.data[0]?.session_details,
    },
    {
      skip:
        !customerSessionDetails?.data[0]?.UniqueID &&
        !customerSessionDetails?.data[0]?.session_details,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }
  );

  const customer = useSelector(
    (state: any) => state.imManagerSettings.selectedCustomer
  );
  const messageList = useSelector(
    (state: any) => state.imManagerSettings.messageList
  );
  const [readChat] = useReadChatMutation();

  const { data: userMessages } = useGetSessionMessagesQuery(
    {
      session: session,
    },
    {
      skip: !session?.id,
    }
  );
  const { message: socketMessage } = useSelector((state: any) => state.socket);

  // Update message list based on customer or media messages
  useEffect(() => {
    setMessagesLoading(true);
    if (customer.media_type === 'im chat') {
      setAllMessages(
        messageList
          .slice()
          .sort(
            (a: any, b: any) =>
              new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          )
      );
    } else if (isSuccess && mediaUsersMessages?.data?.length) {
      setAllMessages([...mediaUsersMessages?.data].reverse());
    }
    setMessagesLoading(false);
  }, [isSuccess, mediaUsersMessages, messageList, customer]);

  // Handle incoming messages from the socket
  useEffect(() => {
    const handleMessage = (message: any) => {
      const sessionDetails = customerSessionDetails?.data[0];
      const isSameSession =
        sessionDetails?.UniqueID === message?.content?.session;
      const isInstagramOrMessenger =
        session?.media_type === 'instagram' ||
        session?.media_type === 'messenger';
      const isSameCustomer =
        sessionDetails?.customer === message?.content?.sender ||
        sessionDetails?.customer === message?.content?.receiver;

      if (isSameSession || (isInstagramOrMessenger && isSameCustomer)) {
        setAllMessages((prevMessages: any) => [
          ...prevMessages,
          message?.content,
        ]);
      }
    };

    handleMessage(socketMessage);
  }, [customerSessionDetails, session, socketMessage]);

  useEffect(() => {
    if (userMessages?.imMessageList) {
      dispatch(resetMessageList());
      dispatch(insertMessage(userMessages.imMessageList));
    }
  }, [dispatch, userMessages]);

  // Adjust text area height dynamically and scroll chat container
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [inputValue, messageList, allMessages]);

  // Mark chat as read
  useEffect(() => {
    readChat({ session });
  }, [readChat, session]);

  // Reset input value when session changes
  useEffect(() => {
    setInputValue('');
  }, [session]);

  // Handle pagination and fetch next page
  const fetchNextPage = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  return (
    <div className="flex flex-col justify-between bg-white h-[100%]">
      <div
        ref={chatContainerRef}
        id="scrollableDiv2"
        className="relative flex flex-col-reverse w-full h-full overflow-y-auto scroll-smooth bg-white im-chat-scrollbar"
      >
        {isLoading || isFetching || messagesLoading ? (
          <div className="pt-10">
            <MessageLoader />
          </div>
        ) : (
          <InfiniteScroll
            dataLength={allMessages?.length || 20}
            next={fetchNextPage}
            hasMore={
              allMessages?.length === null ||
              allMessages?.length < allMessages?.length
            }
            loader={<SkeletonLoader />}
            scrollableTarget="scrollableDiv2"
            style={{
              height: '100%',
              overflow: 'auto',
            }}
            className="px-4 pt-2 space-y-2"
          >
            {customer.media_type === 'im chat'
              ? allMessages?.length > 0 &&
                allMessages?.map((message: any, i: number) => (
                  <MessageBody
                    key={`${i}`}
                    customer={customer}
                    message={message}
                    userMedia={customer.media_type}
                  />
                ))
              : isSuccess &&
                allMessages?.length > 0 &&
                allMessages?.map((message: any, i: number) => (
                  <MessageBody
                    key={`${i}`}
                    customer={customer}
                    message={message}
                    userMedia={customer.media_type}
                  />
                ))}
          </InfiniteScroll>
        )}
      </div>
      <div className="sticky bottom-0 w-full h-auto bg-white">
        <MessageForm
          inputRef={inputRef}
          setInputValue={setInputValue}
          inputValue={inputValue}
        />
      </div>
    </div>
  );
};
