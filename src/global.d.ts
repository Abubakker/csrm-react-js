// global.d.ts
type PosPrinter = {
  setXmlString: (xmlString: string) => void;
  send: () => void;
  timeout: number;
};

interface Window {
  Html5QrcodeScanner: new (
    regionId: string,
    config: Html5QrcodeScannerConfig,
    verbose?: boolean
  ) => Html5QrcodeScanner;
  epson: {
    ePOSDevice: new () => {
      connect: (
        address: string,
        port: string,
        callback: (res: string) => void
      ) => void;
      createDevice: (
        deviceId: string,
        deviceType: string,
        options: { crypto: boolean; buffer: boolean },
        callback: (printer: PosPrinter, status: string) => void
      ) => void;
      DEVICE_TYPE_PRINTER: string;
    };
  };

  posPrinterInfo: {
    /**
     * 一开始进入页面，先不自动连接打印机
     * 只有当第一次触发打印小票的动作时，如果此时没有连接打印机，才开始尝试连接打印机
     *
     * waiting 状态表示还没有开始连接打印机
     */
    status: 'waiting' | 'connecting' | 'connecte_failed' | 'connecte_success';
    printer?: PosPrinter;
  };
}
