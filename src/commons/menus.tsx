import { selectUserInfo, UserInfoState } from 'store/slices/userInfoSlice';
import {
  AccountBookOutlined,
  FileAddOutlined,
  HomeFilled,
  KeyOutlined,
  MailOutlined,
  MoneyCollectOutlined,
  ShoppingOutlined,
  SyncOutlined,
  UnorderedListOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { MdManageHistory } from 'react-icons/md';
import { IoIosNotifications } from 'react-icons/io';
import { Trans } from 'react-i18next';
import { groupBy, sortBy, cloneDeep } from 'lodash-es';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import LOCALS from './locals';
import { LuTicketPercent } from 'react-icons/lu';
import { IoGift } from 'react-icons/io5';
import { FaFacebookMessenger, FaTag } from 'react-icons/fa6';
import { IoCloudOffline, IoShareSocial } from 'react-icons/io5';
import { AiFillMessage } from 'react-icons/ai';
import { IoIosSettings } from 'react-icons/io';

export type MenuConfigItem = {
  path: string;
  key?: string;
  icon: JSX.Element;
  label: JSX.Element | string;
  children?: MenuConfigItem[];
  sort?: number;
};

// 菜单配置
export const ALL_MENU_CONFIG_ITEMS: MenuConfigItem[] = [
  // 主面板
  {
    path: 'home',
    icon: <HomeFilled />,
    label: <Trans i18nKey={LOCALS.home_page} />,
    sort: 0,
  },
  // 商品
  {
    path: 'pms',
    icon: <ShoppingOutlined />,
    label: <Trans i18nKey={LOCALS.product} />,
    sort: 2,
    children: [
      {
        path: 'product-list', // 商品列表
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.product_list} />,
      },
      {
        path: 'product-list-mobile', // 商品列表
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.product_list_mobile} />,
      },
      {
        path: 'store-transfer',
        icon: <UnorderedListOutlined />,
        label: '跨店调货',
      },
      {
        path: 'stock-taking-list',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.eNxVOVImMN} />,
      },
      // {
      //   path: 'product-add',
      //   icon: <FileAddOutlined />,
      //   label: <Trans i18nKey={LOCALS.product_add} />,
      // },
      // {
      //   path: 'addSalesLink',
      //   icon: <FileAddOutlined />,
      //   label: <Trans i18nKey={LOCALS.add_sales_link} />,
      // },
      // {
      //   path: 'label',
      //   icon: <UnorderedListOutlined />,
      //   label: <Trans i18nKey={LOCALS.LabelList} />,
      // },
      {
        path: 'product-cate',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.product_categories} />,
      },
    ],
  },
  // 订单
  {
    path: 'oms',
    icon: <AccountBookOutlined />,
    label: <Trans i18nKey={LOCALS.order} />,
    sort: 3,
    children: [
      {
        path: 'checkout-counter',
        icon: <FileAddOutlined />,
        label: <Trans i18nKey={LOCALS.checkout_counter} />,
      },
      {
        path: 'order-list',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.order_list} />,
      },
      {
        path: 'order-list-mobile',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.order_list_mobile} />,
      },
      {
        path: 'order-create',
        icon: <FileAddOutlined />,
        label: <Trans i18nKey={LOCALS.create_order} />,
      },
      {
        path: 'wantBook',
        icon: <FileAddOutlined />,
        label: <Trans i18nKey={LOCALS.out_of_stock_registration} />,
      },
      // {
      //   path: 'order-create',
      //   icon: <FileAddOutlined />,
      //   label: <Trans i18nKey={LOCALS.create_order} />,
      // },
    ],
  },
  // 会员
  {
    path: 'ums',
    icon: <UserOutlined />,
    label: <Trans i18nKey={LOCALS.member} />,
    sort: 4,
    children: [
      {
        path: 'member-list',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.member_list} />,
      },
      {
        path: 'member-add',
        icon: <UserAddOutlined />,
        label: <Trans i18nKey={LOCALS.member_sign_up} />,
      },
    ],
  },
  {
    path: 'rrs',
    icon: <SyncOutlined />,
    label: <Trans i18nKey={LOCALS.menu_rrs} />,
    sort: 5,
    children: [
      {
        // 回收寄卖订单列表
        path: 'recycling-consignment-list',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.sell_your_bag_order} />,
      },
      {
        path: 'recycling-contract-order',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.recyclingContractOrder} />,
      },
      {
        path: 'consignment-contract-order',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.consignmentContractOrder} />,
      },
      {
        // 回收寄卖创建意向订单
        path: 'recycling-consignment-intention',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.intentional_order} />,
      },
      {
        // 回收寄卖预约列表
        path: 'appointment-management-list',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.appointment_management_list} />,
      },
      {
        // 回收寄卖预约配置
        path: 'appointment-management-config',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.appointment_management_config} />,
      },
    ],
  },
  {
    path: 'im-chat',
    icon: <IoShareSocial />,
    label: <Trans i18nKey={LOCALS.menu_chat} />,
    sort: 6,
    children: [
      {
        path: 'in-box',
        icon: <AiFillMessage />,
        label: <Trans i18nKey={LOCALS.chat_message} />,
      },
      {
        path: 'user-list',
        icon: <UnorderedListOutlined />,
        label: 'UserList',
      },
      {
        path: 'settings',
        icon: <IoIosSettings />,
        label: <Trans i18nKey={LOCALS.chat_setting} />,
      },
      {
        path: 'offline-response',
        icon: <IoCloudOffline />,
        label: <Trans i18nKey={LOCALS.offline_response_menu} />,
      },
      {
        path: 'messenger-integration',
        icon: <FaFacebookMessenger />,
        label: <Trans i18nKey={LOCALS.messenger_menu} />,
      },
      {
        path: 'tags-management',
        icon: <FaTag />,
        label: <Trans i18nKey={LOCALS.tags_management} />,
      },
    ],
  },
  // 营销
  {
    path: 'sms',
    icon: <SyncOutlined />,
    label: <Trans i18nKey={LOCALS.menu_marketing} />,
    sort: 7,
    children: [
      {
        path: 'ad-list',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.advertisement_list} />,
      },
      {
        path: 'member-mail-template',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.menu_email_template} />,
      },
      {
        path: 'member-mail-send',
        icon: <MailOutlined />,
        label: <Trans i18nKey={LOCALS.menu_send_email} />,
      },
      {
        path: 'coupon-list',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.menu_discount_configuration} />,
      },
      {
        path: 'coupon-history-list',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.menu_coupon_record} />,
      },
      {
        path: 'integral-list',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.pointsMarketing} />,
      },
    ],
  },
  // 内容
  {
    path: 'cms',
    icon: <SyncOutlined />,
    label: <Trans i18nKey={LOCALS.menu_cms} />,
    sort: 8,
    children: [
      {
        path: 'article-list',
        icon: <></>,
        label: <Trans i18nKey={LOCALS.article_list} />,
      },
      {
        path: 'article-category',
        icon: <></>,
        label: <Trans i18nKey={LOCALS.article_category} />,
      },
      {
        path: 'subject-list',
        icon: <></>,
        label: <Trans i18nKey={LOCALS.topic_list} />,
      },
      {
        path: 'subject-category',
        icon: <></>,
        label: <Trans i18nKey={LOCALS.topic_category} />,
      },
    ],
  },
  {
    path: 'fms',
    icon: <KeyOutlined />,
    label: <Trans i18nKey={LOCALS.menu_fms} />,
    sort: 9,
    children: [
      {
        path: 'account-list',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.menu_fms_account} />,
      },
      {
        path: 'shop-cash',
        icon: <MoneyCollectOutlined />,
        label: '店舗現金管理',
      },
      {
        path: 'sys-summary',
        icon: <MoneyCollectOutlined />,
        label: '実績表',
      },
    ],
  },
  {
    path: 'report',
    icon: <SyncOutlined />,
    label: <Trans i18nKey={LOCALS.menu_home} />,
    sort: 1,
    children: [
      {
        path: 'statement',
        icon: <></>,
        label: <Trans i18nKey={LOCALS.nikkei_table} />,
      },
      {
        path: 'attendance',
        icon: <></>,
        label: <Trans i18nKey={LOCALS.attendance} />,
      },
    ],
  },
  // 系统
  {
    path: 'sys',
    icon: <KeyOutlined />,
    label: <Trans i18nKey={LOCALS.system} />,
    sort: 10,
    children: [
      {
        path: 'admin-list',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.account_list} />,
      },
      // {
      //   path: 'seoConfig',
      //   icon: <UnorderedListOutlined />,
      //   label: <Trans i18nKey={LOCALS.menu_seo} />,
      // },
      {
        path: 'menu',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.menu_list} />,
      },
      {
        path: 'resource',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.resource_list} />,
      },
      {
        path: 'role',
        icon: <UnorderedListOutlined />,
        label: <Trans i18nKey={LOCALS.role_list} />,
      },
      {
        path: 'dict',
        icon: <UnorderedListOutlined />,
        label: '数据字典',
      },
    ],
  },
  {
    path: 'crm',
    icon: <MdManageHistory />,
    label: <Trans i18nKey={LOCALS.crm} />,
    sort: 11,
    children: [
      {
        path: 'coupon-management',
        icon: <LuTicketPercent />,
        label: <Trans i18nKey={LOCALS.coupon_management} />,
      },
      {
        path: 'reward',
        icon: <IoGift />,
        label: <Trans i18nKey={LOCALS.reward_management_menu} />,
      },
      {
        path: 'push-notification',
        icon: <IoIosNotifications />,
        label: <Trans i18nKey={LOCALS.push_notification} />,
      },
    ],
  },
  // 订单
  // {
  //   path: 'oms',
  // },
  // // 会员
  // {
  //   path: 'ums',
  // },

  // // 积分
  // {
  //   path: 'pos',
  // },
  // 该路由代码写死 全部用户拥有
  {
    path: 'sop',
    sort: 100,
    icon: <KeyOutlined />,
    label: <Trans i18nKey={LOCALS.sop} />,
  },
];

export const getFilteredMenus = (menus: UserInfoState['menus']) => {
  const filteredMenus: MenuConfigItem[] = [];

  const groupedMenus = groupBy(menus, (menu) => menu.parentId);
  // 获取第一级菜单并排序
  const firstLevelMenus = sortBy(groupedMenus[0] || [], (menu) => {
    return -menu.sort;
  });

  firstLevelMenus.forEach(({ name, id }) => {
    // 查找第一级菜单是否出现在配置里
    const targetMenu = ALL_MENU_CONFIG_ITEMS.find(({ path }) => path === name);
    if (!targetMenu) return;

    const targetMenuCopy = cloneDeep(targetMenu);
    targetMenuCopy.key = `/${targetMenuCopy.path}`;

    // 如果存在 children，还需要过滤 children
    if (targetMenuCopy.children) {
      targetMenuCopy.children = targetMenuCopy.children
        .filter(({ path }) => {
          if (!groupedMenus[id]) return false;

          return !!groupedMenus[id].find(({ name }) => name === path);
        })
        .map((menu) => {
          return {
            ...menu,
            key: `${targetMenuCopy.key}/${menu.path}`,
          };
        });
    }

    // fix: 对于没有二级菜单权限的情况，也不要展示一级菜单
    if (targetMenuCopy.children && targetMenuCopy.children.length === 0) {
      return;
    }

    filteredMenus.push(targetMenuCopy);
  });

  return sortBy(filteredMenus, function (o) {
    return o.sort;
  });
};

// 校验用户路由权限
export const checkRouteRight = (
  isLoading: boolean,
  menus: UserInfoState['menus'],
  pathname: string
): boolean => {
  if (isLoading) return true;

  if (!menus.length) return false;

  const pathnameArr = pathname.split('/').filter((i) => !!i);
  const [firstLevel, secondLevel] = pathnameArr;

  // 一级菜单
  const targetFirstLevelMenu = menus.find((menu) => {
    return menu.level === 0 && menu.name === firstLevel;
  });

  if (!secondLevel) {
    return !!targetFirstLevelMenu;
  }

  const secondLevelMenus = menus.filter((menu) => {
    return menu.parentId === targetFirstLevelMenu?.id;
  });

  // 二级菜单
  const targetSecondLevelMenu = secondLevelMenus.find((menu) => {
    return menu.name === secondLevel;
  });

  return !!targetSecondLevelMenu;
};

export const getFirstMenuPath = (menus: MenuConfigItem[]) => {
  const [firstMenu] = menus;

  if (!firstMenu) return '';

  if (firstMenu.children && firstMenu.children.length) {
    return firstMenu.children[0].key;
  } else {
    return firstMenu.key;
  }
};

// 根据用户信息的 menus 和 ALL_MENU_CONFIG_ITEMS 配置，获取实际最终用来渲染左侧菜单列表的数据
export const useMenuItems = () => {
  const userInfo = useSelector(selectUserInfo);
  const [menuItems, setMenuItems] = useState<MenuConfigItem[]>([]);

  useEffect(() => {
    setMenuItems(getFilteredMenus(userInfo.menus));
  }, [userInfo.menus]);

  return menuItems;
};
