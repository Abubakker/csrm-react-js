import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import viewIcon from '../../../assets/icons/view.svg';
import duplicate from '../../../assets/icons/duplicate.svg';
import inactiveIcon from '../../../assets/icons/inativeIcon.svg';
import { useTranslation } from 'react-i18next';

type ActionDropdownProps = {
  item: any;
  handleDuplicate: (item: any) => void;
  handleStateChange: (status: string, id: string) => void;
  setViewCoupon: (item: any) => void;
};
const ActionDropdown = ({
  item,
  handleDuplicate,
  handleStateChange,
  setViewCoupon,
}: ActionDropdownProps) => {
  const { t } = useTranslation();

  return (
    <Dropdown
      overlay={
        <Menu className="min-w-[150px]">
          <Menu.Item key="edit">
            <div
              className="flex items-center gap-[6px]"
              onClick={() => setViewCoupon(item?.fullResponse)}
            >
              <img src={viewIcon} alt="" className="size-4" />
              <span className="text-[12px] font-sans font-medium tracking-[1px] mt-1">
                {t('view')}
              </span>
            </div>
          </Menu.Item>
          <Menu.Item key="duplicate">
            <span
              className="flex items-center gap-[6px]"
              onClick={() => handleDuplicate(item?.fullResponse)}
            >
              <img src={duplicate} alt="" className="size-4" />
              <span className="text-[12px] font-sans font-medium tracking-[1px] mt-[2px]">
                {t('duplicate')}
              </span>
            </span>
          </Menu.Item>
          <Menu.Item key="status">
            <span className="flex items-center gap-[6px] text-[#CC4429]">
              <img src={inactiveIcon} alt="" className="size-4" />
              <span
                className="text-[12px] font-sans font-medium tracking-[1px] mt-[2px]"
                onClick={() => handleStateChange(item?.status, item?.key)}
              >
                {item?.status === 'Active' ? t('InActive') : t('Active')}
              </span>
            </span>
          </Menu.Item>
        </Menu>
      }
    >
      <MoreOutlined />
    </Dropdown>
  );
};

export default ActionDropdown;
