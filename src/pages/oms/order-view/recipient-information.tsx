import { Descriptions } from 'antd';
import { useCityList } from 'apis/home';
import LOCALS from 'commons/locals';
import { findLabelByValue, OrderDeliveryTypeMap } from 'commons/options';
import CopyButton from 'components/copy-button';
import { useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { OmsOrderDetail } from 'types/oms';
import styles from './index.module.scss';
import classNames from 'classnames';
import commonApi from 'apis/common';

type RecipientInformationProps = {
  omsOrderDetail: OmsOrderDetail;
};

const RecipientInformation = ({
  omsOrderDetail: {
    receiverName,
    receiverPhone,
    receiverPostCode,
    receiverProvince,
    receiverCity,
    receiverDetailAddress,
    deliveryType,
    signUrl,
    pickupTime,
  },
}: RecipientInformationProps) => {
  const [signImageUrl, setSignImageUrl] = useState('');
  useEffect(() => {
    if (signUrl && deliveryType === OrderDeliveryTypeMap.PICKUP) {
      commonApi.getSignedFileUrl(signUrl).then((res) => {
        setSignImageUrl(res.url);
      });
    }
  }, [deliveryType, signUrl]);

  const { countryOptions } = useAppSelector(selectGlobalInfo);
  const cityList = useCityList(receiverProvince);

  const targetCity = useMemo(() => {
    return cityList.find((i) => i.code === receiverCity);
  }, [cityList, receiverCity]);

  const recipientInformationText = useMemo(() => {
    return `${receiverName} ${
      receiverPhone.startsWith('+') ? receiverPhone : `+${receiverPhone}`
    } ${receiverPostCode} ${receiverDetailAddress} ${
      targetCity ? targetCity.name : receiverCity
    } ${findLabelByValue(receiverProvince, countryOptions)}`;
  }, [
    countryOptions,
    receiverCity,
    receiverDetailAddress,
    receiverName,
    receiverPhone,
    receiverPostCode,
    receiverProvince,
    targetCity,
  ]);

  return (
    <div className="mb-3">
      <div className={classNames(styles.title, 'flex items-center')}>
        <Trans i18nKey={LOCALS.recipient_information} />
        <CopyButton copyText={recipientInformationText} />
      </div>
      <Descriptions bordered size="small">
        <Descriptions.Item label={<Trans i18nKey={LOCALS.name} />}>
          {receiverName}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.phone_number} />}>
          {receiverPhone}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.zip_code} />}>
          {receiverPostCode || '-'}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.country_region} />}>
          {findLabelByValue(receiverProvince, countryOptions)}
        </Descriptions.Item>

        <Descriptions.Item
          label={<Trans i18nKey={LOCALS.state_province_city} />}
        >
          {targetCity ? targetCity.name : receiverCity || '-'}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.detail_address} />}>
          {receiverDetailAddress || '-'}
        </Descriptions.Item>

        {deliveryType === OrderDeliveryTypeMap.PICKUP && !!pickupTime && (
          <Descriptions.Item label={<Trans i18nKey={LOCALS.EsqMNViBHq} />}>
            {pickupTime}
          </Descriptions.Item>
        )}

        {deliveryType === OrderDeliveryTypeMap.PICKUP && !!signImageUrl && (
          <Descriptions.Item label={<Trans i18nKey={LOCALS.LSyPLaaZjt} />}>
            <img src={signImageUrl} className="max-h-40" alt="sign" />
          </Descriptions.Item>
        )}
      </Descriptions>
    </div>
  );
};

export default RecipientInformation;
