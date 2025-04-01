import { Button } from 'antd';
import defaultImage from 'assets/icons/gallery.svg';

interface CampaignMessageProps {
  title: string;
  description: string;
  imageUrl: string;
  buttons: any;
}

const CampaignMessage = ({
  title,
  description,
  imageUrl,
  buttons,
}: CampaignMessageProps) => {
  return (
    <div className="bg-white w-[286px] rounded-xl p-3 border border-[#DADDEB]">
      <div className="flex flex-col gap-3">
        <div className="bg-gray-500 h-[160px] w-[262px] flex justify-center items-center rounded-[12px]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="content"
              className="h-[160px] w-[262px] rounded-[11px] object-fill"
            />
          ) : (
            <img
              src={defaultImage}
              alt="content"
              className="size-20 rounded-[12px]"
            />
          )}
        </div>
        <div className="tracking-wider">
          <h1 className="text-[14px] font-bold capitalize">{title}</h1>
          <p className="text-[12px] font-medium text-[#3F4252]">
            {description}
          </p>
        </div>
        {buttons?.elements?.map((item: any, idx: number) => (
          <a href={item?.link} className="w-full">
            <Button
              key={idx}
              className="font-bold text-[12px] tracking-wider rounded-lg border border-black hover:border-black hover:text-black h-[30px] w-full capitalize"
            >
              {item?.title}
            </Button>
          </a>
        ))}
      </div>
    </div>
  );
};
export default CampaignMessage;
