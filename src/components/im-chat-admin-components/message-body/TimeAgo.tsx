import ReactTimeAgo from 'react-time-ago';

interface TimeAgoProps {
  date: Date;
  locale: string;
}

const TimeAgo = ({ date, locale }: TimeAgoProps) => (
  <div className="text-[10px] text-[#9EA1B5] opacity-0 group-hover:opacity-100">
    <ReactTimeAgo date={new Date(date)} locale={locale} />
  </div>
);

export default TimeAgo;
