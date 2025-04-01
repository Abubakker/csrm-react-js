import { UmsMember, UmsMemberReceiveAddress } from 'types/ums';
import styles from './index.module.scss';
import { Trans } from 'react-i18next';
import LOCALS from 'commons/locals';
import { useGetMemberReceiveAddressList } from 'apis/ums';
import { Button, Table, Descriptions } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { findLabelByValue } from 'commons/options';
import AddressAdd from './address-add';
import { useDescProps } from 'commons/hooks/useDescProps';
import { useCityList } from 'apis/home';

type MemberAddressListProps = {
  memberId: UmsMember['id'];
};

const CityName = ({
  countryCode,
  cityCode,
}: {
  countryCode: string;
  cityCode: string;
}) => {
  const cityList = useCityList(countryCode);
  const city = cityList.find((i) => i.code === cityCode)?.name;

  return <span>{city}</span>;
};

const MemberAddressList = ({ memberId }: MemberAddressListProps) => {
  const isMobile = false;
  const { memberReceiveAddressList, loading, getAddressList } =
    useGetMemberReceiveAddressList(memberId);
  const { countryOptions } = useAppSelector(selectGlobalInfo);
  const [open, setOpen] = useState(false);

  const columns: ColumnsType<UmsMemberReceiveAddress> = useMemo(() => {
    return [
      {
        title: <Trans i18nKey={LOCALS.name}></Trans>,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: <Trans i18nKey={LOCALS.country_region}></Trans>,
        dataIndex: 'province',
        key: 'province',
        // 历史遗留问题，country 存到了 province 字段里
        render: (country: UmsMemberReceiveAddress['province']) => {
          return findLabelByValue(country, countryOptions);
        },
      },
      {
        title: <Trans i18nKey={LOCALS.state_province_city}></Trans>,
        dataIndex: 'city',
        key: 'city',
        render: (city: string, address: UmsMemberReceiveAddress) => {
          return <CityName countryCode={address.province} cityCode={city} />;
        },
      },
      {
        title: <Trans i18nKey={LOCALS.zip_code}></Trans>,
        dataIndex: 'postCode',
        key: 'postCode',
      },
      {
        title: <Trans i18nKey={LOCALS.detail_address}></Trans>,
        dataIndex: 'detailAddress',
        key: 'detailAddress',
      },
      {
        title: <Trans i18nKey={LOCALS.default_address}></Trans>,
        dataIndex: 'defaultStatus',
        key: 'defaultStatus',
        render: (defaultStatus: UmsMemberReceiveAddress['defaultStatus']) => {
          return defaultStatus ? (
            <Trans i18nKey={LOCALS.yes}></Trans>
          ) : (
            <Trans i18nKey={LOCALS.no}></Trans>
          );
        },
      },
    ];
  }, [countryOptions]);

  const descProps = useDescProps({});

  return (
    <div className={styles.addressList}>
      {isMobile ? (
        <>
          <Descriptions
            title={<Trans i18nKey={LOCALS.shipping_address} />}
          ></Descriptions>
          {memberReceiveAddressList.map((d) => (
            <div className="mb-2" key={d.id}>
              <Descriptions bordered {...descProps}>
                <Descriptions.Item
                  label={<Trans i18nKey={LOCALS.name}></Trans>}
                >
                  {d.name}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<Trans i18nKey={LOCALS.country_region}></Trans>}
                >
                  {findLabelByValue(d.province, countryOptions)}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<Trans i18nKey={LOCALS.state_province_city}></Trans>}
                >
                  {d.city}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<Trans i18nKey={LOCALS.zip_code}></Trans>}
                >
                  {d.postCode}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<Trans i18nKey={LOCALS.detail_address}></Trans>}
                >
                  {d.detailAddress}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<Trans i18nKey={LOCALS.default_address}></Trans>}
                >
                  {d.defaultStatus ? (
                    <Trans i18nKey={LOCALS.yes}></Trans>
                  ) : (
                    <Trans i18nKey={LOCALS.no}></Trans>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className={styles.title}>
            <div className={styles.left}>
              <Trans i18nKey={LOCALS.shipping_address} />
            </div>
            <div className={styles.right}>
              <Button onClick={() => setOpen(true)}><Trans i18nKey={LOCALS.XQHQaxYgtY} /></Button>
            </div>
          </div>
          <Table
            size="small"
            bordered
            pagination={false}
            dataSource={memberReceiveAddressList}
            loading={loading}
            rowKey={'id'}
            style={{
              marginTop: 12,
            }}
            columns={columns}
          />
        </>
      )}

      <AddressAdd
        open={open}
        onClose={() => setOpen(false)}
        memberId={memberId}
        getLoad={() => getAddressList(memberId)}
      />
    </div>
  );
};

export default MemberAddressList;
