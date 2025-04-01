import { Dropdown, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { AddItemIcon, ImportIcon, ViewFinderIcon } from 'assets/images';
import { MoreOutlined } from '@ant-design/icons';

interface ActionDropdownMenuProps {
  itemId: string;
  rewardData: any;
  onView: (id: string) => void;
  onDuplicate: (data: any) => void;
  onInactive: (id: string) => void;
}

const ActionDropdownMenu = ({
  itemId,
  rewardData,
  onView,
  onDuplicate,
  onInactive,
}: ActionDropdownMenuProps) => {
  const { t } = useTranslation();

  return (
    <div className="custom-dropdown">
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="view" onClick={() => onView(itemId)}>
              <span className="flex items-center gap-[6px]">
                <img src={ViewFinderIcon} alt="" className="size-4" />
                <span className="text-[12px] font-sans font-medium tracking-[1px] mt-[2px]">
                  {t('view')}
                </span>
              </span>
            </Menu.Item>
            <Menu.Item key="duplicate" onClick={() => onDuplicate(rewardData)}>
              <span className="flex items-center gap-[6px]">
                <img src={AddItemIcon} alt="" className="size-4" />
                <span className="text-[12px] font-sans font-medium tracking-[1px]">
                  {t('duplicate')}
                </span>
              </span>
            </Menu.Item>
            <Menu.Item key="inactive" onClick={() => onInactive(itemId)}>
              <span className="flex items-center gap-[6px] text-[#CC4429]">
                <img src={ImportIcon} alt="" className="size-4" />
                <span className="text-[12px] font-sans font-medium tracking-[1px]">
                  {t('inactive')}
                </span>
              </span>
            </Menu.Item>
          </Menu>
        }
      >
        <MoreOutlined />
      </Dropdown>
    </div>
  );
};

export default ActionDropdownMenu;
