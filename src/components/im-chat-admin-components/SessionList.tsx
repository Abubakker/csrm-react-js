import { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import { SessionDetails } from './SessionDetails';
import { SkeletonLoader } from './loader/SkeletonLoader';
import { useGetCustomerSessionsQuery } from 'store/im-chat-stores/imManagerChatApi';

interface Session {
  list: [];
  total: 0;
}

interface SessionListProps {
  sessionStatus: number;
}

export const SessionList = ({ sessionStatus }: SessionListProps) => {
  // State for holding session data, pagination, and loading status
  const [sessions, setSessions] = useState<any>([]);
  const [page, setPage] = useState(1);

  // Redux state selectors
  const { selectedCustomer, pluginKey } = useSelector(
    (state: any) => state.imManagerSettings
  );

  const { user_id: customerId } = selectedCustomer || {};

  const { mediaUsers: socketMediaUsers } = useSelector(
    (state: any) => state.socket
  );

  const { data, isLoading, refetch } = useGetCustomerSessionsQuery({
    userId: customerId,
    status: sessionStatus,
    pageSize: 20,
    pageNum: page,
    pluginKey,
  });

  const customerSessions = data as Session;

  const fetchNextPage = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  useEffect(() => {
    setSessions(customerSessions?.list || []);
  }, [customerSessions]);

  // Socket listener for 'updateUsers' event to trigger data fetch
  useEffect(() => {
    refetch();
  }, [socketMediaUsers, page, refetch]);

  return (
    <div
      className="overflow-y-scroll !h-[90%] im-chat-scrollbar scroll-smooth mt-0 pl-3 pr-2"
      id="scrollableDiv"
    >
      {isLoading && <SkeletonLoader />}
      <InfiniteScroll
        dataLength={sessions.length}
        next={fetchNextPage}
        hasMore={
          sessions?.total !== null && sessions?.list?.length < sessions?.total
        }
        loader={<SkeletonLoader />}
        scrollableTarget="scrollableDiv"
      >
        {sessions?.map((session: any) => (
          <SessionDetails session={session} key={session?.id} />
        ))}
      </InfiniteScroll>
    </div>
  );
};
