import { Button, Descriptions } from 'antd';
import { getSellYourBagDetail } from 'apis/oms';
import LOCALS from 'commons/locals';
import { ACCESSORY_OPTION_LIST } from 'commons/options';
import { useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { SellYourBagRecord } from 'types/oms';
import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

const SellYourBagEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<SellYourBagRecord>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/rrs/sell-your-bag');
  };

  useEffect(() => {
    if (!id) return;

    (async () => {
      const res = await getSellYourBagDetail(id);

      setData(res.data);
    })();
  }, [id]);

  const accessoriesEl = useMemo(() => {
    if (!data) return '-';

    const accessoriesArr = data.accessories
      .split(',')
      .map((i) => {
        const target = ACCESSORY_OPTION_LIST.find((j) => j.value === Number(i));
        if (!target) return '';

        return target.label;
      })
      .filter((i) => !!i);

    return accessoriesArr.length
      ? accessoriesArr.map((i, index) => {
          return <div key={i}>{`${index + 1}. ${i}`}</div>;
        })
      : '-';
  }, [data]);

  const productPicturesEl = useMemo(() => {
    if (!data) return '-';

    return (
      <LightGallery
        licenseKey="1000-0000-000-0000"
        plugins={[lgThumbnail, lgZoom]}
      >
        {data.productPics.map((i) => {
          return (
            <div
              data-src={i.src}
              key={i.id}
              style={{
                display: 'inline-block',
                margin: 6,
              }}
            >
              <img
                style={{
                  width: 100,

                  cursor: 'pointer',
                }}
                src={i.src}
                alt={i.name}
              />
            </div>
          );
        })}
      </LightGallery>
    );
  }, [data]);

  if (!data) return <div>loading</div>;

  return (
    <div>
      <Descriptions title="" bordered>
        <Descriptions.Item
          span={3}
          label={<Trans i18nKey={LOCALS.product_name} />}
        >
          {data.productName || '-'}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.email} />}>
          {data.email}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.member_id} />}>
          {data.memberId}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.phone_number} />}>
          {data.phone || '-'}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.social_media} />}>
          {data.socialName || '-'}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.social_handle} />}>
          {data.socialAccount || '-'}
        </Descriptions.Item>

        <Descriptions.Item label={<Trans i18nKey={LOCALS.accessories} />}>
          {accessoriesEl}
        </Descriptions.Item>

        <Descriptions.Item
          span={3}
          label={<Trans i18nKey={LOCALS.product_pictures} />}
        >
          {productPicturesEl}
        </Descriptions.Item>
      </Descriptions>

      <footer
        style={{
          marginTop: 16,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button onClick={handleBack}>
          <Trans i18nKey={LOCALS.back} />
        </Button>
      </footer>
    </div>
  );
};

export default SellYourBagEdit;
