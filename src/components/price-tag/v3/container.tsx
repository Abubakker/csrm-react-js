import classNames from 'classnames';
import { memo, ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { PriceTagInfo } from 'types/pms';

export interface ContainerProps {
  accept: string[];
  onDrop: (item: PriceTagInfo) => void;
  children?: ReactNode;
  data: PriceTagInfo;
  className?: string;
}

const Container = (props: ContainerProps) => {
  const { accept, onDrop, className } = props;
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: (e: PriceTagInfo) => onDrop(e),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop}
      className={classNames(
        className,
        'flex items-center justify-center border-t border-l border-black relative',
        isActive ? 'bg-[#e6f4ff] ' : 'bg-white'
      )}
    >
      {props.children}
    </div>
  );
};

export default memo(Container);
