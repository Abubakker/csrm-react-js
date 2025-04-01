import MemberAddEdit from 'components/member-add-edit';
import { useParams } from 'react-router-dom';

const MemberEdit = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>-</div>;

  return <MemberAddEdit mode="edit" memberId={+id} />;
};

export default MemberEdit;
