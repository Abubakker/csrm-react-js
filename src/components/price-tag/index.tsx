import React, {
  useRef,
  useEffect,
  memo,
  useCallback,
  CSSProperties,
  useMemo,
} from 'react';
import './index.module.scss';
import JsBarcode from 'jsbarcode';
import { PriceTagInfo, currencyMap } from 'types/pms';
import 'styles/font.css';
import { LangageAttribute } from 'constant/pms';
import { ReplaceAll } from 'utils/handleObject';
import { useDrag } from 'react-dnd';
import dayjs from 'dayjs';

interface Props {
  data: PriceTagInfo;
  size?: 'default' | 'large';
  type?: string;
  isDropped?: boolean;
  isRef?: boolean;
  style?: CSSProperties;
  setDragging?: (data: boolean) => void;
}

const PriceTag = ({
  data = {},
  size = 'default',
  type,
  isRef,
  style,
  setDragging,
}: Props) => {
  const barCodeRef = useRef(null);

  useEffect(() => {
    if (data && barCodeRef.current) {
      const options = {
        fontSize: 12,
        height: 50,
      };
      JsBarcode(barCodeRef.current, data?.productSn || '88888888', options);
    }
  }, [data, size]);

  // 不同语言用不通字体
  const getFontClass = useCallback(() => {
    if (data.productSn) {
      if (`${data.shopId}` === '1') {
        return 'font-Hiragino';
      } else {
        return 'font-Georgia';
      }
    }
  }, [data]);

  const [{ opacity, isDragging }, drag]: any = useDrag(
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
    const time = dayjs(data.createTime);
    const DD = time.format('DD');
    return `${time.format('MM')}${DD[0]}-${DD[1]}${time.format(
      'YY'
    )}${data.costPrice?.toString().split('').reverse().join('')}`;
  }, [data.createTime, data.costPrice]);

  return (
    <div
      ref={isRef ? drag : null}
      className={'PriceTag'}
      style={{ zoom: size === 'large' ? 2 : 1, opacity, ...style }}
      data-testid="box"
    >
      {data && data.shopId ? (
        <>
          {/* 固定区域 */}
          <div className={'Hermes'}>Hermès</div>
          {/* 标题 */}
          <div className={'title'}>
            <div className={`${getFontClass()} title_text`}>
              {data.name || '-'}
            </div>
          </div>
          {/* 小标题 */}
          <div className={'subtitle'}>{data.rank || '-'}</div>
          {/* 信息展示 */}
          <div className={'info'}>
            <div className={'infoWarp'}>
              {/* 材质 */}
              <div className={'items'}>
                <div className={'label'}>
                  {LangageAttribute.material[(data?.shopId as number) || 1]}:{' '}
                  <span className="span">
                    {ReplaceAll(data.material as string) || '-'}
                  </span>
                </div>
              </div>
              {/* 颜色 */}
              <div className={'items'}>
                <div className={'label'}>
                  {LangageAttribute.color[(data?.shopId as number) || 1]}:{' '}
                  <span className="span">
                    {ReplaceAll(data.color as string) || '-'}
                  </span>
                </div>
              </div>
              {/* 金属 */}
              <div className={'items'}>
                <div className={'label'}>
                  {LangageAttribute.hardware[(data?.shopId as number) || 1]}:{' '}
                  <span className="span">
                    {ReplaceAll(data.hardware as string) || '-'}
                  </span>
                </div>
              </div>
              {/* 刻印 */}
              <div className={'items'}>
                <div className={'label'}>
                  {LangageAttribute.stamp[(data?.shopId as number) || 1]}:{' '}
                  <span className="span">
                    {ReplaceAll(data.stamp as string) || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* 价格 */}
          <div className={'price'}>
            <div className={'priceWarp'}>
              <div className={'value'}>
                {currencyMap[`${data.shopId}`]}
                &nbsp;
                {data.price?.toLocaleString() || '0'}
              </div>
              {`${data.shopId}` === '1' && <div className={'tax'}>(税込)</div>}
            </div>
          </div>
          {/* 条形码 */}
          <div className={'barCode'}>
            <svg
              ref={barCodeRef}
              width={200}
              height={100}
              style={{ width: 200, height: 100 }}
            />
          </div>
          {/* mmd-dyy{price in opposite} */}
          <div className={'price_date'}>{getDatePrice}</div>
          {/* 底部补充 */}
          <div className={'footer'}>
            <div className={'left'}>{data.sourceType === 1 && 'C'}</div>
            <div className={'right'}>{data.salesCode || '-'}</div>
          </div>
        </>
      ) : null}
    </div>
  );
};
export default memo(PriceTag);
