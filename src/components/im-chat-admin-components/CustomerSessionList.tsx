import { useState, useCallback, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMediaUsersQuery } from 'store/im-chat-stores/imManagerChatApi';
import { CustomerSession } from './CustomerSession';
import { SkeletonLoader } from './loader/SkeletonLoader';
import { setSocketMediaUsers } from 'store/im-chat-stores/socketSlice';

interface CustomerSessionListProps {
  key: number;
  searchKeyword: string;
  tagIds: string;
}

export const CustomerSessionList = ({
  searchKeyword,
  tagIds,
}: CustomerSessionListProps) => {
  const [page, setPage] = useState(1);
  const [mediaUsers, setMediaUsers] = useState<any>([]);
  const { mediaUsers: socketMediaUsers } = useSelector(
    (state: any) => state.socket
  );

  // Fetch media users based on search keyword, pagination, and tag filters
  const { data, isSuccess, isLoading } = useGetMediaUsersQuery({
    keyword: searchKeyword,
    page,
    tagIds,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    setMediaUsers(socketMediaUsers);
  }, [socketMediaUsers]);

  // Handle pagination and fetch next page
  const fetchNextPage = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  useEffect(() => {
    if (isSuccess && data?.data?.length > 0) {
      setMediaUsers(data?.data);
      dispatch(setSocketMediaUsers(data?.data));
    } else {
      setMediaUsers([]);
      dispatch(setSocketMediaUsers([]));
    }
  }, [isSuccess, data, dispatch]);

  // Render sessions list if data is available
  const renderSessions = () => {
    if (isSuccess && mediaUsers?.length > 0) {
      return mediaUsers.map((session: any) => (
        <CustomerSession key={session?.UniqueID} session={session} />
      ));
    }
    return null;
  };

  return (
    <div
      id="scrollableDiv2"
      className="px-3 mr-[-4px] overflow-y-scroll !h-[90%] im-chat-scrollbar scroll-smooth"
    >
      {isLoading && <SkeletonLoader />}
      <InfiniteScroll
        dataLength={data?.data?.length || 20}
        next={fetchNextPage}
        hasMore={data?.total !== null && mediaUsers?.length < data?.total}
        loader={<SkeletonLoader />}
        scrollableTarget="scrollableDiv2"
      >
        {renderSessions()}
      </InfiniteScroll>
    </div>
  );
};
