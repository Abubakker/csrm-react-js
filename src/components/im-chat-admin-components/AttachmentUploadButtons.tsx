import { DocumentsIcon, PhotosIcon } from './assets/IMChatIcons.jsx';
import { useTranslation } from 'react-i18next';

export const DocumentUploadButton = () => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => {
        const fileUploadElement = document.getElementById('file-upload');
        if (fileUploadElement) fileUploadElement.click();
      }}
      className="flex gap-2 min-w-[370px] min-h-[65px] justify-start items-center bg-white hover:bg-gray-100"
    >
      <div className="flex-none">
        <DocumentsIcon />
      </div>
      <div className="grow">
        <p className="text-sm font-bold text-start">{t('documents')}</p>
        <p className="text-xs text-start">{t('share_files_description')}</p>
      </div>
    </button>
  );
};

export const PhotoUploadButton = () => {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={() => {
        const photoUploadElement = document.getElementById('photo-upload');
        if (photoUploadElement) photoUploadElement.click();
      }}
      className="flex gap-2 min-w-[370px] min-h-[65px] justify-start items-center bg-white hover:bg-gray-100"
    >
      <div className="flex-none">
        <PhotosIcon />
      </div>
      <div className="grow">
        <p className="text-sm font-bold text-start">{t('photos')}</p>
        <p className="text-xs text-start">{t('share_photos_description')}</p>
      </div>
    </button>
  );
};
