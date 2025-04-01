import React from 'react';
import { Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { CASH_LOG_TYPE_MAP, SHOP_MAP } from 'commons/options';
import type { FmsShopCashLog } from 'types/fms';
import i18n from 'i18n';
import LOCALS from 'commons/locals';

interface ShopCashExportCsvProps {
  onFetchData: (params: { pageSize: number; pageNum: number }) => Promise<{
    list: FmsShopCashLog[];
    total: number;
  }>;
  loading: boolean;
  currency?: string;
  disabled?: boolean;
}

const ShopCashExportCsv: React.FC<ShopCashExportCsvProps> = ({
  onFetchData,
  loading,
  currency,
  disabled = false,
}) => {
  // 获取店铺名称
  const getShopName = (shopId: number): string => {
    switch (shopId) {
      case SHOP_MAP.GINZA:
        return i18n.t(LOCALS.ginza_shop);
      case SHOP_MAP.HONGKONG:
        return i18n.t(LOCALS.hongkong_shop);
      case SHOP_MAP.SINGAPORE:
        return i18n.t(LOCALS.singapore_shop);
      default:
        return '';
    }
  };

  const handleExport = async () => {
    try {
      // 获取所有数据(不分页)
      const data = await onFetchData({
        pageSize: 5000,
        pageNum: 1,
      });

      if (!data?.list?.length) {
        message.warning('エクスポートデータが空です');
        return;
      }

      // 定义CSV表头
      const headers = [
        '店舗',
        '変動前',
        '変動金額',
        '変動後',
        '分類',
        'オペレーター',
        '更新時間',
        '備考',
      ];

      // 将数据转换为CSV格式
      const rows = data.list.map((record) => {
        // 安全地获取类型文字
        const getTypeText = (type: number | null | undefined): string => {
          if (typeof type === 'number' && type in CASH_LOG_TYPE_MAP) {
            return CASH_LOG_TYPE_MAP[type];
          }
          return '-';
        };

        return [
          getShopName(record.shopId),
          record.balanceBefore.toLocaleString('en-US'),
          `${record.amount > 0 ? '+' : '-'}${Math.abs(record.amount).toLocaleString('en-US')}`,
          record.balanceAfter.toLocaleString('en-US'),
          getTypeText(record.type),
          record.createdBy || '',
          dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss'),
          record.note?.replace(/<[^>]+>/g, '') || '', // 移除HTML标签
        ];
      });

      // 组合CSV内容
      const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
          row
            .map((cell) => {
              // 处理包含逗号、换行符或引号的单元格
              const cellStr = String(cell);
              if (
                cellStr.includes(',') ||
                cellStr.includes('\n') ||
                cellStr.includes('"')
              ) {
                return `"${cellStr.replace(/"/g, '""')}"`;
              }
              return cellStr;
            })
            .join(','),
        ),
      ].join('\n');

      // 创建Blob对象并下载
      const blob = new Blob(['\ufeff' + csvContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `店舗金額管理_${currency || ''}_${dayjs().format('YYYYMMDD_HHmm')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success('エクスポート成功');
    } catch (error) {
      console.error('Export failed:', error);
      message.error('エクスポート失敗');
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || loading}
      icon={<DownloadOutlined />}
    >
      CSVエクスポート
    </Button>
  );
};

export default ShopCashExportCsv;
