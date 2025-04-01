import { InfoCircleOutlined } from '@ant-design/icons';
import { Note } from 'types/integration';

const NoteCard = ({ isImportant, note }: Note) => {
  return (
    <div
      className={`rounded-lg px-3 py-2 flex gap-2 items-start ${
        isImportant
          ? 'bg-[#EAF5FD] text-[#329DE9]'
          : 'bg-[#F2F2F2] text-[#616161]'
      }`}
    >
      <InfoCircleOutlined />
      <p className="mb-0 leading-[20px]">{note}</p>
    </div>
  );
};

export default NoteCard;
