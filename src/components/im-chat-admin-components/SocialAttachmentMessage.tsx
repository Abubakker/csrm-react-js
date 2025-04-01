import {
  DownloadIcon,
  FileIconManager,
  FileIconUser,
} from './assets/IMChatIcons.jsx';
import { handleFileDownload } from './helpers/downloadHelper.js';

interface SocialAttachmentMessageProps {
  personType: string;
  media: {
    url: string;
    type: string;
    name: string;
    originalName?: string;
    sizeString?: string;
  };
}

export const SocialAttachmentMessage = ({
  personType,
  media,
}: SocialAttachmentMessageProps) => (
  <div
    className={`flex items-center gap-3 ${
      personType === 'user' ? 'flex-row' : 'flex-row-reverse'
    }`}
  >
    <div
      className={`gap-2 flex justify-start items-center p-3 rounded-lg ${
        personType === 'user'
          ? 'bg-gray-100 text-black'
          : 'bg-[#1677FF] text-white'
      }`}
    >
      <div className="w-10">
        {personType === 'user' ? <FileIconUser /> : <FileIconManager />}
      </div>
      <div>
        <p
          className={`text-[14px] mb-0 font-bold break-all ${
            personType === 'user' ? 'text-black' : 'text-white'
          }`}
        >
          {media.name}
        </p>
        <p
          className={`text-[12px] mb-0 font-medium ${
            personType === 'user' ? 'text-gray-700' : 'text-white'
          }`}
        >
          {/* {sizeString} */}
        </p>
      </div>
    </div>
    <button
      onClick={() => handleFileDownload(media.url, media.name)}
      className="relative bg-[#1677FF] rounded-full w-[28px] h-[28px] flex items-center justify-center text-xl cursor-pointer"
    >
      <DownloadIcon />
    </button>
  </div>
);
