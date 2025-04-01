import React, { useEffect, useMemo, useState } from 'react';
import { Button, Radio, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { OrdersSummaryResponse } from '../../types/sys';
import { getSysSummary } from '../../apis/fms';
import * as XLSX from 'xlsx';
import { SHOP_MAP } from '../../commons/options';
import { Trans } from 'react-i18next';
import LOCALS from '../../commons/locals';

const SystemSummary = () => {
  const formatNumber = (value: string | number) => {
    if (!value) return '0';
    // 将字符串转为数字，去除小数部分，然后添加千分位
    return Number(value)
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OrdersSummaryResponse | null>(null);
  const [selectedShopId, setSelectedShopId] = useState(SHOP_MAP.GINZA);
  const shopOptionList = useMemo(() => {
    return [
      {
        value: SHOP_MAP.GINZA,
        label: <Trans i18nKey={LOCALS.ginza_shop} />,
      },
      {
        value: SHOP_MAP.HONGKONG,
        label: <Trans i18nKey={LOCALS.hongkong_shop} />,
      },
      {
        value: SHOP_MAP.SINGAPORE,
        label: <Trans i18nKey={LOCALS.singapore_shop} />,
      },
    ];
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedShopId]);

  // 在 fetchData 中使用
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getSysSummary(selectedShopId);
      setData(response);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  // 导出Excel函数
  const exportToExcel = () => {
    if (!data) return;

    // 创建工作簿
    const wb = XLSX.utils.book_new();

    // 处理第一个表格数据 - 实績表
    const performanceData = data.orderSummaries.map((item) => {
      return {
        期间: item.month,
        買取点数: formatNumber(item.recyclingCount),
        買取仕入れ額: formatNumber(item.recyclingCost),
        '買取仕入れ額(税抜)': formatNumber(item.recyclingCostWithoutTax),
        買取売価: formatNumber(item.recyclingSales),
        買取粗利: formatNumber(item.recyclingProfit),
        委託点数: formatNumber(item.consignmentCount),
        委託預かり額: formatNumber(item.consignmentCost),
        '委託預かり額(税抜)': formatNumber(item.consignmentCostWithoutTax),
        委託売価: formatNumber(item.consignmentSales),
        委託粗利: formatNumber(item.consignmentProfit),
        業者仕入点数: formatNumber(item.procurementCount),
        業者仕入れ額: formatNumber(item.procurementCost),
        '業者仕入れ額(税抜)': formatNumber(item.procurementCostWithoutTax),
        業者仕入粗利: formatNumber(item.procurementProfit),
        ポイント付与: formatNumber(item.totalIntegration),
        ポイント使用: formatNumber(item.totalUseIntegration),
        SNS値引き: formatNumber(item.totalPromotionAmount),
        トータル売上: formatNumber(item.totalPayAmount),
        トータル仕入れ: formatNumber(item.totalCost),
        'トータル仕入れ(税抜)': formatNumber(item.totalCostWithoutTax),
        トータル粗利: formatNumber(item.grossProfit),
      };
    });

    // 处理第二个表格数据 - 買取委託実績表
    const recycleData = data.omsRecycleOrderSummaries.map((item) => {
      return {
        期间: item.month,
        買取点数: formatNumber(item.recycleCount),
        買取仕入れ額: formatNumber(item.totalRecyclePrice),
        '買取仕入れ額(税抜)': formatNumber(item.totalRecyclePriceWithoutTax),
        委託点数: formatNumber(item.saleCount),
        委託仕入れ額: formatNumber(item.totalSalePrice),
        '委託仕入れ額(税抜)': formatNumber(item.totalSalePriceWithoutTax),
      };
    });

    // 创建工作表并添加到工作簿
    const ws1 = XLSX.utils.json_to_sheet(performanceData);
    const ws2 = XLSX.utils.json_to_sheet(recycleData);

    XLSX.utils.book_append_sheet(wb, ws1, '実績表');
    XLSX.utils.book_append_sheet(wb, ws2, '買取委託実績表');

    // 导出Excel文件
    XLSX.writeFile(
      wb,
      `システム実績表_${new Date().toISOString().split('T')[0]}.xlsx`,
    );
  };

  const orderColumns: ColumnsType<OrdersSummaryResponse['orderSummaries'][0]> =
    useMemo(
      () => [
        {
          title: '期间',
          dataIndex: 'month',
          key: 'month',
        },
        {
          title: '買取点数',
          dataIndex: 'recyclingCount',
          key: 'recyclingCount',
        },
        {
          title: '買取仕入れ額',
          dataIndex: 'recyclingCost',
          key: 'recyclingCost',
          render: formatNumber,
        },
        {
          title: '買取仕入れ額(税抜)',
          dataIndex: 'recyclingCostWithoutTax',
          key: 'recyclingCostWithoutTax',
          render: formatNumber,
        },
        {
          title: '買取売価',
          dataIndex: 'recyclingSales',
          key: 'recyclingSales',
          render: formatNumber,
        },
        {
          title: '買取粗利',
          dataIndex: 'recyclingProfit',
          key: 'recyclingProfit',
          render: formatNumber,
        },
        {
          title: '委託点数',
          dataIndex: 'consignmentCount',
          key: 'consignmentCount',
        },
        {
          title: '委託預かり額',
          dataIndex: 'consignmentCost',
          key: 'consignmentCost',
          render: formatNumber,
        },

        {
          title: '委託預かり額(税抜)',
          dataIndex: 'consignmentCostWithoutTax',
          key: 'consignmentCostWithoutTax',
          render: formatNumber,
        },
        {
          title: '委託売価',
          dataIndex: 'consignmentSales',
          key: 'consignmentSales',
          render: formatNumber,
        },
        {
          title: '委託粗利',
          dataIndex: 'consignmentProfit',
          key: 'consignmentProfit',
          render: formatNumber,
        },

        {
          title: '業者仕入点数',
          dataIndex: 'procurementCount',
          key: 'procurementCount',
        },
        {
          title: '業者仕入れ額',
          dataIndex: 'procurementCost',
          key: 'procurementCost',
          render: formatNumber,
        },
        {
          title: '業者仕入れ額(税抜)',
          dataIndex: 'procurementCostWithoutTax',
          key: 'procurementCostWithoutTax',
          render: formatNumber,
        },

        {
          title: '業者仕入粗利',
          dataIndex: 'procurementProfit',
          key: 'procurementProfit',
          render: formatNumber,
        },
        {
          title: 'ポイント付与',
          dataIndex: 'totalIntegration',
          key: 'totalIntegration',
          render: formatNumber,
        },
        {
          title: 'ポイント使用',
          dataIndex: 'totalUseIntegration',
          key: 'totalUseIntegration',
          render: formatNumber,
        },
        {
          title: 'SNS値引き',
          dataIndex: 'totalPromotionAmount',
          key: 'totalPromotionAmount',
          render: formatNumber,
        },
        {
          title: 'トータル売上',
          dataIndex: 'totalPayAmount',
          key: 'totalPayAmount',
          render: formatNumber,
        },
        {
          title: 'トータル仕入れ',
          dataIndex: 'totalCost',
          key: 'totalCost',
          render: formatNumber,
        },
        {
          title: 'トータル仕入れ(税抜)',
          dataIndex: 'totalCostWithoutTax',
          key: 'totalCostWithoutTax',
          render: formatNumber,
        },
        {
          title: 'トータル粗利',
          dataIndex: 'grossProfit',
          key: 'grossProfit',
          render: formatNumber,
        },
      ],
      [],
    );
  const recycleColumns: ColumnsType<
    OrdersSummaryResponse['omsRecycleOrderSummaries'][0]
  > = useMemo(
    () => [
      {
        title: '期间',
        dataIndex: 'month',
        key: 'month',
      },
      {
        title: '買取点数',
        dataIndex: 'recycleCount',
        key: 'recycleCount',
      },
      {
        title: '買取仕入れ額',
        dataIndex: 'totalRecyclePrice',
        key: 'totalRecyclePrice',
        render: formatNumber,
      },
      {
        title: '買取仕入れ額(税抜)',
        dataIndex: 'totalRecyclePriceWithoutTax',
        key: 'totalRecyclePriceWithoutTax',
        render: formatNumber,
      },
      {
        title: '委託点数',
        dataIndex: 'saleCount',
        key: 'saleCount',
      },
      {
        title: '委託仕入れ額',
        dataIndex: 'totalSalePrice',
        key: 'totalSalePrice',
        render: formatNumber,
      },

      {
        title: '委託仕入れ額(税抜)',
        dataIndex: 'totalSalePriceWithoutTax',
        key: 'totalSalePriceWithoutTax',
        render: formatNumber,
      },
    ],
    [],
  );

  return (
    <div className="p-6">
      {/* 添加店铺选择按钮组 */}
      <div className="flex justify-center mb-8">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          options={shopOptionList}
          value={selectedShopId}
          onChange={(e) => {
            setSelectedShopId(e.target.value);
          }}
        />
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">実績表</h2>
          <Button type="primary" onClick={exportToExcel} disabled={!data}>
            Excelエクスポート
          </Button>
        </div>
        <Table
          loading={loading}
          columns={orderColumns}
          dataSource={data?.orderSummaries}
          rowKey="month"
          pagination={false}
          scroll={{ x: 'max-content' }}
          bordered
        />
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">買取委託実績表</h2>
        <Table
          loading={loading}
          columns={recycleColumns}
          dataSource={data?.omsRecycleOrderSummaries}
          rowKey="month"
          pagination={false}
        />
      </div>
    </div>
  );
};

export default SystemSummary;
