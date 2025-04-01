import LOCALS from 'commons/locals';
import { Trans } from 'react-i18next';
import styles from './index.module.scss';

type ContextMenuProps = {
  top: number;
  left: number;
  onView?: () => void;
  onDelete?: () => void;
};

const ContextMenu = ({ top, left, onView, onDelete }: ContextMenuProps) => {
  return (
    <div
      className={styles.contextMenuContainer}
      style={{ top: `${top}px`, left: `${left}px` }}
    >
      {onView && (
        <div
          className={styles.contextMenuItem}
          onClick={() => {
            onView();
          }}
        >
          <Trans i18nKey={LOCALS.view} />
        </div>
      )}
      {onDelete && (
        <div
          className={styles.contextMenuItem}
          onClick={() => {
            onDelete();
          }}
        >
          <Trans i18nKey={LOCALS.delete} />
        </div>
      )}
    </div>
  );
};

export default ContextMenu;
