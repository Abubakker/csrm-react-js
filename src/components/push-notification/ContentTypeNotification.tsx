import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

// Components
import AudienceComponent from 'components/shared/Audience';
import TriggerEventComponent from 'components/shared/TriggerEvent';
import OperationComponent from 'components/shared/Operation';

interface ContentTypeProps {
  openContentTab: number | null;
  setOpenContentTab: Dispatch<SetStateAction<number | null>>;
  setPushNotification: (notification: any) => void;
  discard: boolean;
  setDiscard: (discard: boolean) => void;
}

const ContentType = ({
  openContentTab,
  setOpenContentTab,
  setPushNotification,
  discard,
  setDiscard,
}: ContentTypeProps) => {
  const [audience, setAudience] = useState([]);
  const [event, setEvent] = useState({});
  const [operations, setOperations] = useState({});

  useEffect(() => {
    setPushNotification((prev: any) => ({
      ...prev,
      filters: audience,
      events: event,
      operations: operations,
    }));
  }, [audience, event, operations]);

  const { t } = useTranslation();

  // console.log("operations-->>",operations);

  // Notification items
  const notificationItems = [
    {
      id: 2,
      name: t('push_Audience'),
      subTitle: t('push_DWP'),
      content: (
        <AudienceComponent
          audience={audience}
          audienceType={t('notification')}
          setAudience={setAudience}
          discard={discard}
          setDiscard={setDiscard}
        />
      ),
    },
    {
      id: 3,
      name: t('push_even'),
      subTitle: t('Push_CNt'),
      content: (
        <TriggerEventComponent
          setEvent={setEvent}
          event={event}
          eventType={t('notification')}
          discard={discard}
          setDiscard={setDiscard}
        />
      ),
    },
    {
      id: 4,
      name: t('push_Operation'),
      subTitle: t('Push_WSN'),
      content: (
        <OperationComponent
          setOperations={setOperations}
          operations={operations}
          operationType={t('notification')}
          discard={discard}
          setDiscard={setDiscard}
        />
      ),
    },
  ];

  const handleToggleItem = (itemId: number) => {
    // setDropDownToggle(!dropDownToggle);
    setOpenContentTab((prev: number | null) =>
      prev === itemId ? null : itemId
    );
  };
  return (
    <div>
      {/*  */}
      <section className="space-y-6 ">
        {notificationItems?.map((item) => (
          <div
            className={`bg-[#F5F6FC] rounded-[10px] p-5  ${
              openContentTab === item?.id && 'border border-[#1677FF]'
            }`}
            key={item?.name}
          >
            <div
              className="w-full  p-2 rounded text-sm font-normal flex items-start justify-between cursor-pointer"
              onClick={() => handleToggleItem(item?.id)}
            >
              <span>
                <h1 className="text-[18px] font-bold">{item?.name}</h1>
                <p className="text-[14px] font-normal text-[#676B80] -mt-1">
                  {item?.subTitle}
                </p>
              </span>
              {openContentTab === item?.id ? (
                <span className="text-[20px] font-bold">
                  <IoIosArrowUp />
                </span>
              ) : (
                <span className="text-[20px] font-bold">
                  <IoIosArrowDown />
                </span>
              )}
            </div>

            {/* Dropdown Content */}
            {openContentTab === item.id && (
              <div className="">{item.content}</div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default ContentType;
