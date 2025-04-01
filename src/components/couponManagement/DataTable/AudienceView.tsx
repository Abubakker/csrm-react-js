import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import profile from '../../../assets/icons/profile-circle.svg';
import email from '../../../assets/icons/email.svg';
import location from '../../../assets/icons/location.svg';
import mobile from '../../../assets/icons/mobile.svg';
import securityUser from '../../../assets/icons/security-user.svg';
import tag from '../../../assets/icons/tag.svg';
const AudienceView = ({ filters }: any) => {
  const { t } = useTranslation();
  const [tagData, setTagData] = useState();
  const [tagItem, setTagItem] = useState<
    { value: string; label: string }[] | undefined
  >();
  // filter item
  const filtersItem = [
    { name: t('name'), icon: profile },
    { name: t('pEmail'), icon: email },
    { name: t('mNumber'), icon: mobile },
    { name: t('userId'), icon: securityUser },
    { name: t('userTag'), icon: tag },
    { name: t('city'), icon: location },
  ];

  // fetch tag data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_IM_CHAT_BASE_API}/tags?type=user&isActive=true`
        );
        setTagData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="border-t border-[#d3d5df]">
      {filters?.length === 0 ? (
        <div className="mt-8">No Audience Added</div>
      ) : (
        <div className="flex flex-wrap items-center gap-[6px] bg-white rounded-[10px] mt-4 p-2">
          {filters?.map((filter: any, index: number) => (
            <div
              key={index}
              className=" rounded-lg px-2 text-sm flex gap-2 justify-between items-center"
            >
              <img
                src={
                  filtersItem?.find((item) => item?.name === filter?.fieldName)
                    ?.icon
                }
                alt="icon"
                className="size-4 -mt-[2px]"
              />

              <span>
                <span className="font-bold">{filter?.fieldName}</span>{' '}
                {t(filter.condition)}{' '}
                {filter?.fieldName === t('userTag')
                  ? tagItem?.find((item: any) => item?.value === filter?.value)
                      ?.label
                  : filter.value}
              </span>

              <span
                className={`text-[14px] ${
                  index === filters?.length - 1 ? 'hidden' : 'text-[#8B8FA3]'
                } font-bold cursor-pointer pl-1`}
              >
                {t('or')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudienceView;
