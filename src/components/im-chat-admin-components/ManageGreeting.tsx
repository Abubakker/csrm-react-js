import { Input } from 'antd';
import { Button } from 'antd';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  useCreateProfileMutation,
  useGetProfileInfoQuery,
} from '../../store/im-chat-stores/imManagerChatApi.js';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
const { TextArea } = Input;

interface ProfileInfo {
  greeting: string;
}

export const ManageGreeting = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const pluginKey = useSelector(
    (state: any) => state.imManagerSettings.pluginKey
  );
  const {
    data: managerProfileData,
    isFetching,
    error,
    refetch,
  } = useGetProfileInfoQuery({ pluginKey: pluginKey });
  const [updateManagerProfile] = useCreateProfileMutation();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isFetching && !error) {
      setProfileInfo({ ...managerProfileData });
    }
  }, [managerProfileData, isFetching]);

  const handleSubmit = async () => {
    setLoading(true);
    await updateManagerProfile({
      pluginKey: pluginKey,
      data: profileInfo,
    });
    setIsEditing(false);
    setLoading(false);
    refetch();
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setIsEditing(true);
    const { value } = e.target;
    setProfileInfo((prevState) => ({
      ...prevState,
      greeting: value,
    }));
  };

  const resetSate = () => {
    setIsEditing(false);
    setLoading(false);
    refetch();
  };

  return (
    <div className="p-4">
      <TextArea
        value={profileInfo?.greeting}
        name="greeting"
        onChange={handleChange}
        rows={3}
        allowClear={true}
        className="p-4 bg-white rounded-lg shadow-sm"
      />
      <div className="mt-5 flex gap-2">
        <Button
          type="primary"
          disabled={!isEditing}
          loading={loading}
          onClick={handleSubmit}
        >
          {t('save')}
        </Button>
        <Button disabled={!isEditing} onClick={resetSate}>
          {t('cancel')}
        </Button>
      </div>
    </div>
  );
};
