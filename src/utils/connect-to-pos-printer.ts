export const posPrinterSetting = {
  host: {
    get() {
      return (
        window.localStorage.getItem('posPrinterSettingHost') ||
        'epsona4182c.local'
      );
    },
    set(value: string) {
      window.localStorage.setItem('posPrinterSettingHost', value);
    },
  },
  port: {
    get() {
      return window.localStorage.getItem('posPrinterSettingPort') || '8043';
    },
    set(value: string) {
      window.localStorage.setItem('posPrinterSettingPort', value);
    },
  },
  checkoutCount: {
    get() {
      return (
        window.localStorage.getItem('posPrinterSettingCheckoutCount') || '2'
      );
    },
    set(value: string) {
      window.localStorage.setItem('posPrinterSettingCheckoutCount', value);
    },
  },
  printerList: {
    get() {
      const printerList =
        window.localStorage.getItem('posPrinterSettingPrinterList') || '';
      try {
        return JSON.parse(printerList) as {
          label: string;
          value: string;
          port: string;
        }[];
      } catch (err) {
        return [{ label: '打印机1', value: 'epsona4182c.local', port: '8043' }];
      }
    },
    set(value: string) {
      window.localStorage.setItem('posPrinterSettingPrinterList', value);
    },
  },
  // 通信方式 socket 或 http
  communicationType: {
    get() {
      return (
        window.localStorage.getItem('posPrinterSettingCommunicationType') ||
        'socket'
      );
    },
    set(value: string) {
      window.localStorage.setItem('posPrinterSettingCommunicationType', value);
    },
  },
  reset() {
    window.localStorage.removeItem('posPrinterSettingHost');
    window.localStorage.removeItem('posPrinterSettingPort');
    window.localStorage.removeItem('posPrinterSettingCheckoutCount');
    window.localStorage.removeItem('posPrinterSettingPrinterList');
    window.localStorage.removeItem('posPrinterSettingCommunicationType');
  },
};

/**
 * @description socket 连接方式时需要先初始化小票打印机
 * 执行时机有两个
 * 1. 订单详情页，手动点击打印小票
 * 2. 进入收银台页面，自动连接打印机
 */
const connectToPosPrinter = (): Promise<PosPrinter> => {
  return new Promise((resolve, reject) => {
    // 如果已经连接成功打印机，直接返回连接信息
    if (
      window.posPrinterInfo.status === 'connecte_success' &&
      window.posPrinterInfo.printer
    ) {
      resolve(window.posPrinterInfo.printer);
      return;
    }

    // 否则只有在 waiting 状态，才能尝试连接
    // 这样限制了每次打开页面只能尝试连接一次，没有错误重试机制
    if (window.posPrinterInfo.status !== 'waiting') {
      reject('非 waiting 状态不能连接打印机');
      return;
    }

    window.posPrinterInfo = {
      ...window.posPrinterInfo,
      status: 'connecting',
    };

    const ePosDev = new window.epson.ePOSDevice();
    ePosDev.connect(
      posPrinterSetting.host.get(),
      posPrinterSetting.port.get(),
      (res) => {
        if (res !== 'OK' && res !== 'SSL_CONNECT_OK') {
          window.posPrinterInfo = {
            ...window.posPrinterInfo,
            status: 'connecte_failed',
          };
          reject('connecte_failed');
          return;
        }

        ePosDev.createDevice(
          'local_printer',
          ePosDev.DEVICE_TYPE_PRINTER,
          {
            crypto: false,
            buffer: false,
          },
          (printer, status: string) => {
            if (status !== 'OK') {
              window.posPrinterInfo = {
                ...window.posPrinterInfo,
                status: 'connecte_failed',
              };
              reject('connecte_failed');
              return;
            }

            printer.timeout = 60000;
            window.posPrinterInfo = {
              ...window.posPrinterInfo,
              status: 'connecte_success',
              printer,
            };
            resolve(printer);
          }
        );
      }
    );
  });
};

export default connectToPosPrinter;
