import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import ContentNotification from '../notification-content/ContentNotification';
import { useTranslation } from 'react-i18next';

interface ContentSectionProps {
  openContentTab: number | null;
  setOpenContentTab: (tab: number | null) => void;
  contents: any[];
  setContents: (contents: any) => void;
  selectedButton: any;
  discard: boolean;
  setDiscard: (discard: boolean) => void;
}

const ContentSection = ({
  openContentTab,
  setOpenContentTab,
  contents,
  setContents,
  selectedButton,
  discard,
  setDiscard,
}: ContentSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className=" mb-6">
      <div
        className={`bg-[#F5F6FC] rounded-lg p-5 
            ${openContentTab === 1 && 'border border-[#1677FF]'}
           }`}
      >
        <div
          className={`w-full  p-2 rounded text-sm font-normal flex items-start justify-between cursor-pointer`}
          onClick={() =>
            openContentTab === 1
              ? setOpenContentTab(null)
              : setOpenContentTab(1)
          }
        >
          <span>
            <h1 className="text-[18px] font-bold">{t('content')}</h1>
            <p className="text-[14px] font-normal text-[#676B80] -mt-1">
              {t('push_CNM')}
            </p>
          </span>
          {openContentTab === 1 ? (
            <span className="text-[20px] font-bold">
              <IoIosArrowUp />
            </span>
          ) : (
            <span className="text-[20px] font-bold">
              <IoIosArrowDown />
            </span>
          )}
        </div>
        {/* show content  */}

        {openContentTab === 1 && (
          <ContentNotification
            contents={contents}
            setContents={setContents}
            activeLanguage={selectedButton}
            discard={discard}
            setDiscard={setDiscard}
          />
        )}
      </div>
    </div>
  );
};

export default ContentSection;
