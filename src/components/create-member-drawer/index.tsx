import { Drawer } from 'antd';
import { UmsMember } from 'types/ums';
import i18n from 'i18n';
import MemberAddEdit from 'components/member-add-edit';
import useIsMobile from 'commons/hooks/useIsMobile';

interface CreateMemberProps {
  open: boolean;
  onClose: () => void;
  setUmsMember?: (data: UmsMember) => void;
}

const CreateMemberDrawer = ({
  open,
  onClose,
  setUmsMember,
}: CreateMemberProps) => {
  const isMobile = useIsMobile();

  return (
    <Drawer
      title={i18n.t('member_sign_up')}
      width={isMobile ? '100%' : '70%'}
      onClose={onClose}
      open={open}
      zIndex={1001}
    >
      <MemberAddEdit
        mode="add"
        source="checkout-counter"
        onClose={onClose}
        setUmsMember={setUmsMember}
      />
    </Drawer>
  );
};

export default CreateMemberDrawer;
