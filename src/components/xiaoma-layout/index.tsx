import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, Menu, Select, theme } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import React from 'react';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import xiaomaLogo from 'assets/images/xiaoma-logo.png';
import { getUserInfo } from 'apis/user';
import { initUserInfo, selectUserInfo } from 'store/slices/userInfoSlice';
import { useAppDispatch } from 'store/hooks';
import { useSelector } from 'react-redux';
import {
  selectGlobalInfo,
  setLanguage,
  setStaffSelectOptions,
} from 'store/slices/globalInfoSlice';
import { Trans, useTranslation } from 'react-i18next';
import { LANGUAGE_OPTION_LIST } from 'commons/options';
import {
  clearLocalStorageTokey,
  LOGIN_PAGE,
  MOBILE_BREAKPOINT,
  setLocalStorageFirstPage,
  setLocalStorageLanguage,
} from 'commons';
import Avatar from 'react-avatar';
import PopoverList from 'components/popover-list';
import { checkRouteRight, getFirstMenuPath, useMenuItems } from 'commons/menus';
import LOCALS from 'commons/locals';
import useIsMobile from 'commons/hooks/useIsMobile';
import { getSysUserSimpleList } from 'apis/sys';
import CurrentShop from 'components/current-shop';
import PosPrinterInfo from 'components/pos-printer-info';
import classNames from 'classnames';
import Scrollbars from 'react-custom-scrollbars-2';

const XiaomaLayout = () => {
  const { i18n } = useTranslation();
  const isMobile = useIsMobile();
  const userInfo = useSelector(selectUserInfo);
  const globalInfo = useSelector(selectGlobalInfo);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const menuItems = useMenuItems();
  // 移动端默认收起菜单
  const [collapsed, setCollapsed] = useState(
    window.innerWidth < MOBILE_BREAKPOINT ? true : false
  );

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    (async () => {
      const data = await getUserInfo();
      data && dispatch(initUserInfo(data));

      // 下面的代码逻辑必然是用户登录了的情况
      const { data: sysUserList } = await getSysUserSimpleList();

      dispatch(
        setStaffSelectOptions(
          sysUserList.map(({ id, nickName, shop }) => ({
            value: id,
            label: nickName,
            shop,
          }))
        )
      );
    })();
  }, [dispatch]);

  // 校验权限
  useEffect(() => {
    const haveRight = checkRouteRight(
      userInfo.isLoading,
      userInfo.menus,
      pathname
    );
    if (!haveRight) {
      const firstMenuPath = getFirstMenuPath(menuItems);
      // 如果这个人完全没有菜单权限，则跳回登录页面
      if (!firstMenuPath) {
        window.location.pathname = LOGIN_PAGE;
      } else {
        setLocalStorageFirstPage(userInfo.username, firstMenuPath);
        window.location.pathname = firstMenuPath;
      }
    }
  }, [
    menuItems,
    pathname,
    userInfo.isLoading,
    userInfo.menus,
    userInfo.username,
  ]);

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    dispatch(setLanguage(language));
    setLocalStorageLanguage(language);
    window.location.reload();
  };

  return (
    <Layout>
      <Sider
        // 有点 hack 方法，强制覆盖 antd 的 side 组件的样式，以适配移动端
        // xm-side-menu.scss
        className={classNames(
          collapsed ? 'xm-side xm-side-collapsed' : 'xm-side xm-side-opened',
          styles.Sider
        )}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        {!collapsed && (
          <div
            onClick={() => {
              setCollapsed(!collapsed);
            }}
            className="xl:hidden fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50"
          ></div>
        )}

        <div
          className={styles.logo}
          style={{
            background: `url(${xiaomaLogo}) no-repeat 50%`,
            backgroundSize: collapsed ? '40px 40px' : '100%',
            scale: collapsed ? '1.7' : '0.8',
          }}
        ></div>
        <Scrollbars style={{ height: '88%' }} autoHide>
          <Menu
            onClick={({ key }) => {
              if (isMobile) {
                setCollapsed(true);
              }
              navigate(key);
            }}
            theme="dark"
            mode="inline"
            selectedKeys={[pathname]}
            // @ts-ignore
            items={menuItems}
          />
        </Scrollbars>
      </Sider>
      <Layout
        style={{
          display: 'block',
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Header
          className={styles.header}
          style={{ background: colorBgContainer }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: styles.trigger,
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className={styles.headerRight}>
            <div className="text-xs mr-2 flex gap-1 items-center lg:text-sm lg:gap-2">
              <PosPrinterInfo />
              <div>{userInfo.nickName}</div>
              <div>
                <CurrentShop />
              </div>
            </div>
            <Select
              size="small"
              style={{ width: 100, marginRight: 6 }}
              value={globalInfo.language}
              options={LANGUAGE_OPTION_LIST}
              onChange={handleLanguageChange}
            />
            <PopoverList
              list={[
                {
                  label: <Trans i18nKey={LOCALS.log_out} />,
                  onClick: () => {
                    window.location.href = LOGIN_PAGE;
                    clearLocalStorageTokey();
                  },
                },
              ]}
            >
              <Avatar
                style={{
                  cursor: 'pointer',
                }}
                name={userInfo.username}
                size="36"
                round
              />
            </PopoverList>
          </div>
        </Header>
        <Content
          className={styles.content}
          style={{
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default XiaomaLayout;
