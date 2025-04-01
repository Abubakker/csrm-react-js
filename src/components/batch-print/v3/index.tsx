import { useState, useEffect } from 'react';
import { Button } from 'antd';
import PriceTag from 'components/price-tag/v3';
import { PriceTagInfo } from 'types/pms';
import i18n from 'i18n';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// https://react-dnd.github.io/react-dnd/examples/dustbin/multiple-targets
import Container from 'components/price-tag/v3/container';
import lodash from 'lodash';
import classNames from 'classnames';
import styles from './index.module.scss';

const PrintLabel = () => {
  const [state, setState] = useState<PriceTagInfo[]>([]);
  const [isDragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('price-tag') || '[]');
    setState(data);
  }, []);

  useEffect(() => {
    localStorage.setItem('printData', JSON.stringify(state));
  }, [state]);

  /** 拖动数据处理 */
  const handleDropNew = (
    item: PriceTagInfo,
    index: number,
    data: PriceTagInfo
  ) => {
    // console.log('🚀  目标容器:', item);
    // console.log('🚀  目标容器-下标:', index);
    const currIndex: number = state.findIndex((d) => d.id === data.id);
    // console.log('🚀  当前容器:', data);
    // console.log('🚀  当前容器-下标:', currIndex);
    const list = lodash.clone(state);
    list[index] = data;
    list[currIndex] = item;
    setState(list);
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <div
        // 纸张型号 KPC-E1241-20 https://www.kokuyo-st.co.jp/stationery/hakadorilabel/kyoutsuu/
        className={classNames(
          'w-[29.7cm] h-[21cm] bg-white relative box-border px-[12.9mm]',
          styles.printElement
        )}
      >
        <div
          className={classNames(
            'h-full box-border grid grid-cols-8 grid-rows-3 gap-0 border border-black border-t-0 border-l-0',
            styles.noBorder
          )}
        >
          <DndProvider backend={HTML5Backend}>
            {state.map((item, index) => {
              return (
                <Container
                  accept={['CONTENT']} // 允许拖入的类型
                  data={item}
                  onDrop={(data) => {
                    handleDropNew(item, index, data);
                  }}
                  key={index}
                  className={styles.noBorder}
                >
                  <PriceTag
                    key={item.id}
                    parentDragging={isDragging}
                    data={item}
                    isRef={true}
                    type={item.productSn ? 'CONTENT' : ''} // 拖入的类型
                    isDropped={false}
                    setDragging={setDragging}
                  />
                </Container>
              );
            })}
          </DndProvider>
        </div>
      </div>

      <div className={classNames(styles.hideElement)}>
        <Button
          type="primary"
          onClick={() => {
            window.print();
          }}
        >
          {i18n.t('print')}
        </Button>
      </div>
    </div>
  );
};
export default PrintLabel;
