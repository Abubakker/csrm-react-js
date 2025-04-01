import { Button, Descriptions, Radio, Select, Spin } from 'antd';
import { getMemberList } from 'apis/ums';
import { UmsMember } from 'types/ums';
import { useToggle } from 'react-use';
import { useCallback, useMemo, useState } from 'react';
import { usePayloadContext } from 'pages/oms/checkout-counter/utils/payload-context';
import { ActionType } from 'pages/oms/checkout-counter/utils/payload-reducer';
import LOCALS from '../commons/locals';
import i18n from 'i18n';
import CreateMemberDrawer from './create-member-drawer';
import { Link } from 'react-router-dom';
import formatTime from 'utils/formatTime';
import { debounce } from 'lodash-es';
import { Trans } from 'react-i18next';

const UmsMemberTable = ({ umsMember }: { umsMember?: UmsMember }) => {
  const { dispatch, state } = usePayloadContext();

  return (
    <div>
      {umsMember && (
        <Descriptions bordered size="small">
          {/* <Descriptions.Item label="ID">{umsMember.id}</Descriptions.Item> */}
          <Descriptions.Item label={i18n.t(LOCALS.email) || '邮箱'}>
            <Link to={`/ums/member-view/${umsMember.id}`} target="_blank">
              {umsMember.email}
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label={i18n.t(LOCALS.name) || '用户名'}>
            {umsMember.showName}
          </Descriptions.Item>
          <Descriptions.Item
            label={i18n.t(LOCALS.available_points) || '可用积分'}
          >
            <div className="text-red-500 font-bold">
              {umsMember.integration}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label={i18n.t(LOCALS.phone_number) || '电话'}>
            {umsMember.showPhone}
          </Descriptions.Item>
          <Descriptions.Item
            label={i18n.t(LOCALS.registration_time) || '注册时间'}
          >
            {formatTime(umsMember.createTime)}
          </Descriptions.Item>

          <Descriptions.Item label={i18n.t(LOCALS.points_earned || '赠送积分')}>
            <Radio.Group
              buttonStyle="solid"
              value={state.isPointsGiven}
              onChange={(e) =>
                dispatch({
                  type: ActionType.UPDATE_BATCH,
                  payload: { isPointsGiven: e.target.value },
                })
              }
            >
              <Radio.Button value={true}>
                <Trans i18nKey={LOCALS.yes} />
              </Radio.Button>
              <Radio.Button value={false}>
                <Trans i18nKey={LOCALS.no} />
              </Radio.Button>
            </Radio.Group>
          </Descriptions.Item>
        </Descriptions>
      )}
    </div>
  );
};

const UmsMemberSelect = () => {
  const [umsMember, setUmsMember] = useState<UmsMember | undefined>();
  const [umsMemberList, setUmsMemberList] = useState<UmsMember[]>([]);
  const { dispatch } = usePayloadContext();
  const [createMemberOpen, toggleCreateMemberOpen] = useToggle(false);
  const [loading, toggleLoading] = useToggle(false);

  const debouncedHandleSearch = useMemo(() => {
    return debounce((keyword: string) => {
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
    }, 300);
  }, [toggleLoading]);

  const handleSearch = useCallback(
    (keyword: string) => {
      debouncedHandleSearch(keyword);
    },
    [debouncedHandleSearch]
  );

  return (
    <div className="mb-4">
      <h2>{i18n.t(LOCALS.member_details)}</h2>

      <div className="flex items-center mb-4">
        <Select
          placeholder={i18n.t(LOCALS.phone_or_email) || '邮箱/手机号'}
          className="w-full"
          filterOption={false}
          notFoundContent={loading ? <Spin size="small" /> : null}
          onSearch={handleSearch}
          showSearch
          value={null}
          onChange={(memberId: UmsMember['id']) => {
            const target = umsMemberList.find((i) => i.id === memberId);
            if (target) {
              setUmsMember(target);
              dispatch({
                type: ActionType.UPDATE_BATCH,
                payload: {
                  memberId: target?.id,
                  totalIntegration: target?.integration,
                  isPointsGiven: true,
                },
              });
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
          className="ml-2"
          onClick={() => {
            setUmsMember(undefined);
            setUmsMemberList([]);
            dispatch({
              type: ActionType.UPDATE_BATCH,
              payload: {
                useIntegration: 0,
                memberId: 0,
              },
            });
          }}
        >
          {i18n.t(LOCALS.reset)}
        </Button>
        <Button className="ml-2" onClick={() => toggleCreateMemberOpen(true)}>
          {i18n.t(LOCALS.add)}
        </Button>
      </div>

      <UmsMemberTable umsMember={umsMember} />

      <CreateMemberDrawer
        open={createMemberOpen}
        onClose={() => toggleCreateMemberOpen(false)}
        setUmsMember={(umsMember) => {
          setUmsMember(umsMember);
          dispatch({
            type: ActionType.UPDATE_BATCH,
            payload: {
              memberId: umsMember?.id,
              totalIntegration: umsMember?.integration || 0,
              isPointsGiven: true,
            },
          });
        }}
      />
    </div>
  );
};

export default UmsMemberSelect;
