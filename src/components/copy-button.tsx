import classNames from 'classnames';
import { PropsWithChildren } from 'react';
import i18n from 'i18n';
import LOCALS from 'commons/locals';
import { Button, message } from 'antd';
import copyToClipboard from 'copy-to-clipboard';

type Props = { className?: string; copyText: string } & PropsWithChildren;

const CopyButton = ({ className, children, copyText }: Props) => {
  return (
    <div className={classNames(className)}>
      {children}
      <Button
        onClick={() => {
          copyToClipboard(copyText);
          message.success(i18n.t(LOCALS.kTFIViDbSC));
        }}
        type="link"
      >
        {i18n.t(LOCALS.copy)}
      </Button>
    </div>
  );
};

export default CopyButton;
