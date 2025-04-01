import { useTranslation } from 'react-i18next';
import { Spin } from 'antd';
import { DeleteIcon } from 'components/im-chat-admin-components/assets/IMChatIcons';
import { LoadingOutlined } from '@ant-design/icons';

interface ImageUploadProps {
  fileUploadLoading: boolean;
  imageFile: any;
  handleDeleteImageFile: () => void;
  handleNotificationFile: (e: any) => void;
}

const ImageUpload = ({
  fileUploadLoading,
  imageFile,
  handleDeleteImageFile,
  handleNotificationFile,
}: ImageUploadProps) => {
  const { t } = useTranslation();

  return (
    <div className="mt-6">
      <p className="block text-[10px] tracking-[0.5px] font-medium mb-2 uppercase font-sans">
        {t('uploadImage')}
        <span className="text-[#8B8FA3]">(jpg,jpeg,png)</span>
      </p>
      {fileUploadLoading ? (
        <label
          htmlFor="notificationImage"
          className="text-[12px] bg-white p-2 w-full rounded-[10px] border border-[#DADDEB] flex justify-center items-center"
        >
          <Spin indicator={<LoadingOutlined spin />} />
        </label>
      ) : imageFile ? (
        <label
          htmlFor="notificationImage"
          className="text-[12px] bg-white p-3 w-full rounded-[10px] border border-[#DADDEB] tracking-[1px] font-bold flex justify-between items-center"
        >
          Uploaded Photo
          <span
            className="h-3 -mt-[6px] cursor-pointer z-50"
            onClick={handleDeleteImageFile}
          >
            <DeleteIcon />
          </span>
        </label>
      ) : (
        <label
          htmlFor="notificationImage"
          className="text-[12px] bg-[#1677FF] hover:bg-blue-800 py-3 w-full block rounded-[10px] text-center text-white tracking-wider font-semibold cursor-pointer"
        >
          {t('browseFiles')}{' '}
          <span className="font-normal">({t('max2KB')})</span>
        </label>
      )}
      <input
        type="file"
        id="notificationImage"
        className="hidden"
        onChange={handleNotificationFile}
      />
    </div>
  );
};

export default ImageUpload;
