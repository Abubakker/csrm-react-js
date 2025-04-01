import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TimeAgo from 'javascript-time-ago';
import { languages } from 'constants/general-constants';
import en from 'javascript-time-ago/locale/en';
import dayjs from 'dayjs';
import { Table, Tooltip, notification } from 'antd';

import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import {
  useCreatepushNotificationMutation,
  useGetpushNotificationQuery,
  useUpdatePushnotificationStatusMutation,
} from 'store/push-notification-stores/pushNotificationApi';

// Components
import CreatedNewNotification from '../CreatedNewNotification';
import SelectNotification from '../select-notification/SelectNotification';

import './manageNotification.css';
import NotificationStatusBadge from './NotificationStatusBadge';
import ActionDropdown from './Action/ActionDropdown';
import NotificationFilterForm from './notification-form/NotificationFilterForm';

// Types

// Enums
export enum NotificationStatus {
  Draft = 'Draft',
  Published = 'Published',
  Unpublished = 'Unpublished',
  Scheduled = 'Scheduled',
  Failed = 'Failed',
}

export enum MessageType {
  General = 'general',
  ProductPromotion = 'product_promotion',
  OrderStatus = 'order_status',
  Payment = 'payment',
}

interface SearchQuery {
  keyword: string | null;
  status: NotificationStatus | null;
  messageType: MessageType | null;
  language: string | null;
  creationDate: string | null;
  pushDate: string | null;
}

interface ManageNotificationProps {
  setIsSelectedType: Dispatch<SetStateAction<string | null>>;
  isSelectType: string | null;
}

const ManageNotification = ({
  isSelectType,
  setIsSelectedType,
}: ManageNotificationProps) => {
  const { t } = useTranslation();
  // set search query
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    keyword: null,
    status: null,
    messageType: null,
    language: null,
    creationDate: null,
    pushDate: null,
  });
  // react hook form
  const { control, handleSubmit, reset } = useForm();
  // crate clone notification
  const [createCloneNotfication, { isLoading: duplicatedLoading }] =
    useCreatepushNotificationMutation();
  // update status
  const [updateNotificationStatus, { isLoading: statusUpdateLoading }] =
    useUpdatePushnotificationStatusMutation();
  // for data get
  const { data: pushNotificationData, isLoading } =
    useGetpushNotificationQuery(searchQuery);

  // find creation time
  TimeAgo.addDefaultLocale(en);
  const timeAgo = new TimeAgo('en-US');

  // create dublicate
  const createDuplicated = async (responseData: any) => {
    const Ddata = {
      notificationType: responseData?.messageType,
      languageContent: responseData?.contents?.map((content: any) => ({
        language: content?.language,
        title: `${content?.title} : Cloned `,
        description: content?.description,
        imageUrl: content?.imageUrl,
        language_short: content?.language_short,
      })),
      isRepeat: responseData?.isRepeat,
      intervalPeriod: responseData?.intervalPeriod,
      startDate: responseData?.startDate,
      endDate: responseData?.endDate,
      query: {
        filters: responseData?.query,
      },
      tigger_event: { field: 'gender' },
    };

    const res: any = await createCloneNotfication({ data: Ddata });

    const placement = 'bottomRight';
    if (res?.data) {
      notification.info({
        message: '',
        description: 'Successfully Duplicate',
        placement,
      });
    } else {
      notification.info({
        message: '',
        description: res?.error?.data?.message,
        placement,
      });
    }
  };

  // change status
  const handleChangeStatus = async ({
    status,
    id,
    placement = 'bottomRight',
  }: {
    status: NotificationStatus;
    id: number;
    placement?: any;
  }) => {
    const newStatus =
      status === NotificationStatus.Draft ||
      status === NotificationStatus.Published ||
      status === NotificationStatus.Unpublished ||
      status === NotificationStatus.Failed
        ? 'Published'
        : 'Unpublished';
    const data = {
      id: id,
      status: newStatus,
    };

    const res: any = await updateNotificationStatus({ data: data });

    if (res?.data) {
      notification.info({
        message: '',
        description: 'Status updated',
        placement,
      });
    } else {
      notification.info({
        message: '',
        description: res?.error?.data?.message,
        placement,
      });
    }
  };

  // table columns
  const columns = [
    {
      title: t('title'),
      dataIndex: 'title',
      key: 'title',
      width: 180,
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: NotificationStatus) => (
        <NotificationStatusBadge status={status} />
      ),
      width: 140,
    },
    {
      title: t('sentTo'),
      dataIndex: 'sentTo',
      key: 'sentTo',
      width: 140,
    },
    {
      title: t('viewed'),
      dataIndex: 'viewed',
      key: 'viewed',
      width: 140,
    },
    {
      title: t('mesType'),
      dataIndex: 'messageType',
      key: 'messageType',
      width: 210,
    },
    {
      title: t('language'),
      dataIndex: 'language',
      key: 'language',
      width: 210,
    },
    {
      title: t('creation_time'),
      dataIndex: 'creationTime',
      key: 'creationTime',
      width: 210,
    },
    {
      title: t('created_by'),
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 120,
    },
    {
      title: t('pusTime'),
      dataIndex: 'pushTime',
      key: 'pushTime',
      width: 180,
    },
    {
      title: t('action'),
      key: 'action',
      render: (item: any) => (
        <ActionDropdown
          onDuplicate={() => {
            createDuplicated(item?.fullResponse);
          }}
          onChangeStatus={() => {
            handleChangeStatus({
              status: item?.status,
              id: item?.key,
            });
          }}
          notification={item}
        />
      ),
      width: 82,
    },
  ];

  // get language
  const getLanguageName = (language: string) => {
    return (
      languages.find((lang) => lang.shortform === language)?.fullForm || ''
    );
  };
  // table data
  const data = pushNotificationData?.map((notification: any, idx: number) => {
    const createdAt = new Date(notification?.creationTime);
    const creationTime = timeAgo.format(createdAt);
    // push date

    const pushAt = notification?.pushTime
      ? new Date(notification.pushTime)
      : null;
    const pushTime = pushAt ? timeAgo.format(pushAt) : 'N/A';
    const sortedContents: any[] = [...notification?.contents]?.sort((a, b) =>
      a.language_short === 'en' ? -1 : b.language_short === 'en' ? 1 : 0
    );
    return {
      key: notification?.id,
      // title: notification?.contents[0]?.title,
      title: sortedContents[0]?.title,
      status: notification?.status,
      sentTo: notification?.sentTo,
      viewed: notification?.viewed,
      messageType: notification?.messageType?.replace('_', ' '),
      pushTime: pushTime,
      language: (
        <Tooltip
          title={
            sortedContents?.length > 1 &&
            sortedContents
              ?.slice(1)
              ?.map((item: any) => getLanguageName(item?.language))
              .join(', ')
          }
        >
          <span className="cursor-pointer">
            {getLanguageName(sortedContents?.[0]?.language)}{' '}
            {sortedContents.length > 1 && `${sortedContents.length - 1}+`}
          </span>
        </Tooltip>
      ),
      creationTime: creationTime,
      createdBy: notification?.createdBy,
      fullResponse: notification,
    };
  });

  // handle search submit
  const onSearchSubmit: SubmitHandler<FieldValues> = async (data) => {
    setSearchQuery({
      status: data?.status || null,
      keyword: data?.keyword || null,
      messageType: data?.messageType || null,
      language: data?.language || null,
      creationDate: data.creationDate
        ? dayjs(data.creationDate).format('YYYY-MM-DD')
        : null,
      pushDate: data.pushDate
        ? dayjs(data.pushDate).format('YYYY-MM-DD')
        : null,
    });
  };

  // reset search form
  const handleReset = async () => {
    reset();
    setSearchQuery({
      keyword: null,
      status: null,
      messageType: null,
      language: null,
      creationDate: null,
      pushDate: null,
    });
  };

  return (
    <div className="max-w-[1612px] mx-auto p-2 ">
      {!isSelectType ? (
        <>
          <div className="flex justify-between items-center mb-6 ">
            <div>
              <h2 className="text-[24px] font-bold font-sans">
                {t('pusNotiMan')}
              </h2>
            </div>
            {/* create new response */}
            <div className="-mt-[5px]">
              <SelectNotification setIsSelectedType={setIsSelectedType} />
            </div>
          </div>

          {/* search form */}
          <div>
            <NotificationFilterForm
              control={control}
              onSubmit={handleSubmit(onSearchSubmit)}
              onReset={handleReset}
            />
          </div>

          {/* table */}
          <div className="custom-table mt-6">
            <Table
              columns={columns}
              dataSource={data}
              loading={isLoading || duplicatedLoading || statusUpdateLoading}
              components={{
                header: {
                  cell: (props: any) => (
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
      ) : (
        <CreatedNewNotification
          setIsSelectedType={setIsSelectedType}
          selectedType={isSelectType}
        />
      )}
    </div>
  );
};

export default ManageNotification;
