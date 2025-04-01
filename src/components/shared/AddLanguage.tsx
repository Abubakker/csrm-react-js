import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlinePlusSm } from 'react-icons/hi';
import { Modal } from 'antd';
import { DeleteIcon } from 'components/im-chat-admin-components/assets/IMChatIcons';

interface AddLanguageProps {
  setContents: React.Dispatch<React.SetStateAction<any[]>>;
  contents: any;
  setSelectedButton: any;
  selectedButton: string;
  contentsItem: any;
}
const AddLanguage: React.FC<AddLanguageProps> = ({
  setContents,
  contents,
  setSelectedButton,
  selectedButton,
  contentsItem,
}) => {
  const { t } = useTranslation();
  const [addToggle, setAddToggle] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    t('en'),
  ]);
  //   const [selectedButton, setSelectedButton] = useState<any>('English');
  const [showDelete, setShowDelete] = useState(false);
  const [selectDelete, setSelectDelete] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  // languages
  const languages = [t('ja'), t('zh_CN'), t('zh_TW')];

  // reset selected languages
  useEffect(() => {
    if (contents?.length === 1) {
      setSelectedLanguages([t('en')]);
    }
  }, [contents]);

  // modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleToggle = () => {
    setAddToggle(!addToggle);
  };

  // add languages
  const addLanguage = (language: string) => {
    if (!selectedLanguages.includes(language)) {
      setSelectedLanguages([...selectedLanguages, language]);

      setContents((prev) => [
        ...prev,
        {
          ...contentsItem,
          lang: language,
        },
      ]);
    }
    setAddToggle(false);
  };

  // deleted languages
  const handleSelectDelete = (item: string) => {
    setSelectDelete(item);
    setShowDelete(true);
  };

  // handle delete dynamic button
  const handleDeleteButton = (item: string) => {
    // Remove the item from the state
    const updatedLanguages = selectedLanguages.filter((lang) => lang !== item);
    setSelectedLanguages(updatedLanguages);

    const remainContents = contents?.filter(
      (content: any) => content?.lang !== item
    );
    setContents(remainContents);
    setSelectedLanguages(updatedLanguages);
    handleCancel();
  };

  return (
    <div>
      <h1 className="text-[18px] font-bold tracking-[1px]">{t('language')}</h1>
      <div className="flex flex-wrap gap-5 items-center mb-8">
        {/* Language buttons */}
        {selectedLanguages.map((lang, index) => (
          <div
            className="relative"
            key={index}
            onMouseEnter={() => handleSelectDelete(lang)}
            onMouseLeave={() => setShowDelete(false)}
          >
            <div
              className={`-[42px] px-6 py-3 rounded-[10px] flex items-center gap-3 ${
                selectedButton === lang
                  ? 'bg-[#1677FF] hover:bg-[#086dfc] text-white'
                  : 'bg-transparent border text-black hover:bg-slate-100 '
              }  text-[12px] font-bold z-20`}
              onClick={() => setSelectedButton(lang)}
            >
              <span className="cursor-pointer">{lang}</span>
            </div>
            {/* Delete button */}
            {showDelete &&
              selectedButton !== lang &&
              selectDelete === lang &&
              selectDelete !== t('en') && (
                <>
                  <span
                    className="flex items-center px-3 rounded-[9px] shadow-2xl cursor-pointer absolute bg-[#ffffff] h-full top-0 right-0 z-50"
                    onClick={() => showModal()}
                  >
                    <DeleteIcon />
                  </span>
                  {/* modal */}
                  <Modal
                    open={isModalOpen}
                    closable={false}
                    footer={null}
                    className="rounded-xl bg-[#F5F6FC] overflow-hidden p-0"
                  >
                    <div className="h-full w-full m-0">
                      {/* content */}
                      <div className="max-w-[80%] mt-5">
                        <h1 className="text-[18px] font-bold">
                          {t('push_DCo')}{' '}
                        </h1>
                        <p className="text-[14px] pr-2">{t('push_Danr')}</p>
                      </div>
                      <div className="flex justify-end gap-4 mt-6">
                        <button
                          className="bg-transparent border text-black rounded-md px-6 py-3 text-[13px] tracking-widest font-semibold"
                          onClick={() => handleCancel()}
                        >
                          {t('cancel')}
                        </button>
                        <button
                          className="bg-[#CC4429] text-white rounded-md px-6 py-3 text-[13px] tracking-widest font-semibold"
                          onClick={() => handleDeleteButton(lang)}
                        >
                          {t('delete')}
                        </button>
                      </div>
                    </div>
                  </Modal>
                </>
              )}
          </div>
        ))}
        {/* Add new language button */}
        {selectedLanguages.length < languages?.length + 1 ? (
          <div className="relative">
            <button
              className="text-blue-600 text-[12px] font-bold bg-transparent  tracking-[1px] flex items-center gap-[6px]"
              onClick={handleToggle}
            >
              <span className="text-[16px] ">
                <HiOutlinePlusSm />
              </span>
              <span className="-mt-[1px]">{t('push_Another')}</span>
            </button>
            {/* buttons */}
            {addToggle && (
              <div className="absolute p-3 shadow-lg w-auto top-6 left-8 min-w-[170px] space-y-2 text-[14px] bg-white border border-gray-200 rounded-[10px]">
                {languages
                  .filter((language) => !selectedLanguages.includes(language))
                  ?.map((language) => (
                    <button
                      key={language}
                      className="bg-transparent hover:bg-slate-50 w-full text-left"
                      onClick={() => addLanguage(language)}
                    >
                      {language}
                    </button>
                  ))}
              </div>
            )}
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default AddLanguage;
