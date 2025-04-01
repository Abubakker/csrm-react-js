import { memo, CSSProperties, ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import './index.module.scss';
import { PriceTagInfo } from 'types/pms';

export interface ContainerProps {
  accept: string[];
  onDrop: (item: PriceTagInfo) => void;
  children?: ReactNode;
  data: PriceTagInfo;
  style?: CSSProperties;
}

const Container = (props: ContainerProps) => {
  const { accept, onDrop, style } = props;
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: (e: PriceTagInfo) => onDrop(e),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = isOver && canDrop;
  let backgroundColor = '#fFF';
  if (isActive) {
    backgroundColor = '#e6f4ff';
  } else if (canDrop) {
    backgroundColor = '#ffffff';
  }
  return (
    <div ref={drop} style={{ ...style, backgroundColor }} className="container_print">
      {props.children}
    </div>
  );
};

export default memo(Container);
