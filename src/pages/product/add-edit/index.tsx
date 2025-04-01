import ProductAddEdit from 'components/product-add-edit';
import { useParams } from 'react-router-dom';

type ProductAddEditProps = {
  mode: 'add' | 'view' | 'edit';
};

const ProductAddEditPage = ({ mode }: ProductAddEditProps) => {
  const { id } = useParams<{ id: string }>();

  return <ProductAddEdit mode={mode} id={id ? Number(id) : undefined} />;
};

export default ProductAddEditPage;
