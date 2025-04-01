import {
  useRef,
  useEffect,
  memo,
  CSSProperties,
  useMemo,
  useState,
} from 'react';
import JsBarcode from 'jsbarcode';
import { PriceTagInfo } from 'types/pms';
import { LangageAttribute } from 'constant/pms';
import { ReplaceAll } from 'utils/handleObject';
import { useDrag } from 'react-dnd';
import dayjs from 'dayjs';
import classNames from 'classnames';
import useBrandList from 'commons/hooks/use-brand-list';
import { findLabelByValue } from 'commons/options';
import i18n from 'i18n';
import { CURRENCY_MAP } from 'commons/options';
import { Form, Input, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import { priceToWithoutTax } from 'utils/price-change';

interface Props {
  data: PriceTagInfo;
  size?: 'default' | 'large';
  type?: string;
  isDropped?: boolean;
  isRef?: boolean;
  style?: CSSProperties;
  setDragging?: (data: boolean) => void;
  parentDragging: boolean;
}

const ItemClass =
  'w-full text-[6pt] leading-[8pt] font-light tracking-normal inline-flex flex-row overflow-hidden box-border';
const ItemLabelClass = 'font-HiraginoMinchoPron box-border text-black';
const ItemLabelSpanClass =
  'text-black font-HiraginoMinchoPron text-justify box-border';

const PriceTag = ({
  data = {},
  size = 'default',
  type,
  isRef,
  setDragging,
}: Props) => {
  const barCodeRef = useRef(null);
  const { BrandList, DefaultBrand } = useBrandList();
  const [dataSource, setDataSource] = useState<PriceTagInfo>(data);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDataSource(data);
  }, [data]);

  useEffect(() => {
    if (dataSource && barCodeRef.current) {
      const options = {
        height: 50,
        displayValue: false,
      };
      JsBarcode(barCodeRef.current, dataSource?.id || '88888888', options);
    }
  }, [dataSource, size]);

  const [{ isDragging }, drag]: any = useDrag(
    () =>
      ({
        type,
        item: { ...data },
        collect: (monitor: { isDragging: () => any }) => ({
          opacity: monitor.isDragging() ? 0.4 : 1,
          isDragging: monitor.isDragging(),
        }),
        end: (item: { name: any }, monitor: { getDropResult: () => any }) => {
          const dropResult = monitor.getDropResult();
          if (item && dropResult) {
            console.log(`You dropped ${item.name}`);
          }
        },
      } as any),
    [type]
  );

  /** 拖拽中，抛出上层做处理 */
  useEffect(() => {
    if (setDragging) setDragging(isDragging);
  }, [isDragging, setDragging]);

  const getDatePrice = useMemo(() => {
    let out = '';
    if (dataSource.createTime) {
      const time = dayjs(dataSource.createTime);
      const DD = time.format('DD');
      out = `${time.format('MM')}${DD[0]}-${DD[1]}${time.format('YY')}`;
    }

    if (dataSource.costPrice) {
      out = `${out}${dataSource.costPrice
        .toString()
        .split('')
        .reverse()
        .join('')}`;
    }

    return out;
  }, [dataSource.createTime, dataSource.costPrice]);

  // 价格符号
  const currencySymbol = useMemo(() => {
    if (dataSource?.currency === CURRENCY_MAP.HKD) {
      return 'HK$';
    } else if (dataSource?.currency === CURRENCY_MAP.SGD) {
      return 'SG$';
    } else {
      return '￥';
    }
  }, [dataSource?.currency]);

  return (
    <div
      ref={isRef ? drag : null}
      data-testid="box"
      className="text-black grid gap-[6px] text-xs leading-none"
    >
      {!!dataSource && !!dataSource.shopId ? (
        <>
          <div>
            <div
              className={classNames(
                'font-Georgia font-bold tracking-normal text-center uppercase text-sm'
              )}
            >
              {findLabelByValue(dataSource.brandName, BrandList, DefaultBrand)}
            </div>

            {/* 标题 */}
            <div className="font-Georgia font-bold break-words text-center leading-none mx-[6pt]">
              {dataSource.name || '-'}
            </div>
          </div>

          {/* 信息展示 */}
          <div className="mx-[8pt] box-border flex justify-center">
            <div className="inline-flex flex-col box-border gap-1">
              {/* rank */}
              <div className="font-HiraginoMinchoPron text-[6pt] font-normal tracking-normal text-center">
                {dataSource.rank || '-'}
              </div>
              {/* 材质 */}
              {dataSource.material && (
                <div className={ItemClass}>
                  <div
                    className={ItemLabelClass}
                    style={{ display: 'flex', alignItems: 'flex-start' }}
                  >
                    <span style={{ whiteSpace: 'nowrap' }}>
                      {
                        LangageAttribute.material[
                          (dataSource?.shopId as number) || 1
                        ]
                      }
                      :
                    </span>
                    <div style={{ marginLeft: '2px' }}>
                      {(dataSource.material || '-')
                        .split(',')
                        .map((item, index) => (
                          <div key={index} style={{ lineHeight: '1.3' }}>
                            {ReplaceAll(item as string) || '-'}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
              {/* 颜色 */}
              {dataSource.color && (
                <div className={ItemClass}>
                  <div className={ItemLabelClass}>
                    {
                      LangageAttribute.color[
                        (dataSource?.shopId as number) || 1
                      ]
                    }
                    :{' '}
                    <span className={ItemLabelSpanClass}>
                      {ReplaceAll(dataSource.color as string) || '-'}
                    </span>
                  </div>
                </div>
              )}
              {/* 金属 */}
              {dataSource.hardware && (
                <div className={ItemClass}>
                  <div className={ItemLabelClass}>
                    {
                      LangageAttribute.hardware[
                        (dataSource?.shopId as number) || 1
                      ]
                    }
                    :{' '}
                    <span className={ItemLabelSpanClass}>
                      {ReplaceAll(dataSource.hardware as string) || '-'}
                    </span>
                  </div>
                </div>
              )}
              {/* 刻印 */}
              {dataSource.stamp && (
                <div className={ItemClass} style={{ marginBottom: 0 }}>
                  <div className={ItemLabelClass}>
                    {
                      LangageAttribute.stamp[
                        (dataSource?.shopId as number) || 1
                      ]
                    }
                    :{' '}
                    <span className={ItemLabelSpanClass}>
                      {ReplaceAll(dataSource.stamp as string) || '-'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 价格 */}
          <div className="text-center box-border">
            <div className="inline-flex flex-col box-border">
              {dataSource.referencePrice ? (
                <div className="font-HiraginoMinchoPron text-[6pt] tracking-normal w-full text-center mb-1">
                  {i18n.t('reference_price')}: {currencySymbol}
                  {dataSource.referencePrice?.toLocaleString() || '0'}
                </div>
              ) : null}
              <div className="font-HiraginoMinchoPron text-[11pt] font-bold tracking-normal text-center">
                {dataSource.currency}
                &nbsp;
                {dataSource.currency === CURRENCY_MAP.JPY
                  ? priceToWithoutTax(dataSource.price || 0).toLocaleString()
                  : dataSource.price?.toLocaleString() || '0'}
              </div>
              {`${dataSource.shopId}` === '1' && (
                <div className="inline-flex justify-center mt-1 font-HiraginoMinchoPron text-center text-[6pt] font-bold tracking-normal">
                  <div>
                    {dataSource.currency}
                    &nbsp;
                    {dataSource.price?.toLocaleString() || '0'}
                  </div>
                  <div>(税込)</div>
                </div>
              )}
            </div>
          </div>

          <div>
            {/* 条形码 */}
            <div className="flex justify-center box-border">
              <svg
                className="h-[28pt] box-border max-w-full"
                ref={barCodeRef}
              />
            </div>

            <div className="grid gap-1">
              {/* mmd-dyy{price in opposite} */}
              {!!getDatePrice && (
                <div className="text-center text-[6pt] leading-none">
                  {getDatePrice}
                </div>
              )}

              <div className="text-center text-[8pt] leading-none">
                {dataSource.id}
              </div>

              {dataSource.sourceType === 1 && (
                <div className="font-HiraginoMinchoPron text-[6pt] text-right pr-4">
                  C
                </div>
              )}
            </div>
          </div>

          <EditOutlined
            className={classNames(
              styles.editBtn,
              'text-[24px] text-[#4096ff] cursor-pointer absolute left-0 top-0'
            )}
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
        </>
      ) : null}

      <Modal
        open={open}
        title={i18n.t('edit')}
        onCancel={() => setOpen(false)}
        onOk={() => {
          const values = form.getFieldsValue();
          const currData = { ...data, ...values };
          setDataSource(currData);
          // 保存到localStorage
          const tempList: PriceTagInfo[] = JSON.parse(
            localStorage.getItem('price-tag') || '[]'
          );
          const index = tempList.findIndex((d) => d.id === dataSource.id);
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
    </div>
  );
};
export default memo(PriceTag);
