import { useRef, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { DocumentsIcon, PhotosIcon } from './assets/IMChatIcons';

interface AttachmentUploadComponentProps {
  onClose: () => void;
  handleAttachmentUpload: (files: FileList | File[], from: string) => void;
  opened: boolean;
}

const AttachmentUploadComponent = ({
  opened,
  onClose,
  handleAttachmentUpload,
}: AttachmentUploadComponentProps) => {
  const { t } = useTranslation();

  const modalRef = useRef<HTMLDivElement>(null);

  const customer = useSelector(
    (state: any) => state.imManagerSettings.selectedCustomer
  );

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (opened) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [opened, onClose]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      handleAttachmentUpload(e.target.files, e.target.id);
    }
    onClose();
  };

  return (
    <>
      {opened && (
        <div
          id="default-modal"
          tabIndex={-1}
          aria-modal={false}
          role="dialog"
          className="mb-5 ml-5 absolute inset-0 flex items-end justify-start bg-transparent ease-in-out z-40"
        >
          <div
            ref={modalRef}
            className="mb-[75px] bg-[#F5F6FC] shadow-lg w-auto rounded-[10px]"
          >
            {customer?.media_type === 'line' ||
              customer?.media_type === 'instagram' || (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById('document-upload')?.click()
                    }
                    className="p-3 flex items-center w-full bg-transparent"
                  >
                    <div className="p-2 rounded-full bg-[#FFFFFF] flex justify-center items-center">
                      <DocumentsIcon />
                    </div>
                    <div className="pl-3">
                      <p className="text-sm font-bold text-start mb-0">
                        {t('documents')}
                      </p>
                      <p className="text-start text-xs mb-0">
                        {t('share_files_description')}
                      </p>
                    </div>
                  </button>
                  <hr className="p-0 h-[1px] bg-[#EBEDF7]" />
                </>
              )}

            <button
              type="button"
              onClick={() => document.getElementById('photo-upload')?.click()}
              className="p-3 flex items-center w-full rounded-[10px] bg-[#F5F6FC]"
            >
              <div className="p-2 rounded-full bg-[#FFFFFF] flex justify-center items-center">
                <PhotosIcon />
              </div>
              <div className="pl-3">
                <p className="text-sm font-bold text-start mb-0">
                  {t('photos')}
                </p>
                <p className="text-start text-xs mb-0">
                  {t('share_photos_description')}
                </p>
              </div>
            </button>

            <input
              id="document-upload"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              className="hidden"
              onChange={handleFileChange}
              multiple
            />

            <input
              id="photo-upload"
              type="file"
              accept=".jpg, .jpeg, .png, .gif, .heif, .bmp, .webp"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AttachmentUploadComponent;
