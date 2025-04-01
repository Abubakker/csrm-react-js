import { useEffect, useState } from 'react';

const usePosPrinter = () => {
  const [posPrinterInfo, setPosPrinterInfo] = useState<
    typeof window.posPrinterInfo
  >(window.posPrinterInfo);

  useEffect(() => {
    const timerId = setInterval(() => {
      setPosPrinterInfo(window.posPrinterInfo);
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [setPosPrinterInfo]);

  return {
    posPrinterInfo,
    setPosPrinterInfo,
  };
};

export default usePosPrinter;
