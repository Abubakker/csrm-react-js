import { Input, Tabs, TabsProps } from 'antd';
import classNames from 'classnames';
import i18n from '../../i18n';
import LOCALS from '../../commons/locals';

const SimpleRichEditor = ({
  value,
  rows = 5,
  className,
  onChange,
}: {
  rows?: number;
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
}) => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: i18n.t(LOCALS.email_template_Content),
      children: (
        <Input.TextArea
          rows={rows}
          value={value}
          onChange={(e) => {
            onChange && onChange(e.target.value);
          }}
        ></Input.TextArea>
      ),
    },
    {
      key: '2',
      label: i18n.t(LOCALS.preview),
      children: (
        <div
          dangerouslySetInnerHTML={{
            __html: value?.replace(/\n/g, '<br/>') || '',
          }}
        ></div>
      ),
    },
  ];

  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        items={items}
        className={classNames(className)}
      />
    </div>
  );
};

export default SimpleRichEditor;
