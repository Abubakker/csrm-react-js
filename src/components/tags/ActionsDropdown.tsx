import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { Edit2Icon } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { Tag } from './TagTable';

interface ActionsDropdownProps {
  item: Tag;
  onEdit: (item: Tag) => void;
}

const ActionsDropdown = ({ item, onEdit }: ActionsDropdownProps) => {
  const { t } = useTranslation();

  return (
    <div className="custom-dropdown">
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="edit">
              <span
                className={`flex items-center gap-2 text-[#1A1A1A] cursor-pointer`}
                onClick={() => onEdit(item)}
              >
                <img src={Edit2Icon} alt="" />
                <span className="text-[12px] font-sans font-medium tracking-[1px]">
                  {t('edit')}
                </span>
              </span>
            </Menu.Item>
          </Menu>
        }
      >
        <MoreOutlined className="text-[#1677FF]" />
      </Dropdown>
    </div>
  );
};

export default ActionsDropdown;
