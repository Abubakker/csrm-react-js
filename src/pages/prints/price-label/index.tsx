import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { PriceTagInfo } from 'types/pms';
import i18n from 'i18n';
import classNames from 'classnames';
import styles from './index.module.scss';
import PrintLabelProductItems from './product-items';

const PrintLabel = () => {
  const [state, setState] = useState<PriceTagInfo[]>([]);

  useEffect(() => {
    const data: any[] = JSON.parse(localStorage.getItem('price-label') || '[]');
    setState(data);
  }, []);

  useEffect(() => {
    localStorage.setItem('printData', JSON.stringify(state));
  }, [state]);

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <div
        className={classNames(
          'w-[29.7cm] h-[21cm] bg-white relative box-border', // px-[12.9mm] py-[6mm]
          styles.printElement
        )}
      >
        <div
          className={classNames(
            'box-border flex flex-wrap gap-3 py-12 px-8',
            styles.noBorder
          )}
        >
          {state.map((item, index) => {
            return (
              <PrintLabelProductItems
                key={index}
                index={index}
                dataSourceList={state}
              />
            );
          })}
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
