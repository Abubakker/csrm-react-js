import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  useCreateProfileMutation,
  useGetProfileInfoQuery,
  useUploadAttachmentMutation,
} from '../../../store/im-chat-stores/imManagerChatApi.js';

import { Button, Form, Input } from 'antd';
import ProfileImageUpload from './ProfileImageUpload.js';
import CountrySelect from './CountrySelect.js';
import TimezoneSelect from './TimezoneSelect.js';

interface ProfileInfo {
  icon?: string | null;
  name?: string;
  contactNumber?: string;
  country?: string;
  timeZone?: string;
}

const ManagerProfile = () => {
  const [form] = Form.useForm();
  const [uploadAttachment] = useUploadAttachmentMutation();
  const [uploadingImage, setUploadingImage] = useState(false);
  const pluginKey = useSelector(
    (state: any) => state.imManagerSettings.pluginKey
  );
  const [isEditing, setIsEditing] = useState(false);
  const [updateManagerProfile] = useCreateProfileMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({});

  const {
    data: managerProfileInfo,
    isFetching,
    error,
    refetch,
  } = useGetProfileInfoQuery({ pluginKey: pluginKey });

  useEffect(() => {
    if (!isFetching && !error) {
      setProfileInfo({ ...managerProfileInfo });
    }
  }, [managerProfileInfo]);
  const { t } = useTranslation();

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    setUploadingImage(true);
    setIsEditing(true);
    const files = e?.target?.files;
    if (!files) return;
    const file = files[0];
    const maxFileSize = 10 * 1024 * 1024;
    if (file?.size <= maxFileSize) {
      let response = await uploadAttachment({ file: file }).unwrap();
      setProfileInfo({
        ...profileInfo,
        icon: response.url,
      });
    }
    setUploadingImage(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsEditing(true);
    const { name, value } = e.target;
    setProfileInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setIsEditing(true);
    setProfileInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetState = () => {
    setIsEditing(false);
    setIsSubmitting(false);
    if (!isFetching && !error) {
      setProfileInfo((prevState) => ({
        ...prevState,
        ...managerProfileInfo,
      }));
    }
    refetch();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await updateManagerProfile({
      pluginKey: pluginKey,
      data: profileInfo,
    });
    setIsEditing(false);
    setIsSubmitting(false);
    refetch();
  };

  return (
    <Form className="p-4" form={form} layout="vertical">
      {/* Profile Image */}
      <Form.Item label={t('image')} className="mb-6">
        <ProfileImageUpload
          icon={profileInfo.icon}
          uploadingImage={uploadingImage}
          onFileUpload={handleFileUpload}
          onDeleteImage={() => {
            setProfileInfo((prevState) => ({
              ...prevState,
              icon: null,
            }));
            setIsEditing(true);
          }}
        />
      </Form.Item>
      <Form.Item label={t('name')}>
        <Input
          placeholder={`${t('enter_name')}`}
          name="name"
          value={profileInfo?.name || ''}
          onChange={handleChange}
        />
      </Form.Item>
      <Form.Item label={t('contact_number')}>
        <Input
          placeholder={`${t('enter_contact_number')}`}
          name="contactNumber"
          value={profileInfo?.contactNumber || ''}
          onChange={handleChange}
        />
      </Form.Item>

      {/* Country */}
      <Form.Item label={t('country')}>
        <CountrySelect
          value={profileInfo?.country || ''}
          onChange={(value) => handleSelectChange('country', value)}
        />
      </Form.Item>

      {/* Timezone */}
      <Form.Item label={t('timezone')}>
        <TimezoneSelect
          value={profileInfo?.timeZone || ''}
          onChange={(value) => handleSelectChange('timeZone', value)}
        />
      </Form.Item>

      <div className="flex gap-2">
        <Button
          type="primary"
          disabled={!isEditing}
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          {t('save')}
        </Button>
        <Button onClick={resetState} disabled={!isEditing}>
          {t('cancel')}
        </Button>
      </div>
    </Form>
  );
};

export default ManagerProfile;
