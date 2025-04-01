import { useState } from 'react';
import { Table, Tooltip, notification } from 'antd';
import CreateOffLineResponse from './create-response/CreateOffLineResponse';
import { useTranslation } from 'react-i18next';
import { FieldValues, useForm } from 'react-hook-form';
import './style.css';
import CreateResponseButton from 'components/shared/CreateResponseButton';
import {
  useCreateOfflineResponseMessageMutation,
  useSearchOfflineResponseMessagesQuery,
  useUpdateOfflineResponseMessageMutation,
} from 'store/im-chat-stores/imManagerChatApi';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import dayjs, { Dayjs } from 'dayjs';
import { languages } from 'constants/general-constants';
import SearchForm from './search-form/SearchForm';
import DropdownActions from './Action/DropdownActions';
import { useSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/query';

interface SearchQuery {
  pluginKey: string;
  language: string;
  keyword: string;
  createdAt: string;
  status: string;
}

interface OfflineResponseContent {
  buttonContent: string;
  replyMessage: string;
  language: string;
}

interface ResponseData {
  publishStatus: number;
  imChannelOfflineResponseContents: OfflineResponseContent[];
}

const ResponseTable = () => {
  const { t } = useTranslation();
  const [isCreated, setIsCreated] = useState<boolean>(false);

  const pluginKey = useSelector(
    (state: any) => state.imManagerSettings.pluginKey
  );

  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    pluginKey: pluginKey,
    language: '',
    keyword: '',
    createdAt: '',
    status: '',
  });

  // get offline response data
  const { data: offlineMessagesData, isFetching } =
    useSearchOfflineResponseMessagesQuery(searchQuery);

  // update mutation
  const [updateResponse] = useUpdateOfflineResponseMessageMutation();
  // create mutation
  const [duplicateResponse] = useCreateOfflineResponseMessageMutation();
  // update status
  const handleUpdateStatus = async ({
    id,
    status,
  }: {
    id: number;
    status: number;
  }) => {
    const data = {
      publishStatus: status === 1 || status === 2 ? 3 : 2,
    };
    const res = await updateResponse({ offlineResponseId: id, data });
    if (res) {
      notification.success({
        message: '',
        description: t('status_update_msg'),
        placement: 'bottomRight',
      });
    }
  };
  // react hook form
  const { handleSubmit, control, reset } = useForm();

  // create duplicate value
  const createDuplicated = async (responseData: ResponseData) => {
    const data = {
      publishStatus: responseData?.publishStatus,
      offlineResponseContents: responseData?.imChannelOfflineResponseContents
        ?.map((content: OfflineResponseContent) => {
          return {
            buttonContent: `${content?.buttonContent} - Cloned`,
            replyMessage: content?.replyMessage,
            language: languages?.find(
              (item) => item?.value === content?.language
            )?.label,
          };
        })
        .reverse(),
    };
    const res: any = await duplicateResponse({
      data,
      pluginKey: pluginKey,
    });

    if (res?.data) {
      setIsCreated(false);
      notification.success({
        message: '',
        description: t('new_response_msg'),
        placement: 'bottomRight',
      });
    } else {
      notification.error({
        message: '',
        description: t('something_went_wrong'),
        placement: 'bottomRight',
      });
    }
  };

  // find creation time
  TimeAgo.addDefaultLocale(en);
  const timeAgo = new TimeAgo('en-US');

  const columns = [
    {
      title: t('push_title'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <span
          className="bg-[#DADDEB] font-bold text-[12px]
        rounded-[10px] px-2 py-[2px]  text-[#3F4252] tracking-[1px]"
        >
          {(status === 1 && 'Draft') ||
            (status === 2 && 'Unpublished') ||
            (status === 3 && 'Published ')}
        </span>
      ),
    },
    {
      title: t('language'),
      dataIndex: 'language',
      key: 'language',
    },
    {
      title: t('creation_time'),
      dataIndex: 'creationTime',
      key: 'creationTime',
    },
    {
      title: t('created_by'),
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: t('action'),
      key: 'action',
      render: (item: any) => {
        return (
          <DropdownActions
            item={item}
            onDuplicate={createDuplicated}
            onStatusChange={handleUpdateStatus}
          />
        );
      },
    },
  ];

  // get language
  const getLanguageName = (language: string) => {
    return languages.find((lang) => lang.value === language)?.fullForm || '';
  };

  // table data
  const data = offlineMessagesData?.map((messages: any, idx: number) => {
    const createdAt = new Date(messages?.createdAt);
    // Use TimeAgo to format the creationTime
    const creationTime = timeAgo.format(createdAt);
    return {
      key: idx,
      title:
        messages?.imChannelOfflineResponseContents[
          messages?.imChannelOfflineResponseContents?.length - 1
        ]?.buttonContent,
      status: messages?.publishStatus,
      language: (
        <Tooltip
          title={
            messages?.imChannelOfflineResponseContents?.length > 1 &&
            messages?.imChannelOfflineResponseContents
              ?.slice(0, messages?.imChannelOfflineResponseContents.length - 1)
              ?.map((item: OfflineResponseContent) =>
                getLanguageName(item?.language)
              )
              .join(', ')
          }
        >
          <span className="cursor-pointer">
            {getLanguageName(
              messages?.imChannelOfflineResponseContents?.[
                messages.imChannelOfflineResponseContents.length - 1
              ]?.language
            )}{' '}
            {messages?.imChannelOfflineResponseContents?.length > 1 &&
              `${messages?.imChannelOfflineResponseContents?.length - 1}+`}
          </span>
        </Tooltip>
      ),
      creationTime,
      createdBy: messages?.createdById?.username,
      id: messages?.id,
      responseData: messages,
    };
  });

  // handle submit search form
  const onSubmit = (data: FieldValues) => {
    const query = {
      language: data?.language || '',
      keyword: data?.keyword || '',
      createdAt: data?.date ? dayjs(data.date).format('YYYY-MM-DD') : '',
      status: data?.status || '',
    };

    setSearchQuery((prev) => ({ ...prev, ...query }));
  };
  // handle reset search
  const handleReset = () => {
    reset();
    setSearchQuery({
      pluginKey: pluginKey,
      language: '',
      keyword: '',
      createdAt: '',
      status: '',
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto px-1 pt-2">
      {isCreated ? (
        <CreateOffLineResponse setIsCreated={setIsCreated} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-5 ">
            <div>
              <h2 className="text-[24px] font-bold font-sans">
                {t('off_resMan')}
              </h2>
            </div>
            {/* create new response */}
            <CreateResponseButton
              setIsCreated={setIsCreated}
              buttonText={t('of_cnr')}
            />
          </div>

          {/* search form */}
          <SearchForm
            control={control}
            onSubmit={handleSubmit(onSubmit)}
            onReset={handleReset}
          />

          {/* table */}
          <div className="custom-table mt-6">
            <Table
              loading={isFetching}
              columns={columns}
              dataSource={data}
              components={{
                header: {
                  cell: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
                    <th
                      {...props}
                      style={{
                        backgroundColor: '#EBEDF7',
                        color: '#575A6E',
                        fontSize: '10px',
                        fontWeight: '500',
                        lineHeight: '16px',
                        letterSpacing: '0.5px',
                        padding: '12px 8px',
                        textTransform: 'uppercase',
                        fontFamily: 'sans-serif',
                      }}
                    />
                  ),
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ResponseTable;
