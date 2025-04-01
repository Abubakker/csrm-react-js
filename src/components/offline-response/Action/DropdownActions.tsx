import { Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import duplicate from '../../../assets/icons/duplicate.svg';
import inactiveIcon from '../../../assets/icons/inativeIcon.svg';
import EditResponse from './EditResponse';

interface DropdownActionsProps {
  item: {
    id: number;
    status: number;
    responseData: any;
  };
  onDuplicate: (responseData: any) => void;
  onStatusChange: (params: { id: number; status: number }) => void;
}

const DropdownActions = ({
  item,
  onDuplicate,
  onStatusChange,
}: DropdownActionsProps) => {
  const { t } = useTranslation();

  return (
    <Dropdown
      className="cursor-pointer"
      overlay={
        <Menu className="space-y-1">
          {/* Edit Action */}
          <Menu.Item key="edit">
            <EditResponse response={item.responseData} />
          </Menu.Item>

          {/* Duplicate Action */}
          <Menu.Item
            key="duplicate"
            onClick={() => onDuplicate(item.responseData)}
          >
            <div className="flex items-center gap-[6px]">
              <img src={duplicate} alt="Duplicate" className="size-4" />
              <span className="text-[12px] font-sans font-medium tracking-[1px] mt-[2px]">
                {t('duplicate')}
              </span>
            </div>
          </Menu.Item>

          {/* Status Action */}
          <Menu.Item key="unpublish">
            <div
              className="flex items-center gap-[6px] text-[#CC4429] cursor-pointer"
              onClick={() =>
                onStatusChange({ id: item?.id, status: item?.status })
              }
            >
              <img src={inactiveIcon} alt="Status" className="size-4" />
              <span className="text-[12px] font-sans font-medium tracking-[1px] mt-[3px]">
                {item.status === 1 || item.status === 2
                  ? t('published')
                  : t('unpublish')}
              </span>
            </div>
          </Menu.Item>
        </Menu>
      }
      trigger={['click']}
    >
      <MoreOutlined />
    </Dropdown>
  );
};

export default DropdownActions;
