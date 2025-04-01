import { useTranslation } from 'react-i18next';
import editIcon from '../../../assets/icons/editIcon.svg';
import { useEffect, useState } from 'react';
import { Modal, notification } from 'antd';

import EditLanguagePart from 'components/shared/Edit/EditLanguagePart';
import { useUpdateOfflineResponseMessageMutation } from 'store/im-chat-stores/imManagerChatApi';
import EditForm from './EditForm';
import FooterAction from './FooterAction';

// Default content structure
const contentItem = {
  buttonContent: '',
  replyMessage: '',
};

const EditResponse = ({ response }: any) => {
  const { t } = useTranslation();

  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string>(`${t('en')}`);
  const [contents, setContents] = useState([
    {
      language: '',
      ...contentItem,
    },
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [buttonText, setButtonText] = useState('');
  const [responseText, setResponseText] = useState('');

  // Mutation for updating responses
  const [updateResponse, { isSuccess }] =
    useUpdateOfflineResponseMessageMutation();
  const [titleError, setTitleError] = useState(false);
  const [responseError, setResponseError] = useState(false);

  // Modal handlers
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  // Set content in the `contents` section
  useEffect(() => {
    const responseContent = response?.imChannelOfflineResponseContents
      ?.map(
        (item: {
          language: string;
          buttonContent: string;
          replyMessage: string;
          id: string;
        }) => ({
          language: t(`${item?.language}`),
          buttonContent: item?.buttonContent,
          replyMessage: item?.replyMessage,
          id: item?.id,
        })
      )
      ?.reverse();

    const languages = responseContent?.map(
      (item: { language: string }) => item?.language
    );
    setContents(responseContent);
    setSelectedLanguages(languages);
  }, [response, isSuccess]);

  // Update input fields when selected button changes
  useEffect(() => {
    const activeContent = contents.find(
      (content) => content.language === selectedButton
    );

    if (activeContent) {
      setButtonText(activeContent.buttonContent || '');
      setResponseText(activeContent.replyMessage || '');
    }
  }, [selectedButton, contents]);

  // Update contents when inputs change
  const updateContent = (
    key: 'buttonContent' | 'replyMessage',
    value: string
  ) => {
    setContents((prevContents) => {
      const updatedContents = prevContents.map((content) =>
        content.language === selectedButton
          ? { ...content, [key]: value }
          : content
      );
      // Check for errors
      setTitleError(updatedContents.some((item) => !item.buttonContent.trim()));
      setResponseError(
        updatedContents.some((item) => !item.replyMessage.trim())
      );
      return updatedContents;
    });
  };

  // Language options
  const languages = [
    { label: t('en'), value: 'EN' },
    { label: t('ja'), value: 'JA' },
    { label: t('zh_CN'), value: 'zh_CN' },
    { label: t('zh_TW'), value: 'zh_TW' },
  ];

  // Handle update action
  const handleUpdate = async () => {
    const invalidContent = contents.find(
      (content) => !content.buttonContent.trim() || !content.replyMessage.trim()
    );

    if (invalidContent) {
      notification.error({
        message: '',
        description: t('please_fill_all_fields'),
        placement: 'bottomRight',
      });
      return;
    }

    const data = {
      offlineResponseContents: contents?.map((content: any) => ({
        id: content?.id,
        buttonContent: content?.buttonContent,
        replyMessage: content?.replyMessage,
        language: languages?.find(
          (language) => language?.label === content?.language
        )?.value,
      })),
    };

    const res = (await updateResponse({
      offlineResponseId: response?.id,
      data,
    })) as any;

    if (res?.data) {
      notification.success({
        message: '',
        description: t('offline_update_msg'),
        placement: 'bottomRight',
      });
      handleCancel();
    }
    if (res?.error) {
      notification.error({
        message: '',
        description: t('something_went_wrong'),
        placement: 'bottomRight',
      });
      handleCancel();
    }
  };

  return (
    <div>
      {/* Trigger for modal */}
      <div className="flex items-center gap-[6px]" onClick={showModal}>
        <img src={editIcon} alt="" className="size-4" />
        <span className="text-[12px] font-sans font-medium tracking-[1px] mt-1">
          {t('edit')}
        </span>
      </div>

      {/* Modal for editing response */}
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        className="customModal min-w-[750px]"
      >
        {/* Language selection */}
        <div className="mt-5 flex gap-2 flex-wrap">
          <EditLanguagePart
            setContents={setContents}
            contents={contents}
            setSelectedButton={setSelectedButton}
            selectedButton={selectedButton}
            contentsItem={contentItem}
            selectedLanguages={selectedLanguages}
            setSelectedLanguages={setSelectedLanguages}
          />
        </div>

        {/* edit form */}
        <EditForm
          buttonText={buttonText}
          responseText={responseText}
          onButtonTextChange={(value) => {
            setButtonText(value);
            updateContent('buttonContent', value);
          }}
          onResponseTextChange={(value) => {
            setResponseText(value);
            updateContent('replyMessage', value);
          }}
          titleError={titleError}
          responseError={responseError}
        />

        {/* Footer buttons */}
        <FooterAction onCancel={handleCancel} onConfirm={handleUpdate} />
      </Modal>
    </div>
  );
};

export default EditResponse;
