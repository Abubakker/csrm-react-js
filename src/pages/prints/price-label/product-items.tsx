import { useEffect, useMemo, useState } from 'react';
import XiaoMaLogoSvg from 'components/xiao-ma-logo-svg';
import { Form, Input, Modal, QRCode } from 'antd';
import { CURRENCY_ENUM, PriceTagInfo } from 'types/pms';
import { thousands } from 'utils/tools';
import { EditOutlined } from '@ant-design/icons';
import i18n from 'i18n';
import styles from './index.module.scss';
import classNames from 'classnames';
import { priceToWithoutTax } from 'utils/price-change';

const PrintLabelProductItems = ({
  index,
  dataSourceList,
}: {
  index: number;
  dataSourceList: PriceTagInfo[];
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [dataSource, setDataSource] = useState<PriceTagInfo>(
    dataSourceList[index]
  );

  const priceItem = useMemo(() => {
    if (!dataSource.price) return;
    return {
      price: dataSource.price,
      priceWithoutTax: priceToWithoutTax(dataSource.price),
    };
  }, [dataSource.price]);

  useEffect(() => {
    setDataSource(dataSourceList[index]);
  }, [dataSourceList, index]);

  const rankDisplayText = () => {
    const { rank } = dataSource;
    if (rank === 'N') {
      return 'Brand New';
    } else if (rank === 'NS') {
      return 'Unused';
    } else {
      return 'Used';
    }
  };

  return (
    <>
      <div className="font-HiraginoMinchoPron w-[91mm] h-[54mm] border relative flex flex-col justify-between">
        <div className={classNames('absolute left-0 top-0', styles.editBtn)}>
          <EditOutlined
            className="text-[24px] text-[#4096ff] cursor-pointer"
            onClick={() => {
              setOpen(true);
              form.setFieldsValue({
                name: dataSource.name,
                material: dataSource.material,
                color: dataSource.color,
                stamp: dataSource.stamp,
                hardware: dataSource.hardware,
              });
            }}
          />
        </div>
        <div className="text-[#8f894f] text-[16pt] text-center underline">
          {rankDisplayText()}
        </div>
        <div className="text-[10pt] text-center">
          {dataSource.name}（{dataSource.id}）
        </div>
        <div className="text-[10pt] text-center">
          <span className="mr-[12pt]">{dataSource.material}</span>
          <span>{dataSource.color}</span>
        </div>
        <div className="text-[10pt] text-center">
          <span className="mr-[12pt]">{dataSource.stamp}</span>
          <span>{dataSource.hardware}</span>
        </div>

        {dataSource.currency === CURRENCY_ENUM.JPY ? (
          <>
            <div className="text-[18pt] text-center">
              ¥ {thousands(priceItem?.priceWithoutTax)}
            </div>

            <div className="text-[12pt] text-center relative">
              ¥ {thousands(priceItem?.price)}
              <div className="text-[8pt]">(Tax included)</div>
            </div>
          </>
        ) : (
          <div className="text-[18pt] text-center">
            {dataSource.currency} {thousands(priceItem?.price)}
          </div>
        )}

        <div className="text-center" style={{ zoom: 0.4 }}>
          <XiaoMaLogoSvg />
        </div>
        <div className="absolute left-[-6pt] bottom-[-6pt]">
          <QRCode
            size={100}
            bordered={false}
            value={`https://ginzaxiaoma.com/`}
          />
        </div>
      </div>

      <Modal
        open={open}
        title={i18n.t('edit')}
        onCancel={() => setOpen(false)}
        onOk={() => {
          const values = form.getFieldsValue();
          const currData = { ...dataSource, ...values };
          setDataSource(currData);
          // 保存到localStorage
          const tempList = [...dataSourceList];
          tempList[index] = currData;
          localStorage.setItem('price-label', JSON.stringify(tempList));
          setOpen(false);
        }}
      >
        <Form form={form} labelCol={{ span: 6 }}>
          <Form.Item name="name" label={i18n.t('product_name')}>
            <Input />
          </Form.Item>
          <Form.Item name="material" label={i18n.t('material')}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="color" label={i18n.t('color')}>
            <Input />
          </Form.Item>
          <Form.Item name="stamp" label={i18n.t('stamp')}>
            <Input />
          </Form.Item>
          <Form.Item name="hardware" label={i18n.t('hardware')}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default PrintLabelProductItems;
