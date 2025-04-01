import { Spin, Descriptions, Select, Button } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { useToggle } from 'react-use';
import { UmsMember, UmsMemberReceiveAddressV1 } from 'types/ums';
import { getMemberList, getMemberReceiveAddressListV1 } from 'apis/ums';
import { OrderGenerateForMemberDto } from 'types/oms';
import { MEMBER_LEVEL_OPTION_LIST, findLabelByValue } from 'commons/options';
import formatTime from 'utils/formatTime';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import i18n from '../../../i18n';
import LOCALS from '../../../commons/locals';
import CreateMemberDrawer from 'components/create-member-drawer';
import AddressAdd from 'pages/ums/member-view/address-add';

interface Props {
  setPayload: (
    data: Partial<
      Pick<OrderGenerateForMemberDto, 'memberId' | 'receiveAddressId'>
    > & {
      receiveAddressCountry?: string;
    }
  ) => void;
}

const MemberSelect = ({ setPayload }: Props) => {
  const location = useLocation();
  const [loading, toggleLoading] = useToggle(false);
  const [memberData, setMemberData] = useState<UmsMember>();
  const [umsMemberList, setUmsMemberList] = useState<UmsMember[]>([]);
  const [addressList, setAddressList] = useState<UmsMemberReceiveAddressV1[]>(
    []
  );
  const [checkAddress, setCheckAddress] = useState<number>(0);
  const [createMemberOpen, toggleCreateMemberOpen] = useToggle(false);
  const [addressOpen, setAddressOpen] = useState(false);

  useEffect(() => {
    if (!memberData) {
      return;
    }

    getMemberReceiveAddressListV1(memberData.id).then(({ data }) => {
      setAddressList(data);

      if (data.length) {
        // 选中默认地址
        const t = data.find((d) => d.defaultStatus === 1) || data[0];
        setCheckAddress(t.id);
        setPayload({
          receiveAddressId: t.id,
          receiveAddressCountry: t.province,
        });
      }
    });
  }, [memberData, setPayload]);

  const handleSearch = useCallback(
    (keyword: string) => {
      keyword = keyword.trim();
      if (!keyword) {
        setUmsMemberList([]);
        return;
      }
      toggleLoading(true);
      getMemberList({ keyword, pageNum: 1, pageSize: 10 })
        .then((data) => {
          setUmsMemberList(data.data.list);
        })
        .catch()
        .finally(() => toggleLoading(false));
    },
    [toggleLoading]
  );

  useEffect(() => {
    if (location.state) {
      const { memberEmail } = location.state;
      handleSearch(memberEmail);
    }
  }, [location, handleSearch]);

  useEffect(() => {
    if (location.state && umsMemberList.length) {
      const { memberId } = location.state;
      const target = umsMemberList.find((i) => i.id === memberId);
      setMemberData(target);
      setPayload({ memberId: memberId });
    }
  }, [location, umsMemberList, setPayload]);

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <Select
          size="large"
          placeholder={i18n.t(LOCALS.phone_or_email) || '手机号/邮箱'}
          className="w-full"
          filterOption={false}
          notFoundContent={loading ? <Spin size="small" /> : null}
          onSearch={handleSearch}
          showSearch
          onChange={(memberId: UmsMember['id']) => {
            const target = umsMemberList.find((i) => i.id === memberId);
            setPayload({
              receiveAddressId: undefined,
              receiveAddressCountry: undefined,
            });
            if (target) {
              setMemberData(target);
              setPayload({ memberId: target.id });
            }
          }}
          options={umsMemberList.map((i) => {
            return {
              ...i,
              value: i.id,
              label: `${i.showName}(${i.email})`,
            };
          })}
        ></Select>

        <Button
          size="large"
          type="primary"
          className="ml-4"
          onClick={toggleCreateMemberOpen}
        >
          {i18n.t(LOCALS.add)}
        </Button>
      </div>

      {memberData && (
        <Descriptions bordered size="small">
          <Descriptions.Item label={i18n.t(LOCALS.email) || '邮箱'}>
            <Link to={`/ums/member-view/${memberData.id}`} target="_blank">
              {memberData.email}
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label={i18n.t(LOCALS.name) || '用户名'}>
            {memberData.showName}
          </Descriptions.Item>
          <Descriptions.Item
            label={i18n.t(LOCALS.available_points) || '可用积分'}
          >
            <div className="text-red-500 font-bold">
              {memberData.integration}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label={i18n.t(LOCALS.phone_number) || '电话'}>
            {memberData.showPhone}
          </Descriptions.Item>
          <Descriptions.Item label={i18n.t(LOCALS.member_level) || '会员类型'}>
            {findLabelByValue(memberData.memberLevel, MEMBER_LEVEL_OPTION_LIST)}
          </Descriptions.Item>
          <Descriptions.Item
            label={i18n.t(LOCALS.registration_time) || '注册时间'}
          >
            {formatTime(memberData.createTime)}
          </Descriptions.Item>
        </Descriptions>
      )}

      {memberData && (
        <div className="my-2">
          <a
            href="/"
            onClick={(event) => {
              setAddressOpen(true);
              event.preventDefault();
            }}
          >
            {i18n.t('add_address')}
          </a>
        </div>
      )}

      {!!addressList.length && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {addressList.map(
            ({
              id,
              detailAddress,
              city,
              phoneNumber,
              name,
              country,
              postCode,
              province,
            }) => {
              return (
                <div
                  key={id}
                  onClick={() => {
                    setCheckAddress(id);
                    setPayload({
                      receiveAddressId: id,
                      receiveAddressCountry: province,
                    });
                  }}
                  className={classNames(
                    'p-2 rounded cursor-pointer border-2',
                    checkAddress === id ? 'border-black' : 'border-gray-200'
                  )}
                >
                  <div className="mb-1">
                    {name} {phoneNumber}
                  </div>
                  <div className="mb-1">
                    {postCode} {`${country?.name} ${city?.name || ''}`}
                  </div>
                  <div>{detailAddress}</div>
                </div>
              );
            }
          )}
        </div>
      )}

      <CreateMemberDrawer
        open={createMemberOpen}
        onClose={() => toggleCreateMemberOpen(false)}
        setUmsMember={(umsMember) => {
          setMemberData(umsMember);
          setPayload({ memberId: umsMember.id });
        }}
      />

      {addressOpen && memberData && (
        <AddressAdd
          title={i18n.t(LOCALS.please_select_a_shipping_address) || ''}
          open={true}
          onClose={() => setAddressOpen(false)}
          memberId={memberData?.id}
          getLoad={() => {
            setMemberData({ ...memberData });
            setPayload({ memberId: memberData.id });
          }}
        />
      )}
    </div>
  );
};

export default MemberSelect;
