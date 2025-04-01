import ProductLabelEdit from 'components/product-label-edit';
import { useParams } from 'react-router-dom';

interface ProducLabelEditProps {
  mode: 'add' | 'view' | 'edit';
}

const ProductAddEditPage = ({ mode }: ProducLabelEditProps) => {
  const { id } = useParams<{ id: string }>();

  return <ProductLabelEdit mode={mode} id={id as string} />;
};

export default ProductAddEditPage;
