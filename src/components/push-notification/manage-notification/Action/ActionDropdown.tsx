import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { NotificationStatus } from '../ManageNotification';
import { Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

import inactiveIcon from '../../../../assets/icons/inativeIcon.svg';
import duplicate from '../../../../assets/icons/duplicate.svg';

// Lazy load the EditNotification component
const EditNotification = lazy(() => import('./EditNotification'));

const ActionDropdown = ({
  notification,
  onDuplicate,
  onChangeStatus,
}: {
  notification: any;
  onDuplicate: () => void;
  onChangeStatus: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="custom-dropdown cursor-pointer">
      <Dropdown
        overlay={
          <Menu className="min-w-[170px]">
            <Menu.Item key="edit">
              <Suspense fallback={<div>Loading...</div>}>
                <EditNotification response={notification.fullResponse} />
              </Suspense>
            </Menu.Item>
            <Menu.Item key="duplicate">
              <span
                className="flex items-center gap-[6px]"
                onClick={onDuplicate}
              >
                <img src={duplicate} alt="" className="size-4" />
                <span className="text-[12px] font-sans font-medium tracking-[1px] mt-[2px]">
                  {t('duplicate')}
                </span>
              </span>
            </Menu.Item>
            {notification.status !== NotificationStatus.Published && (
              <Menu.Item key="status">
                <span
                  className="flex items-center gap-[6px] text-[#CC4429] cursor-pointer"
                  onClick={onChangeStatus}
                >
                  <img src={inactiveIcon} alt="" className="size-4" />
                  <span className="text-[12px] font-sans font-medium tracking-[1px] mt-[3px]">
                    {notification.status === NotificationStatus.Published
                      ? t('unpublish')
                      : t('published')}
                  </span>
                </span>
              </Menu.Item>
            )}
          </Menu>
        }
      >
        <MoreOutlined />
      </Dropdown>
    </div>
  );
};

export default ActionDropdown;
