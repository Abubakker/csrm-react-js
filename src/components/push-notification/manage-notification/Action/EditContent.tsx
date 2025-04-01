import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from 'antd';

import EditLanguagePart from 'components/shared/Edit/EditLanguagePart';
import { useUploadAttachmentMutation } from 'store/im-chat-stores/imManagerChatApi';
import PreviewSection from 'components/push-notification/notification-content/PreviewSection';
import ImageUpload from 'components/push-notification/notification-content/ImageUpload';
import NotificationInput from 'components/push-notification/notification-content/NotificationInput';
import CollapsibleSection from './CollapsibleSection';
import defultImg from "../../../../assets/images/defultImg.png";

// Default content structure
const contentItem = {
  title: '',
  description: '',
  pushAlert: true,
  preImgUrl: null,
};

const EditContent = ({
  pushContents,
  openContentTab,
  setOpenContentTab,
  setPushContents,
  contentType,
}: any) => {
  const { t } = useTranslation();

  const [selectedButton, setSelectedButton] = useState<any>(t('en'));
  const [contents, setContents] = useState([
    {
      language: '',
      ...contentItem,
    },
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pushAlert, setPushAlert] = useState(true);
  const [imageUrl, setImageUrl] = useState<any>(null);
  const [preImgUrl, setPreImgUrl] = useState<any>(null);
  const [deviceByView, SetDeviceByView] = useState('mobile');
  const [uploadAttachment, { isLoading: fileUploadLoading }] =
    useUploadAttachmentMutation();

  // Set content in the `contents` section
  useEffect(() => {
    const responseContent = pushContents
      ?.map((item: any) => ({
        language: t(`${item?.language}`),
        title: item?.title,
        description: item?.description,
        pushAlert: item?.pushAlert,
        preImgUrl: item?.image,
      }))
      ?.reverse();

    const languages = responseContent?.map((item: any) => item?.language);
    setContents(responseContent);
    setSelectedLanguages(languages);
  }, []);

  // Update input fields when selected button changes
  useEffect(() => {
    const activeContent = contents.find(
      (content: any) => content.language === selectedButton
    );

    if (activeContent) {
      setTitle(activeContent.title || '');
      setDescription(activeContent.description || '');
      setPreImgUrl(activeContent.preImgUrl || '');
      setPushAlert(activeContent.pushAlert ?? true);
    }
  }, [selectedButton, contents]);

  // Update contents when inputs change
  const updateContent = (
    key: 'title' | 'description' | 'pushAlert',
    value: any
  ) => {
    setContents((prevContents) => {
      const updatedContents = prevContents.map((content) =>
        content.language === selectedButton
          ? { ...content, [key]: value }
          : content
      );

      return updatedContents;
    });
  };

  useEffect(() => {
    setPushContents(contents);
  }, [contents]);

  // handle image file upload
  const handleNotificationFile = async (e: any) => {
    const file = e?.target?.files[0];
    const maxFileSize = 10 * 1024 * 1024;
    if (file?.size <= maxFileSize) {
      let response = await uploadAttachment({ file: file }).unwrap();
      setImageUrl(response);
      setPreImgUrl(response?.url);
      updateImage(response?.url);
    } else {
      setImageUrl(null);
      setPreImgUrl(null);
    }
  };

  // delete image file
  const handleDeleteImageFile = () => {
    setImageUrl(null);
    setImageUrl(null);
    updateImage(null);
  };

  // Update image function
  const updateImage = (image: any) => {
    setContents((prevContents) =>
      prevContents.map((content) =>
        content.language === selectedButton
          ? { ...content, preImgUrl: image }
          : content
      )
    );
  };

  return (
    <div>
      {/* Language selection */}
      <div className="flex items-center justify-between gap-5">
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
        <div className="capitalize">
          <b>{t('type')}:</b> {contentType}{' '}
        </div>
      </div>

      <div className="mt-5">
        {/* content notification */}
        <CollapsibleSection
          isOpen={openContentTab === 1}
          onToggle={(isOpen) => setOpenContentTab(isOpen ? 1 : null)}
          title={t('content')}
          subtitle={t('push_CNM')}
        >
          <div className="px-2 pt-5 grid grid-cols-2">
            {/* left side */}
            <div className="pr-5">
              {/* Title */}
              <NotificationInput
                label={t('push_title')}
                value={title}
                onChange={(value:string) => {
                  setTitle(value);
                  updateContent('title', value);
                }}
                placeholder={`${t('push_InT')}`}
              />

              {/* Description */}
              <NotificationInput
                label={t('description')}
                value={description}
                onChange={(value:string) => {
                  setDescription(value);
                  updateContent('description', value);
                }}
                placeholder={`${t('plh_aures')}...`}
                type="textarea"
              />

              {/* image upload*/}
              <ImageUpload
                fileUploadLoading={fileUploadLoading}
                imageFile={imageUrl}
                handleDeleteImageFile={handleDeleteImageFile}
                handleNotificationFile={handleNotificationFile}
              />

              {/* push alert */}
              {/* toggle switch */}
              <div className="mt-[2px] flex items-center gap-2 ">
                <Switch
                  checked={pushAlert}
                  className="custom-switch"
                  size="default"
                  onChange={(checked) => {
                    setPushAlert(checked);
                    updateContent('pushAlert', checked);
                  }}
                />
                <p className="text-sm font-normal  mt-[14px] tracking-wide">
                  {t('PushAlertSound')}
                </p>
              </div>
            </div>

            {/* Right: Preview */}
            <PreviewSection
              deviceByView={deviceByView}
              SetDeviceByView={SetDeviceByView}
              title={title}
              description={description}
              previewImageUrl={preImgUrl ? preImgUrl : defultImg}
            />
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default EditContent;
