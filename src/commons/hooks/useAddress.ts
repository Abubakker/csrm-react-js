import { useCallback } from 'react';
import { getCityListByCountryCode } from 'apis/home';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { useAppSelector } from 'store/hooks';

export interface AddressInfoInterface {
  country?: string;
  city?: string;
  province?: string;
  detailAddress?: string;
}

const useAddress = () => {
  /** 城市国家相关 */
  const { countryOptions } = useAppSelector(selectGlobalInfo);

  /** 城市信息 */
  const getCityList = (country: string) => {
    if (!country) return;
    return getCityListByCountryCode(country).then((res) => {
      return res.data.cityList || [];
    });
  };

  const getAddressInfo = useCallback(
    async (data: AddressInfoInterface) => {
      const cityList = await getCityList(data.country!);
      const city = cityList!.find((d) => d.code === data.city);
      const country = countryOptions.find((d) => d.value === data.country);
      return new Promise((resolve, reject) => {
        const source = {
          city: city?.name,
          country: country?.label,
          detailAddress: data.detailAddress,
        };
        resolve(source);
      });
    },
    [countryOptions]
  );

  return {
    getAddressInfo,
  };
};

export default useAddress;
