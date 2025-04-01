import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notification } from 'antd';
import AddLanguage from 'components/shared/AddLanguage';
import CreateOffLineResponseContent from './CreateOffLineResponseContent';
import { useCreateOfflineResponseMessageMutation } from 'store/im-chat-stores/imManagerChatApi';
import '../style.css';
import CreateResponseFooterActions from './CreateResponseFooterActions';
import DiscardModal from './DiscardModal';
import { useSelector } from 'react-redux';

// response content
const contentItem = {
  buttonText: '',
  responseText: '',
};

const CreateOffLineResponse = ({
  setIsCreated,
}: {
  setIsCreated: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string>(`${t('en')}`);
  const [discard, setDiscard] = useState<boolean>(false);
  const pluginKey = useSelector(
    (state: any) => state.imManagerSettings.pluginKey
  );

  const [contents, setContents] = useState([
    {
      lang: t('en'),
      ...contentItem,
    },
  ]);
  const [errors, setErrors] = useState<{
    buttonText: string;
    responseText: string;
  }>({
    buttonText: '',
    responseText: '',
  });
  // create new response
  const [createNewResponse] = useCreateOfflineResponseMessageMutation();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Create new response
  const handleCreateOfflineRes = async (status: number) => {
    const activeContent = contents.find(
      (content) => content.lang === selectedButton
    );

    if (!activeContent?.buttonText || !activeContent?.responseText) {
      setErrors({
        buttonText: !activeContent?.buttonText ? 'Button text is required' : '',
        responseText: !activeContent?.responseText
          ? 'Response text is required'
          : '',
      });
    }
    const invalidContent = contents.find(
      (content) => !content.buttonText.trim() || !content.responseText.trim()
    );

    if (invalidContent) {
      notification.error({
        message: '',
        description: t('please_fill_all_fields'),
        placement: 'bottomRight',
      });
      return;
    }

    // request payload data
    const data = {
      publishStatus: status,
      offlineResponseContents: contents?.map(
        (item: { lang: string; responseText: string; buttonText: string }) => {
          let language = '';
          switch (item?.lang) {
            case t('en'):
              language = 'EN';
              break;
            case t('ja'):
              language = 'JA';
              break;
            case t('zh_CN'):
              language = 'zh_CN';
              break;
            case t('zh_TW'):
              language = 'zh_TW';
              break;
            default:
              break;
          }

          return {
            buttonContent: item?.buttonText,
            replyMessage: item?.responseText,
            language: language,
          };
        }
      ),
    };

    const res: any = await createNewResponse({
      data,
      pluginKey,
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

  // handle discard
  const handleDiscard = () => {
    setContents([
      {
        lang: t('en'),
        ...contentItem,
      },
    ]);
    setSelectedButton(`${t('en')}`);
    handleCancel();
    setDiscard(true);
  };

  return (
    <div className="min-h-screen maz-w-[1920px] mx-auto">
      <h1 className="text-[24px] font-bold leading-6">{t('off_cra')}</h1>
      <p className="text-[14px] font-normal text-[#676B80] mb-8 -mt-1">
        {t('off_sor')}
      </p>
      <section className="max-w-[1020px] mx-auto">
        {/* Language Section */}
        <AddLanguage
          setContents={setContents}
          contents={contents}
          setSelectedButton={setSelectedButton}
          selectedButton={selectedButton}
          contentsItem={contentItem}
        />
        <div className="h-[1px] bg-slate-300 mt-7 mb-8"></div>
        {/* create response content */}
        <CreateOffLineResponseContent
          setOfflineResponse={setContents}
          offlineResponse={contents}
          language={selectedButton}
          errors={errors}
          setErrors={setErrors}
          discard={discard}
          setDiscard={setDiscard}
        />
        {/* footer Action Buttons */}
        <div>
          <CreateResponseFooterActions
            onDiscard={() => setIsModalOpen(true)}
            onSaveDraft={() => handleCreateOfflineRes(1)}
            onCreateAndPublish={() => handleCreateOfflineRes(3)}
          />

          {/* modal */}
          <DiscardModal
            isOpen={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onConfirm={handleDiscard}
          />
        </div>
      </section>
    </div>
  );
};

export default CreateOffLineResponse;
