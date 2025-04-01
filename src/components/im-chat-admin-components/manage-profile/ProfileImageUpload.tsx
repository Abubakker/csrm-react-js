import { Avatar, Dropdown, Menu } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { UploadIcon } from '../assets/IMChatIcons.jsx';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface ProfileImageUploadProps {
  icon?: string | null;
  uploadingImage: boolean;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: () => void;
}

const ProfileImageUpload = ({
  icon,
  uploadingImage,
  onFileUpload,
  onDeleteImage,
}: ProfileImageUploadProps) => {
  const { t } = useTranslation();

  const menu = (
    <Menu style={{ borderRadius: '10px' }}>
      <Menu.Item
        key="1"
        icon={<UploadIcon />}
        style={{ borderRadius: '8px' }}
        onClick={() => document.getElementById('profile-photo-upload')?.click()}
      >
        <p className="mt-3 ml-2">{t('upload_new_image')}</p>
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<DeleteOutlined style={{ fontSize: '18px' }} />}
        style={{ borderRadius: '8px' }}
        danger
        onClick={onDeleteImage}
      >
        <p className="mt-3 ml-2">{t('delete_image')}</p>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="rounded-sm">
      <div className="relative w-24 h-24 rounded-lg flex items-center justify-center">
        <Avatar
          size={96}
          // loading="lazy"
          src={uploadingImage ? null : icon}
          icon={uploadingImage ? <LoadingOutlined /> : <UserAddOutlined />}
          className="rounded-2xl bg-gray-200"
        />
        <Dropdown
          overlay={menu}
          trigger={['click']}
          className="absolute -bottom-2 -right-2 bg-white h-[28px] w-[28px]"
        >
          <div className="flex justify-center items-center rounded-full border border-gray-300">
            <EditOutlined />
          </div>
        </Dropdown>
      </div>
      <input
        id="profile-photo-upload"
        type="file"
        accept=".jpg, .jpeg, .png"
        className="invisible"
        onChange={onFileUpload}
      />
    </div>
  );
};

export default ProfileImageUpload;
