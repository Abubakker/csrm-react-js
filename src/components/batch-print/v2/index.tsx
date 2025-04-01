import React, { useState, useEffect, CSSProperties } from 'react';
import styles from './index.module.scss';
import { Button, Space } from 'antd';
import PriceTag from 'components/price-tag';
import { PrintInnerHTML } from 'components/price-tag/utils';
import { PriceTagInfo } from 'types/pms';
import i18n from 'i18n';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// https://react-dnd.github.io/react-dnd/examples/dustbin/multiple-targets
import Container from 'components/price-tag/container';
import lodash from 'lodash';
import LOCALS from '../../../commons/locals';

const PrintLabel = () => {
  const [state, setState] = useState<PriceTagInfo[]>([]);
  const [isDragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('printData') || '[]');
    setState(data);
  }, []);

  useEffect(() => {
    localStorage.setItem('printData', JSON.stringify(state));
  }, [state]);

  /** 打印 */
  const PrintElement = () => {
    const printContent = document.getElementById('printWarp'); // 打印区域
    window.document.body.innerHTML = PrintInnerHTML(
      printContent?.innerHTML as string
    ); // 追加
    window.print(); // 打印
    window.location.reload(); // 重新加载
  };

  /** 预览 */
  const Preview = () => {
    const printContent = document.getElementById('printWarp'); // 打印区域
    window.document.body.innerHTML = PrintInnerHTML(
      printContent?.innerHTML as string
    ); // 追加
    const html_ = document.documentElement.outerHTML; // 获取整个
    window.open()?.document.write(html_); // 预览
  };

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
    <div className={styles.content} id="content">
      <div className={styles.print} id="printlabel">
        <div className={styles.tip}>
          <div className={styles.subtitle}>{i18n.t(LOCALS.print_prompt)}</div>
          <div className={styles.text}>1、{i18n.t(LOCALS.print_position)}</div>
          <div className={styles.text}>2、{i18n.t(LOCALS.print_settings)}</div>
        </div>
        <div className={styles.printWarp} id="printWarp">
          <DndProvider backend={HTML5Backend}>
            {state.map((item, index) => {
              let PriceTagStyle: CSSProperties = {};
              if (isDragging) PriceTagStyle.transform = 'scale(0.8)';
              return (
                <Container
                  accept={['CONTENT']} // 允许拖入的类型
                  data={item}
                  onDrop={(data) => {
                    handleDropNew(item, index, data);
                  }}
                  key={index}
                >
                  <PriceTag
                    style={PriceTagStyle}
                    key={item.id}
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
      <div className={styles.buttons}>
        <Space>
          <Button onClick={Preview}>{i18n.t('preview')}</Button>
          <Button type="primary" onClick={PrintElement}>
            {i18n.t('print')}
          </Button>
        </Space>
      </div>
    </div>
  );
};
export default PrintLabel;
