import { Popover } from 'antd';
import { PropsWithChildren, ReactElement, useMemo } from 'react';
import styles from './index.module.scss';

type PopoverListProps = PropsWithChildren<{
  list: { label: string | ReactElement; onClick: () => void }[];
}>;

const PopoverList = ({ list, children }: PopoverListProps) => {
  const content = useMemo(() => {
    return (
      <div className={styles.langSelector}>
        {list.map(({ label, onClick }, index) => {
          return (
            <div
              onClick={() => {
                onClick && onClick();
              }}
              className={styles.langSelectorItem}
              key={index}
            >
              {label}
            </div>
          );
        })}
      </div>
    );
  }, [list]);

  return (
    <Popover trigger="click" content={content} placement="bottomRight">
      {children}
    </Popover>
  );
};

export default PopoverList;
