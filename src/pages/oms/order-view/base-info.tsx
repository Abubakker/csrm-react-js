import { Descriptions, Select, Tag } from 'antd';
import LOCALS from 'commons/locals';
import {
  ORDER_CREATED_FROM_OPTION_LIST,
  ORDER_STATUS_ANTD_TAG_COLOR_MAP,
  OrderDeliveryTypeOptionList,
  findLabelByValue,
} from 'commons/options';
import CopyButton from 'components/copy-button';
import LinkButton from 'components/link-button';
import { Trans } from 'react-i18next';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { OmsOrderDetail } from 'types/oms';
import formatTime from 'utils/formatTime';
import styles from './index.module.scss';
import i18n from 'i18n';
import { OMS_ORDER_TAG_OPTION_LIST } from 'constant';
import { updateOmsOrderDetail } from 'apis/oms';
import { getOmsOrderDetailV2 } from 'apis/oms';
import { UnwrapPromise } from 'types/base';
import { useMemo } from 'react';

type OrderBaseInfoProps = {
  omsOrderDetail: OmsOrderDetail & {
    tagList: {
      id: number;
      tag: string;
    }[];
    coupon: UnwrapPromise<ReturnType<typeof getOmsOrderDetailV2>>['coupon'];
  };
};

const OrderBaseInfo = ({ omsOrderDetail }: OrderBaseInfoProps) => {
  const {
    status,
    orderSn,
    memberUsername,
    createdFrom,
    deliveryCompany,
    deliverySn,
    integration,
    memberId,
    multiplePayStatus,
    deliveryType,
    createTime,
    id,
    note,
    tagList,
    coupon,
  } = omsOrderDetail;
  const { orderStatusOptions, orderTypeOptions, staffSelectOptions } =
    useAppSelector(selectGlobalInfo);

  const couponDescription = useMemo(() => {
    if (!coupon) return null;
    if (coupon.i18nDescription) {
      const lang = i18n.language.replace('_', '-');
      if (coupon.i18nDescription[lang]) {
        return (
          <div className="text-red-500">
            <h3>{coupon.i18nDescription[lang].title}</h3>
            <div>{coupon.i18nDescription[lang].description}</div>
          </div>
        );
      }
    }
    return coupon.note || '-';
  }, [coupon]);

  return (
    <div className="mb-3">
      <div className={styles.title}>
        <Trans i18nKey={LOCALS.basic_info} />
      </div>
      <Descriptions size="small" bordered>
        <Descriptions.Item label={<Trans i18nKey={LOCALS.order_status} />}>
          <Tag color={ORDER_STATUS_ANTD_TAG_COLOR_MAP[status]}>
            {findLabelByValue(status, orderStatusOptions)}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.dwawuQNUEi} />}>
          {id}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.order_sn} />}>
          <CopyButton copyText={orderSn}>{orderSn}</CopyButton>
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.created_time} />}>
          {formatTime(createTime)}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.member_account} />}>
          {memberId && memberUsername ? (
            <CopyButton copyText={memberUsername}>
              <LinkButton href={`/ums/member-view/${memberId}`}>
                {memberUsername}
              </LinkButton>
            </CopyButton>
          ) : (
            '-'
          )}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.created_from} />}>
          {findLabelByValue(createdFrom, ORDER_CREATED_FROM_OPTION_LIST)}
        </Descriptions.Item>

        {!!deliveryCompany && (
          <Descriptions.Item label={<Trans i18nKey={LOCALS.delivery_method} />}>
            {deliveryCompany || '-'}
          </Descriptions.Item>
        )}

        {!!deliverySn && (
          <Descriptions.Item label={<Trans i18nKey={LOCALS.shipment_number} />}>
            {deliverySn || '-'}
          </Descriptions.Item>
        )}

        <Descriptions.Item label={<Trans i18nKey={LOCALS.points_for_order} />}>
          {integration || 0}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.order_type} />}>
          {findLabelByValue(omsOrderDetail.orderType, orderTypeOptions)}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.vucsrXTzfQ}></Trans>}>
          <Tag
            color={
              OrderDeliveryTypeOptionList.find((d) => d.value === deliveryType)
                ?.color
            }
          >
            {findLabelByValue(deliveryType, OrderDeliveryTypeOptionList)}
          </Tag>
        </Descriptions.Item>

        {!!multiplePayStatus && (
          <Descriptions.Item label={<Trans i18nKey={LOCALS.MultiplePayList} />}>
            {multiplePayStatus ? <Trans i18nKey={LOCALS.yes} /> : '-'}
          </Descriptions.Item>
        )}

        {!!coupon && (
          <Descriptions.Item label={<Trans i18nKey={LOCALS.coupon} />}>
            {couponDescription}
          </Descriptions.Item>
        )}

        {!!note && (
          <Descriptions.Item label={<Trans i18nKey={LOCALS.remark}></Trans>}>
            {note || '-'}
          </Descriptions.Item>
        )}
        <Descriptions.Item label={<Trans i18nKey={LOCALS.khvsAbbLJs} />}>
          <Select
            mode="multiple"
            value={tagList.map((i) => i.tag)}
            onChange={async (val) => {
              await updateOmsOrderDetail(id, { tagList: val });
              window.location.reload();
            }}
            placeholder={i18n.t(LOCALS.please_select)}
            options={OMS_ORDER_TAG_OPTION_LIST}
            style={{ width: 150 }}
          />
        </Descriptions.Item>

        <Descriptions.Item label={i18n.t(LOCALS.staff)}>
          <Select
            value={omsOrderDetail.staffName}
            className="w-40"
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            onChange={async (val) => {
              val = val || '';
              await updateOmsOrderDetail(id, { staffName: val });
              window.location.reload();
            }}
            options={staffSelectOptions.map((i) => {
              return {
                value: i.label,
                label: i.label,
              };
            })}
          ></Select>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default OrderBaseInfo;
