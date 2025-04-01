import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from 'antd';
import { useUploadAttachmentMutation } from 'store/im-chat-stores/imManagerChatApi';

import NotificationInput from './NotificationInput';
import ImageUpload from './ImageUpload';
import PreviewSection from './PreviewSection';
import '../style.css';

interface ContentNotificationProps {
  contents: Array<{
    lang: string;
    title: string;
    description: string;
    image: any;
    preImg: string | null;
    pushAlert: boolean;
  }>;
  setContents: Dispatch<
    SetStateAction<
      {
        title: string;
        description: string;
        image: null;
        preImg: null;
        pushAlert: boolean;
        lang: string;
      }[]
    >
  >;
  activeLanguage: string;
  discard: boolean;
  setDiscard: (discard: boolean) => void;
}

const ContentNotification: React.FC<ContentNotificationProps> = ({
  setContents,
  contents,
  activeLanguage,
  setDiscard,
  discard,
}) => {
  const { t } = useTranslation();

  const [titleText, setTitleText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [pushAlert, setPushAlert] = useState(true);
  const [deviceByView, SetDeviceByView] = useState('mobile');
  const [imageFile, setImageFile] = useState<any>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // file upload mutation
  const [uploadAttachment, { isLoading: fileUploadLoading }] =
    useUploadAttachmentMutation();

  // handle image file upload
  const handleNotificationFile = async (e: any) => {
    const file = e?.target?.files[0];
    const maxFileSize = 10 * 1024 * 1024;
    if (file?.size <= maxFileSize) {
      let response = await uploadAttachment({ file: file }).unwrap();
      setImageFile(response);
      setPreviewImageUrl(response.url);
    } else {
      setPreviewImageUrl(null);
    }
  };

  // delete uploaded image
  const handleDeleteImageFile = () => {
    setImageFile(null);
    setPreviewImageUrl(null);
  };

  // initialize state based on active language
  useEffect(() => {
    const activeContent = contents.find(
      (content: any) => content.lang === activeLanguage
    );

    setTitleText(activeContent?.title || '');
    setResponseText(activeContent?.description || '');
    setImageFile(activeContent?.image || null);
    setPushAlert(activeContent?.pushAlert || true);
    setPreviewImageUrl(activeContent?.preImg || null);

    setDiscard(false);
  }, [activeLanguage, discard]);

  // update contents when state changes
  useEffect(() => {
    const updateContents = contents.map((content: any) => {
      if (content?.lang === activeLanguage) {
        return {
          title: titleText,
          description: responseText,
          image: imageFile,
          lang: activeLanguage,
          preImg: previewImageUrl,
          pushAlert: pushAlert,
        };
      } else {
        return content;
      }
    });
    setContents(updateContents);
  }, [
    titleText,
    responseText,
    imageFile,
    pushAlert,
    activeLanguage,
    previewImageUrl,
  ]);

  return (
    <div className="overflow-hidden -mt-4 px-2">
      <div className="grid grid-cols-2 gap-8 bg-[#F7F8FC] border-t border-slate-300">
        {/* left Section: Inputs and Image Upload */}
        <div className="pr-[36px] mt-9">
          {/* Title */}
          <NotificationInput
            label={t('push_title')}
            value={titleText}
            onChange={setTitleText}
            placeholder={`${t('push_InT')}`}
          />

          {/* Description */}
          <NotificationInput
            label={t('description')}
            value={responseText}
            onChange={setResponseText}
            placeholder={`${t('push_ind')}...`}
            type="textarea"
          />

          <ImageUpload
            fileUploadLoading={fileUploadLoading}
            imageFile={imageFile}
            handleDeleteImageFile={handleDeleteImageFile}
            handleNotificationFile={handleNotificationFile}
          />

          {/* push Alert Toggle */}
          <div className="mt-[2px] flex items-center gap-2">
            <Switch
              checked={pushAlert}
              className="custom-switch"
              size="default"
              onChange={() => setPushAlert(!pushAlert)}
            />
            <p className="text-sm font-normal mt-[14px] tracking-wide">
              {t('PushAlertSound')}
            </p>
          </div>
        </div>

        {/* right Section: Preview */}
        {/* reusable Preview Section Component */}
        <PreviewSection
          deviceByView={deviceByView}
          SetDeviceByView={SetDeviceByView}
          title={titleText}
          description={responseText}
          previewImageUrl={previewImageUrl}
        />
      </div>
    </div>
  );
};
export default ContentNotification;
