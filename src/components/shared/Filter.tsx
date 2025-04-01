import profile from '../../assets/icons/profile-circle.svg';
import email from '../../assets/icons/email.svg';
import securityUser from '../../assets/icons/security-user.svg';
import tag from '../../assets/icons/tag.svg';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosClose } from 'react-icons/io';
import { HiOutlinePlusSm } from 'react-icons/hi';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { Input, Select } from 'antd';
import { operatorFilters } from 'constants/general-constants';
import axios from 'axios';
import { getGinzaxiaomaApiUrl } from 'apis';

const baseUrl = getGinzaxiaomaApiUrl();
const authToken = localStorage.getItem('LOCAL_STORAGE_TOKEN_KEY');
const Filter = ({ audience, setAudience }: any) => {
  const { t } = useTranslation();
  // filter operations
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string>('');
  const [filterCondition, setFilterCondition] = useState<any>('contains');
  const [member, setMember] = useState<any>();
  const [tagdata, setTagData] = useState<any>();
  const [filterDataOption, setFilterDataOption] = useState<any>();
  const [filters, setFilters] = useState<
    { fieldName: string; condition: string; value: string }[]
  >([]);
  const filtersItem = [
    { name: t('name'), icon: profile },
    { name: t('pEmail'), icon: email },
    { name: t('userId'), icon: securityUser },
    { name: t('userTag'), icon: tag },
  ];

  // update filter state
  useEffect(() => {
    setFilters(audience);
  }, [audience]);

  // save filtering
  const handleSaveFilter = () => {
    if (selectedFilter && filterValue) {
      const newFilter = {
        fieldName: selectedFilter,
        value: filterValue,
        condition: filterCondition,
      };

      setFilters((prev) => {
        const updatedFilters = [...prev, newFilter];
        setAudience(updatedFilters);
        return updatedFilters;
      });

      // Reset inputs
      setSelectedFilter(null);
      setShowAddFilter(false);
    }
  };

  // get member data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.post(
          `${baseUrl}/admin/umsMember/list`,
          {
            pageNum: 1,
            pageSize: 20000000,
            keyword: '',
          },
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        // create options
        setMember(data?.list);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  // fetch tag data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/tags?type=user&isActive=true`,
          
        );
        setTagData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (selectedFilter === t('pEmail')) {
      const filterData = member?.map((user: any) => {
        return {
          label: user?.email,
          value: user?.email,
        };
      });
      setFilterDataOption(filterData);
    }
    if (selectedFilter === t('name')) {
      const filterData = member?.map((user: any) => {
        return {
          label: `${user?.firstName} ${
            user?.firstNameKatakana ? user?.firstNameKatakana : ''
          } `,
          value: `${user?.firstName} ${
            user?.firstNameKatakana ? user?.firstNameKatakana : ''
          } `,
        };
      });
      setFilterDataOption(filterData);
    }
    if (selectedFilter === t('userId')) {
      const filterData = member?.map((user: any) => {
        return {
          label: `Id: ${user?.id}`,
          value: user?.id,
        };
      });
      setFilterDataOption(filterData);
    }
    if (selectedFilter === t('userTag')) {
      const filterData =
      tagdata?.map((user: any) => ({
            label: user.name,
            value: user?.id,
          })) || [];
      setFilterDataOption(filterData);
    }
  }, [selectedFilter]);

// if does not exists or exists then return true 
  useEffect(() => {
    if (filterCondition === 'doesNotExist' || filterCondition === 'exists') {
      setFilterValue('true');
    }
  }, [filterCondition]);


  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 pt-5">
        {filters?.length > 0 && (
          <div className="flex flex-wrap items-center -mt-4 gap-[6px] bg-white rounded-[10px]">
            {filters.map((filter, index) => (
              <div
                key={index}
                className=" rounded-lg px-2 text-sm flex gap-2 justify-between items-center"
              >
                <img
                  src={
                    filtersItem?.find((item) => item.name === filter?.fieldName)
                      ?.icon
                  }
                  alt="icon"
                  className="size-4 -mt-[2px]"
                />

                <span>
                  <span className="font-bold">{filter.fieldName} </span>
                  {t(filter.condition)} {filter.value}
                </span>
                <span
                  onClick={() =>
                    setFilters((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="text-red-500 text-xl mt-2 cursor-pointer"
                >
                  <IoIosClose />
                </span>
                <span
                  className={`text-[14px] ${
                    index === audience?.length - 1
                      ? 'text-[#1677FF]'
                      : 'text-[#8B8FA3]'
                  } font-bold cursor-pointer pl-1`}
                >
                  {t('or')}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="relative">
          <p
            className="text-[#1677FF] text-[12px] font-bold cursor-pointer tracking-widest flex items-center gap-1"
            onClick={() => {
              setShowAddFilter((prev) => !prev);
              setSelectedFilter(null);
            }}
          >
            <span className="text-[15px] font-bold mt-[2px]">
              <HiOutlinePlusSm />
            </span>
            {t('addFilter')}
          </p>

          {/* Add Filter Dropdown */}
          {showAddFilter && (
            <div className="rounded-[10px] shadow-lg p-4 absolute bg-white min-w-[300px] z-10 space-y-1 left-7">
              {filtersItem.map((filter) => (
                <li
                  key={filter.name}
                  className="px-2 py-[1px] hover:bg-gray-100 cursor-pointer rounded flex gap-2 items-center text-sm"
                  onClick={() => setSelectedFilter(filter.name)}
                >
                  <img src={filter.icon} alt="icon" className="size-4" />

                  {filter.name}
                </li>
              ))}
            </div>
          )}

          {/* Nested Filter Section */}
          {selectedFilter && (
            <div className="rounded-[10px] shadow-lg p-4 absolute bg-white min-w-[300px] z-20">
              {/* Header */}
              <div className="relative mb-3">
                <div className="absolute left-0 top-0">
                  <span
                    className="cursor-pointer bg-black text-white px-[4px] pt-[2px] rounded text-[10px] "
                    onClick={() => {
                      setSelectedFilter(null);
                      setShowAddFilter(true);
                    }}
                  >
                    <FaArrowLeftLong />
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 pb-2">
                  <img
                    src={
                      filtersItem.find((f) => f.name === selectedFilter)?.icon
                    }
                    alt="icon"
                    className="size-4 -mt-[15px]"
                  />
                  <p className="text-sm font-semibold">{selectedFilter}</p>
                </div>
              </div>

              {/* Filter Condition Dropdown */}
              <div className="mb-4 custom-select">
                <Select
                  className=" w-full rounded-[10px]  text-[12px] tracking-[1px]  font-medium  min-h-[42px]"
                  value={filterCondition}
                  onChange={(value) => setFilterCondition(value)}
                >
                  {operatorFilters.map((filter: any) => (
                    <option key={filter.original} value={filter.original}>
                      {t(filter.trname)}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Filter Value Input */}
              {filterCondition === 'doesNotExist' ||
              filterCondition === 'exists' ? (
                <div></div>
              ) : (
                <div className="mb-4 custom-select">
                  {selectedFilter === t('name') ? (
                    <Input
                      placeholder={`${t('search')}`}
                      onChange={(e) => setFilterValue(e.target.value)}
                      className="min-h-[42px] font-medium w-full tracking-[1px]  text-[12px] rounded-[10px]"
                    />
                  ) : (
                    <Select
                      allowClear
                      showSearch
                      placeholder={`${t('search')}`}
                      onChange={(value) => setFilterValue(value)}
                      options={filterDataOption}
                      className="min-h-[42px] font-medium w-full tracking-[1px]  text-[12px] "
                    />
                  )}
                </div>
              )}

              <p className="text-center tracking-[0.4px] leading-[10px] font-medium text-[#3F4252] text-[10px] ">
                {t('mosRUI')}
              </p>
              {/* Save Button */}
              <button
                onClick={handleSaveFilter}
                className={`w-full mt-10 ${
                  filterValue
                    ? 'bg-[#1677FF] text-white hover:bg-[#1677FF] cursor-pointer'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-not-allowed'
                } px-4 py-3 rounded-[10px] text-[12px] font-bold tracking-[1px] h-[42px]`}
              >
                {t('save')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;
