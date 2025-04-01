import { useLocation } from 'react-router-dom';
import styles from './index.module.scss';
import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

// 收银小票打印 demo
// http://localhost:3001/prints/cash-register?title=Herm%C3%A8s&subTitle=Lindy%2026&rank=Rank%20A&curreny=HKD&price=4746464&productSn=0004747474
const CashRegister = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const title = query.get('title');
  const subTitle = query.get('subTitle');
  const rank = query.get('rank');
  const curreny = query.get('curreny');
  const price = query.get('price');
  const productSn = query.get('productSn');
  const productSnSvg = useRef(null);

  console.log(productSnSvg);

  useEffect(() => {
    if (!productSnSvg.current) return;
    JsBarcode(productSnSvg.current, productSn || '');
  }, [productSn]);

  return (
    <div className={styles.cashRegister}>
      <h1>{title}</h1>
      <h1>{subTitle}</h1>

      <div>{rank}</div>

      <div>{curreny}</div>
      <div>{price}</div>
      <svg ref={productSnSvg}></svg>
    </div>
  );
};

export default CashRegister;
