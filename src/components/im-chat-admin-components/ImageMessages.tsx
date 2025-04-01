import { DownloadIcon } from './assets/IMChatIcons.jsx';
import { handleDownload } from './helpers/downloadHelper.js';
import { useEffect } from 'react';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

interface ImageMessagesProps {
  personType: string;
  imMessageBlockList: {
    id: string;
    url: string;
    type: string;
    value: string;
    contentType: string;
    originalName?: string;
    sizeString?: string;
  }[];
  media: any;
  mediaType: string;
  userMedia: any;
}

export const ImageMessages = ({
  imMessageBlockList,
  personType,
  media,
  mediaType,
  userMedia,
}: ImageMessagesProps) => {
  useEffect(() => {
    Fancybox.bind('[data-fancybox="gallery"]', {
      Carousel: {
        transition: 'fade',
      },
      Toolbar: {
        display: {
          left: ['infobar'],
          middle: [
            'zoomIn',
            'zoomOut',
            'rotateCCW',
            'rotateCW',
            'flipX',
            'flipY',
          ],
          right: ['download', 'close'],
        },
      },
    });

    return () => {
      Fancybox.destroy();
    };
  }, []);

  const getGridColumns = () => {
    if (media?.length === 1) return 'grid-cols-1 grid-rows-1';
    if (media?.length === 2) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  const getSpanClasses = (type: string) => {
    if (media?.length === 1 && type === 'sticker') {
      return 'h-[50px] w-[50px]';
    } else if (media?.length === 1) {
      return 'col-span-3 row-span-3 h-[250px]';
    } else {
      return 'h-[80px] ';
    }
  };

  const handleImgDownload = () => {
    const downloadMedia = (url: string, name: string) => {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    if (userMedia === 'im chat') {
      handleDownload(imMessageBlockList);
      return;
    }

    const downloadFn =
      userMedia === 'whatsapp' || userMedia === 'line'
        ? () => downloadMedia(media, media.name)
        : () =>
            media?.forEach((element: any) =>
              downloadMedia(element?.url, element.name)
            );

    downloadFn();
  };

  return (
    <div
      className={`flex items-center gap-3 my-2 max-w-md ${
        personType === 'user' ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {mediaType !== 'sticker' && (
        <button
          onClick={handleImgDownload}
          className="relative bg-[#1677FF] rounded-full w-[28px] h-[28px] flex items-center justify-center text-xl cursor-pointer"
        >
          <DownloadIcon />
        </button>
      )}
      {userMedia === 'whatsapp' || userMedia === 'line' ? (
        <div>
          <a
            href={media?.url}
            data-fancybox="gallery"
            data-download-src={media?.url}
            className={getSpanClasses(media?.type)}
          >
            <img
              loading="lazy"
              src={media?.url}
              alt=""
              className="object-cover w-[248px] h-[248px] rounded-[30px] hover:cursor-pointer"
            />
          </a>
        </div>
      ) : userMedia === 'im chat' ? (
        imMessageBlockList?.length > 1 ? (
          <div className={`gallery grid gap-2 ${getGridColumns()}`}>
            {imMessageBlockList?.map((image, index) => (
              <a
                href={image?.url}
                data-fancybox="gallery"
                data-download-src={image?.url}
                key={image?.id}
                className={getSpanClasses(image?.type)}
              >
                <img
                  loading="lazy"
                  src={image?.url}
                  alt={`${index}`}
                  className="object-cover h-[80px] w-[80px] rounded-[10px] hover:cursor-pointer"
                />
              </a>
            ))}
          </div>
        ) : (
          <div>
            <a
              href={imMessageBlockList[0]?.url}
              data-fancybox="gallery"
              data-download-src={imMessageBlockList[0]?.url}
              key={imMessageBlockList[0]?.id}
              className={getSpanClasses(imMessageBlockList[0]?.type)}
            >
              <img
                loading="lazy"
                src={imMessageBlockList[0]?.url}
                alt={`${1}`}
                className="object-cover w-[248px] h-[248px] rounded-[30px] hover:cursor-pointer"
              />
            </a>
          </div>
        )
      ) : media?.length > 1 ? (
        <div className={`gallery grid gap-2 ${getGridColumns()}`}>
          {media?.map((image: any, index: number) => (
            <a
              href={image?.url}
              data-fancybox="gallery"
              data-download-src={image?.url}
              key={image?.id}
              className={getSpanClasses(image?.type)}
            >
              <img
                loading="lazy"
                src={image?.url}
                alt={`${index}`}
                className="object-cover h-[80px] w-[80px] rounded-[10px] hover:cursor-pointer"
              />
            </a>
          ))}
        </div>
      ) : (
        <div>
          <a
            href={media[0]?.url}
            data-fancybox="gallery"
            data-download-src={media[0]?.url}
            key={media[0]?.id}
            className={getSpanClasses(media[0]?.type)}
          >
            <img
              loading="lazy"
              src={media[0]?.url}
              alt={`${1}`}
              className="object-cover w-[248px] h-[248px] rounded-[30px] hover:cursor-pointer"
            />
          </a>
        </div>
      )}
    </div>
  );
};
