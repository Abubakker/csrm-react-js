import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Channel } from 'types/integration';

const ChannelCard = ({ url, icon, name, description }: Channel) => {
  return (
    <Link
      to={url}
      className="flex items-center justify-between gap-6 bg-[#EBEDF7] rounded-[10px] p-6"
    >
      <div className="flex items-center gap-4">
        <img src={icon} alt={name} className="w-12 h-12" />
        <div>
          <h3 className="font-bold text-[18px] text-[#1A1A1A]">{name}</h3>
          <p className="text-[#676B80] mb-0">{description}</p>
        </div>
      </div>
      <RightOutlined className="text-[#1A1A1A]" />
    </Link>
  );
};

export default ChannelCard;
