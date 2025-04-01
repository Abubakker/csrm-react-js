import { DailyStatisticsType } from 'types/report';
import { ginzaxiaomaApiRequest } from '.';

export const getDailyStatistics = (dto?: {
  date: string;
  createdFrom?: number;
}) => {
  return ginzaxiaomaApiRequest.get<DailyStatisticsType>(
    '/admin/order/daily-statistics',
    {
      params: dto,
    }
  );
};
