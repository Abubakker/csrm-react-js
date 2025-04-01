import {
  DownloadIcon,
  FileIconManager,
  FileIconUser,
} from './assets/IMChatIcons.jsx';

import { handleFileDownload } from './helpers/downloadHelper.js';

interface AttachmentMessageProps {
  imMessageBlockList: {
    contentType: string;
    originalName: string;
    sizeString: string;
    url: string;
  }[];
  personType: string;
  originalName: string;
  sizeString: string;
}

export const AttachmentMessage = ({
  personType,
  originalName,
  sizeString,
  imMessageBlockList,
}: AttachmentMessageProps) => (
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
      <div className="space-y-1 text-left">
        <p
          className={`text-[14px] leading-5 mb-0 font-bold break-all ${
            personType === 'user' ? 'text-black' : 'text-white'
          }`}
        >
          {originalName}
        </p>
        <p
          className={`text-[12px] mb-0 font-medium ${
            personType === 'user' ? 'text-gray-700' : 'text-white'
          }`}
        >
          {sizeString}
        </p>
      </div>
    </div>
    <button
      onClick={() =>
        handleFileDownload(imMessageBlockList[0].url, originalName)
      }
      className="relative bg-[#1677FF] rounded-full w-[28px] h-[28px] flex items-center justify-center text-xl cursor-pointer"
    >
      <DownloadIcon />
    </button>
  </div>
);
