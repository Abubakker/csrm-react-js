import { Button, Form, QRCode, Radio } from 'antd';
import LOCALS from 'commons/locals';
import { SHOP_MAP, SHOP_OPTION_LIST } from 'commons/options';
import MemberAddEdit from 'components/member-add-edit';
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useToggle } from 'react-use';
import { selectUserInfo } from 'store/slices/userInfoSlice';
import PORTAL_ORIGIN from 'utils/getPortalOrigin';

const MemberAdd = () => {
  const [registFromWebsite, toggleRegistFromWebsite] = useToggle(true);
  const { shop } = useSelector(selectUserInfo);
  const [createSource, setCreateSource] = useState(SHOP_MAP.WEBSITE);

  useEffect(() => {
    if (shop) {
      setCreateSource(shop);
    }
  }, [shop]);

  return (
    <div>
      {registFromWebsite ? (
        <div>
          <Form.Item
            labelCol={{ xl: 2, sm: 3 }}
            label={<Trans i18nKey={LOCALS.created_from} />}
          >
            <Radio.Group
              options={SHOP_OPTION_LIST}
              value={createSource}
              onChange={(value) => setCreateSource(value.target.value)}
            />
          </Form.Item>

          <QRCode
            className="mx-auto"
            value={`${PORTAL_ORIGIN}/sign-up-by-email?createSource=${createSource}`}
          />
          <p className="text-center text-sm text-gray-500 mt-2">
            <Trans i18nKey={LOCALS.bVMfWhvydu} />
          </p>
        </div>
      ) : (
        <MemberAddEdit mode="add" />
      )}

      <div className="flex justify-center mt-6">
        <Button onClick={toggleRegistFromWebsite}>
          {registFromWebsite ? (
            <Trans i18nKey={LOCALS.VFGniMWIir} />
          ) : (
            <Trans i18nKey={LOCALS.uLsFothaKN} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MemberAdd;
