import React, { useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosClose } from 'react-icons/io';
import { FaArrowLeftLong } from 'react-icons/fa6';
import locationTik from '../../assets/images/location-tick.png';
import { Input } from 'antd';
import { useTranslation } from 'react-i18next';

const TriggerEventComponent = ({
  currentEvents,
  setEvent,
  eventType,
  discard,
  setDiscard,
  event,
}: any) => {
  const { t } = useTranslation();
  const [selectedEvent, setSelectedEvent] = useState(t('vPage'));
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null
  );
  const [showEvent, SetShowEvent] = useState(false);
  const [showFiltering, SetShowfiltering] = useState(false);
  const [filterId, setFilterId] = useState<string | null>(null);
  const [filterResult, setFilterResult] = useState<any>(null);
  const [triggerTypesName, setTriggerTypesName] = useState<string | null>(null);
  const [triggerType, setTriggerType] = useState<string | null>(null);

  const conditionsItem = [
    { name: t('product_page'), original: 'product_page' },
    { name: t('cart'), original: 'cart' },
    { name: t('product_list'), original: 'product_list' },
    { name: t('editorPick'), original: 'editorPick' },
    { name: t('Mypage'), original: 'Mypage' },
    { name: t('oMess'), original: 'OpenMessage' },
  ];

  const eventsItem = [{ name: t('vPage'), label: 'Visit page' }];

  // initial trigger
  useEffect(() => {
    if (event && event?.event_type) {
      const foundItem = eventsItem.find(
        (item) => item.label === event.event_type
      );
      setSelectedEvent(foundItem?.name as string);
      setFilterResult({
        triggertypesName: event?.event_condition?.triggertypesName || null,
        triggerType: event?.event_condition?.triggerType || null,
        value: event?.event_condition?.value || null,
        typeName: conditionsItem?.find(
          (item) => item?.original === event?.event_condition?.typeName
        )?.name,
      });
    }
  }, []);

  useEffect(() => {
    if (event?.event_type) {
      // 1. Set the event type (e.g., "Visit Page")
      const foundEventItem = eventsItem.find(
        (item) => item.label === event.event_type
      );
      setSelectedEvent(foundEventItem?.name || t('vPage'));

      // 2. Extract condition data based on event structure
      let typeName, triggertypesName, triggerType, value;

      if (event.product_page) {
        // Product Page
        typeName = t('product_page');
        triggertypesName = 'Product ID';
        value = event.product_page.productId;
      } else if (event.editor_pick) {
        // Editor Pick
        typeName = t('editorPick');
        triggertypesName = 'Pick ID';
        triggerType = event.editor_pick.title;
        value = event.editor_pick.id;
      } else if (event.cart) {
        // Cart
        typeName = t('cart');
      } else if (event.product_list) {
        // Product List
        typeName = t('product_list');
        triggertypesName = 'Category Id';
        triggerType = event.product_list.first_level_category;
        value = event.product_list.product_list;
      } else if (event.mypage) {
        // Mypage
        typeName = t('Mypage');
      } else if (event.chat) {
        // Open Message (stored under `chat` key)
        typeName = t('oMess');
      }

      // 3. Update UI state
      setFilterResult({
        typeName,
        triggertypesName,
        triggerType,
        value,
      });
    }
  }, [event, t]);

  // reset if discard clicked present
  useEffect(() => {
    if (discard) {
      setFilterResult(null);
      setSelectedEvent(t('vPage'));
      setDiscard(false);
    }
  }, [discard]);

  // loaded current event if exists
  useEffect(() => {
    if (currentEvents) {
      setFilterResult(currentEvents?.eventCondition);
      setSelectedEvent(currentEvents?.eventType);
    }
  }, [setFilterResult, setSelectedEvent]);

  // handle save
  const handleSaveFiltering = (name: string) => {
    const newFilter = {
      // typeName: name || '',
      typeName:
        conditionsItem?.find((item) => item?.name === name)?.original || '',
      triggertypesName: triggerTypesName || null,
      triggerType: triggerType || null,
      value: filterId,
    };

    const triggerEvent: any = {
      event_type:
        eventsItem.find((item) => item.name === selectedEvent)?.label ||
        'visit_page',
    };

    switch (newFilter.typeName) {
      case 'product_page':
        triggerEvent.product_page = {
          productId: newFilter.value,
        };
        break;

      case 'editorPick':
        triggerEvent.editor_pick = {
          title: newFilter.triggerType,
          id: newFilter.value,
        };
        break;

      case 'cart':
        triggerEvent.cart = {
          showBackButton: true,
        };
        break;

      case 'product_list':
        triggerEvent.product_list = {
          product_list: newFilter.value,
          first_level_category: newFilter.triggerType,
        };
        break;

      case 'OpenMessage':
        triggerEvent.chat = {};
        break;

      case 'Mypage':
        triggerEvent.mypage = {
          showBackButton: true,
        };
        break;

      default:
        break;
    }

    // Update UI state with necessary properties
    const uiFilterResult = {
      typeName: conditionsItem.find(
        (item) => item.original === newFilter.typeName
      )?.name,
      triggertypesName: newFilter.triggertypesName,
      triggerType: newFilter.triggerType,
      value: newFilter.value,
    };

    setFilterResult(uiFilterResult); // Update UI state
    setEvent(triggerEvent); // Pass backend-compatible data to parent

    if (triggerEvent) {
      setSelectedCondition(null);
      SetShowfiltering(false);
    }
  };

  const removedItem = (itemToRemove: string | null) => {
    setFilterResult(filterResult?.typeName !== itemToRemove);
    setSelectedCondition(null);
    setTriggerType(null);
    setTriggerTypesName(null);
    setFilterId(null);
  };

  return (
    <div className="m-2 space-y-4 border-t border-[#d3d5df] -mt-3">
      <div className="flex flex-wrap items-center gap-3 pt-10">
        {/* Event Dropdown */}
        <div className="relative">
          <p
            className="text-[12px] font-bold cursor-pointer tracking-[1px] flex items-center gap-[6px] border border-[#1A1A1A] px-3 py-2 rounded-md text-black h-[34px] min-w-[114px]"
            onClick={() => {
              SetShowEvent(!showEvent);
              SetShowfiltering(false);
            }}
          >
            <img src={locationTik} alt="" className="size-4" />
            {selectedEvent}
          </p>
          {showEvent && (
            <div className="rounded-xl shadow-lg p-4 absolute bg-white min-w-[300px] -mt-2 space-y-[1px] z-10">
              {eventsItem.map((item) => (
                <li
                  key={item.name}
                  className={`px-2 py-[2px] hover:bg-gray-100 cursor-pointer rounded 
                text-sm list-none ${
                  selectedEvent === item.name
                    ? 'text-blue-600 bg-slate-100'
                    : 'text-[#3F4252]'
                }`}
                  onClick={() => {
                    setSelectedEvent(item.name);
                    SetShowEvent(false);
                  }}
                >
                  {item.name}
                </li>
              ))}
            </div>
          )}
        </div>

        <p className="text-sm font-normal text-black">{t('cwhn')}</p>

        {/* Show Filter Result */}
        <div className="flex items-center flex-wrap -mt-[13px] gap-2 ">
          {filterResult && filterResult?.typeName && (
            <div className="flex items-center gap-3">
              <div className=" bg-white px-[6px] rounded-lg text-sm tracking-wider flex items-center">
                <span className="flex items-center gap-1">
                  <span className="font-bold">{t(filterResult?.typeName)}</span>
                  {filterResult?.value && <span>{t('contains')}</span>}
                  {filterResult?.triggerType && (
                    <span className="">{filterResult?.triggerType}</span>
                  )}
                  {filterResult?.triggertypesName && (
                    <span className="font-medium">
                      {filterResult?.triggertypesName}
                    </span>
                  )}
                  <span>{filterResult?.value}</span>
                </span>
                <span
                  className="text-red-500 mt-2 text-xl cursor-pointer ml-2"
                  onClick={() => removedItem(filterResult?.typeName)}
                >
                  <IoIosClose />
                </span>
              </div>
              <span className="text-[14px]">
                {t('triggersthis')} {eventType ? eventType : ''}.{' '}
              </span>
            </div>
          )}
        </div>

        {/* Condition Dropdown */}
        <div className="relative -ml-3">
          {!filterResult?.typeName && (
            <p
              className="text-[12px] font-bold cursor-pointer tracking-[1px] flex items-center justify-between  border border-[#1A1A1A] px-3 py-2 rounded-md text-black h-[34px] min-w-[142px]"
              onClick={() => {
                SetShowfiltering(!showFiltering);
                SetShowEvent(false);
              }}
            >
              {selectedCondition || t('anyCondition')}
              <span className="text-[14px] font-semibold mt-1">
                <IoIosArrowDown />
              </span>
            </p>
          )}
          {showFiltering && (
            <div className="rounded-xl shadow-lg p-2 absolute bg-white min-w-[300px] z-20 left-6 -mt-1 space-y-2">
              {conditionsItem.map((item) => (
                <li
                  key={item.name}
                  className="px-2 py-[2px] hover:bg-gray-100 cursor-pointer rounded text-sm list-none"
                  onClick={() => {
                    if (
                      item.name === t('cart') ||
                      item.name === t('Mypage') ||
                      item.name === t('oMess')
                    ) {
                      SetShowfiltering(false);
                      setSelectedCondition(item.name);
                      handleSaveFiltering(item?.name);
                    }
                    setSelectedCondition(item.name);
                  }}
                >
                  {item.name}
                </li>
              ))}
            </div>
          )}
          {/* Nested Filtering product page*/}
          {selectedCondition === t('product_page') && (
            <div className="rounded-[10px] shadow-lg p-4 absolute bg-white min-w-[300px] z-20 left-6">
              <div className="relative">
                <div className="absolute left-0 top-0">
                  <span
                    className="cursor-pointer bg-black text-white px-[3px] rounded text-[10px] "
                    onClick={() => setSelectedCondition(null)}
                  >
                    <FaArrowLeftLong />
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 pb-2 mb-3">
                  <p className="text-sm font-semibold">{selectedCondition}</p>
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor=""
                  className="uppercase text-[10px] font-medium tracking-[1px]"
                >
                  {t('purchase_product_id')}
                </label>
                <Input
                  type="text"
                  placeholder={`${t('search')}`}
                  onChange={(e) => {
                    setFilterId(e.target.value);
                    setTriggerTypesName('Product ID');
                  }}
                  className="h-[34px] font-medium w-full border border-[#D9D9D9] tracking-[1px] px-3 py-2 text-[12px] rounded-[10px] mt-1"
                />
              </div>

              <button
                className={`w-full mt-4 ${
                  filterId
                    ? 'bg-[#1677FF] text-white hover:bg-[#1677FF] cursor-pointer'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-not-allowed'
                } px-4 py-3 rounded-[10px] text-[12px] font-bold tracking-[1px] h-[42px]`}
                onClick={() => handleSaveFiltering(selectedCondition)}
              >
                {t('save')}
              </button>
            </div>
          )}
          {/* for Product list */}
          {selectedCondition === t('product_list') && (
            <div className="rounded-[10px] shadow-lg p-4 absolute bg-white min-w-[300px] z-20 left-6">
              <div className="relative">
                <div className="absolute left-0 top-0">
                  <span
                    className="cursor-pointer bg-black text-white px-[3px] rounded text-[10px] "
                    onClick={() => setSelectedCondition(null)}
                  >
                    <FaArrowLeftLong />
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 pb-2 mb-3">
                  <p className="text-sm font-semibold">{selectedCondition}</p>
                </div>
              </div>

              <div className="mb-2">
                <label
                  htmlFor=""
                  className="uppercase text-[10px] font-medium tracking-[1px]"
                >
                  {t('list_type')}
                </label>
                <Input
                  type="text"
                  placeholder={`${t('list_type')}`}
                  // value={filterId}
                  onChange={(e) => setTriggerType(e.target.value)}
                  className="h-[34px] font-medium w-full border border-[#D9D9D9] tracking-[1px] px-3 py-2 text-[12px] rounded-[10px] mt-1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor=""
                  className="uppercase text-[10px] font-medium tracking-[1px]"
                >
                  {t('category_id')}
                </label>
                <Input
                  type="text"
                  placeholder={`${t('category_id')}`}
                  onChange={(e) => {
                    setFilterId(e.target.value);
                    setTriggerTypesName('Category Id');
                  }}
                  className="h-[34px] font-medium w-full border border-[#D9D9D9] tracking-[1px] px-3 py-2 text-[12px] rounded-[10px] mt-1"
                />
              </div>

              <button
                className={`w-full mt-4 ${
                  filterId
                    ? 'bg-[#1677FF] text-white hover:bg-[#1677FF] cursor-pointer'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-not-allowed'
                } px-4 py-3 rounded-[10px] text-[12px] font-bold tracking-[1px] h-[42px]`}
                onClick={() => handleSaveFiltering(selectedCondition)}
              >
                {t('save')}
              </button>
            </div>
          )}
          {/* for editor pick */}
          {selectedCondition === t('editorPick') && (
            <div className="rounded-[10px] shadow-lg p-4 absolute bg-white min-w-[300px] z-20 left-6 ">
              <div className="relative">
                <div className="absolute left-0 top-0">
                  <span
                    className="cursor-pointer bg-black text-white px-[3px] rounded text-[10px] "
                    onClick={() => setSelectedCondition(null)}
                  >
                    <FaArrowLeftLong />
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 pb-2 mb-3">
                  <p className="text-sm font-semibold">{selectedCondition}</p>
                </div>
              </div>

              <div className="mb-2">
                <label
                  htmlFor=""
                  className="uppercase text-[10px] font-medium tracking-[1px]"
                >
                  {t('title')}
                </label>
                <Input
                  type="text"
                  placeholder={`${t('title')}`}
                  onChange={(e) => setTriggerType(e.target.value)}
                  className="h-[34px] font-medium w-full border border-[#D9D9D9] tracking-[1px] px-3 py-2 text-[12px] rounded-[10px] mt-1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor=""
                  className="uppercase text-[10px] font-medium tracking-[1px]"
                >
                  {t('pick_id')}
                </label>
                <Input
                  type="text"
                  placeholder={`${t('pick_id')}`}
                  onChange={(e) => {
                    setFilterId(e.target.value);
                    setTriggerTypesName('Pick ID');
                  }}
                  className="h-[34px] font-medium w-full border border-[#D9D9D9] tracking-[1px] px-3 py-2 text-[12px] rounded-[10px] mt-1"
                />
              </div>

              <button
                className={`w-full mt-4 ${
                  filterId
                    ? 'bg-[#1677FF] text-white hover:bg-[#1677FF] cursor-pointer'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-not-allowed'
                } px-4 py-3 rounded-[10px] text-[12px] font-bold tracking-[1px] h-[42px]`}
                onClick={() => handleSaveFiltering(selectedCondition)}
              >
                {t('save')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TriggerEventComponent;
