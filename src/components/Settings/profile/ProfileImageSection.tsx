import { Spin } from 'antd';
import { FiEdit } from 'react-icons/fi';
import { MdOutlineCloudUpload } from 'react-icons/md';
import galleryImg from '../../../assets/images/gallery.png';
import delectImg from '../../../assets/icons/delectIcon.svg';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

// extract image upload component form profile component

type ImageSectionProps = {
  previewUrl: string | null;
  isUploading: boolean;
  showActions: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  onToggleActions: () => void;
};

const ProfileImageSection = ({
  previewUrl,
  isUploading,
  showActions,
  onUpload,
  onDelete,
  onToggleActions,
}: ImageSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="mt-8 mb-4 relative">
      <label className="uppercase text-[10px] font-medium tracking-[0.5px]">
        {t('image')}
      </label>
      <div className="size-[100px] bg-white flex justify-center items-center rounded-full mt-2 relative">
        {isUploading ? (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        ) : previewUrl ? (
          <div className="w-[98px] h-[98px] rounded-full overflow-hidden flex justify-center items-center ">
            <img
              src={previewUrl}
              alt="Profile"
              className="w-[98px] rounded-full object-cover"
            />
          </div>
        ) : (
          <img src={galleryImg} alt="Upload" className="size-10" />
        )}

        <label
          className={`text-black bg-white p-2 h-7 w-7 rounded-full absolute -end-1 -bottom-1 shadow-lg cursor-pointer ${
            previewUrl ? 'flex items-center justify-center' : ''
          }`}
          onClick={previewUrl ? onToggleActions : undefined}
        >
          {previewUrl ? <FiEdit /> : <FiEdit />}
          {!previewUrl && (
            <input
              type="file"
              className="hidden"
              onChange={onUpload}
              accept="image/*"
            />
          )}
        </label>

        {showActions && (
          <div className="bg-white absolute rounded-[10px] -bottom-[76px] -end-[158px] w-[200px] z-50 p-3 shadow-lg space-y-1">
            <label className="text-sm cursor-pointer flex gap-2 items-center hover:bg-slate-100 px-1 rounded">
              <MdOutlineCloudUpload className="text-lg" />
              <span>{t('unimg')}</span>
              <input
                type="file"
                className="hidden"
                onChange={onUpload}
                accept="image/*"
              />
            </label>
            <button
              className="text-[#CC4429] text-sm cursor-pointer flex items-center gap-2 hover:bg-slate-100 bg-transparent px-1 rounded w-full"
              onClick={onDelete}
            >
              <span className="">
                <img src={delectImg} alt="delete" className="size-4" />
              </span>
              <span className="mt-1">{t('dImg')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileImageSection;
