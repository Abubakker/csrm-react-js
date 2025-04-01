import React from 'react';
import 'styles/index.css';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from 'store';
import { LANGUAGE_MAP } from 'commons/options';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import './i18n';
import 'antd/dist/reset.css';
import { getLocalStorageLanguage } from 'commons';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/es-us';
import 'dayjs/locale/ja';
import zhCN from 'antd/locale/zh_CN';
import jaJP from 'antd/locale/ja_JP';
import enUS from 'antd/locale/en_US';
// lightgallery
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
// 强制覆盖 antd 部分样式
import 'styles/antd-global.scss';
import 'styles/var-global.css';

const language = getLocalStorageLanguage();
const localMap = {
  [LANGUAGE_MAP.EN]: enUS,
  [LANGUAGE_MAP.JA]: jaJP,
  [LANGUAGE_MAP.ZH_CN]: zhCN,
};

const container = document.getElementById('root')!;
const root = createRoot(container);

// 一开始先初始化打印机信息
window.posPrinterInfo = {
  status: 'waiting',
  printer: undefined,
};

root.render(
  // <React.StrictMode>
  <ConfigProvider
    locale={localMap[language]}
    theme={{
      token: {
        // colorPrimary: '#00b96b',
        borderRadius: 2,
      },
    }}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>

  // {/* </React.StrictMode> */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
