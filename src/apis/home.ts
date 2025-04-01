import { BaseRes } from 'types/base';
import request from '.';
import { MallCity, MallCountry } from 'types/home';
import { useEffect, useState } from 'react';

export const getCountryList = () => {
  return request.get<BaseRes<MallCountry[]>>('/home/countries');
};

export const useCountryList = () => {
  const [countryList, setCountryList] = useState<MallCountry[]>([]);

  useEffect(() => {
    getCountryList().then((res) => {
      setCountryList(res.data);
    });
  }, []);

  return { countryList };
};

export const getCityListByCountryCode = (countryCode: string) => {
  return request.get<BaseRes<MallCountry>>(`/home/country/${countryCode}`);
};

export const useCityList = (countryCode: string) => {
  const [cityList, setCityList] = useState<MallCity[]>([]);

  useEffect(() => {
    if (!countryCode) return;

    getCityListByCountryCode(countryCode).then((res) => {
      if (!res.data) return;

      const { cityList } = res.data;

      if (cityList) {
        setCityList(cityList);
      }
    });
  }, [countryCode]);

  return cityList;
};

export const getTodayRateMap = () => {
  return request.get<
    BaseRes<{
      [key: string]: number;
    }>
  >('/home/getTodayRates');
};

export const useTodayRateMap = () => {
  const [todayRateMap, setTodayRateMap] = useState<{ [key: string]: number }>(
    {}
  );

  useEffect(() => {
    getTodayRateMap().then(({ data }) => {
      setTodayRateMap(data);
    });
  }, []);

  return todayRateMap;
};
