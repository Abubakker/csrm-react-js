import { Typography } from 'antd';
import DetailRow from './DetailRow';
import { useTranslation } from 'react-i18next';
import { CustomerDetailsData } from './CustomerDetails';

interface CustomerInfoProps {
  customerDetails: CustomerDetailsData;
}

const { Text } = Typography;

const CustomerInfo = ({ customerDetails }: CustomerInfoProps) => {
  const { t } = useTranslation();

  return (
    <>
      <DetailRow label={t('email')}>{customerDetails?.email}</DetailRow>
      <DetailRow label={t('source')}>N/A</DetailRow>
      <DetailRow label={t('first_name')}>
        {customerDetails?.firstName}
      </DetailRow>
      <DetailRow label={t('last_name')}>{customerDetails?.lastName}</DetailRow>
      <DetailRow label={t('gender')}>
        {customerDetails?.gender === 1 ? t('male') : t('female')}
      </DetailRow>
      <DetailRow label={t('contact_no')}>{customerDetails?.phone}</DetailRow>
      <DetailRow label={t('date_of_birth')}>
        {customerDetails?.birthday}
      </DetailRow>
      <DetailRow label={t('social_account')}>
        <Text className="text-[#1677FF]">{customerDetails?.socialAccount}</Text>
      </DetailRow>
      <DetailRow label={t('country')}>{customerDetails?.country}</DetailRow>
      <DetailRow label={t('city')}>{customerDetails?.city}</DetailRow>
      <DetailRow label={t('detail_address')}>
        {customerDetails?.detailAddress}
      </DetailRow>
    </>
  );
};
export default CustomerInfo;
