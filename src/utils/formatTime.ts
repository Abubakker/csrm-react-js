import dayjs from 'dayjs';

const formatTime = (time?: string | null) => {
  if (!time) return '-';

  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
};

export default formatTime;
