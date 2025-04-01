import classNames from 'classnames';
import { useEffect } from 'react';

const barcodeRegionId = 'barcode-reader';

const BarcodeScanner = ({
  onScanSuccess,
  className,
}: {
  onScanSuccess: (decodedText: string, decodedResult: any) => void;
  className?: string;
}) => {
  useEffect(() => {
    const html5QrcodeScanner = new window.Html5QrcodeScanner(
      barcodeRegionId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    html5QrcodeScanner.render(onScanSuccess);

    return () => {
      html5QrcodeScanner.clear();
    };
  }, [onScanSuccess]);

  return <div id={barcodeRegionId} className={classNames(className)} />;
};

export default BarcodeScanner;
