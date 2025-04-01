import { LANGUAGE_MAP } from './options';

export const LOCAL_STORAGE_TOKEN_KEY = 'LOCAL_STORAGE_TOKEN_KEY';
export const LOCAL_STORAGE_LANGUAGE_KEY = 'LOCAL_STORAGE_LANGUAGE_KEY';
export const LOCAL_STORAGE_FIRST_PAGE = 'LOCAL_STORAGE_FIRST_PAGE';

export const DEFAULT_PAGE = '/home';
export const LOGIN_PAGE = '/login';

export const DEFAULT_LANGUAGE = LANGUAGE_MAP.ZH_CN;

export const getLocalStorageToken = () =>
  window.localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || '';

export const clearLocalStorageTokey = () =>
  window.localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);

export const setLocalStorageLanguage = (language: string) => {
  window.localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, language);
};

export const getLocalStorageLanguage = () =>
  window.localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY) || DEFAULT_LANGUAGE;

export const getLocalStorageFirstPage = (username: string): string => {
  return (
    window.localStorage.getItem(
      `${username || ''}${LOCAL_STORAGE_FIRST_PAGE}`
    ) || DEFAULT_PAGE
  );
};

export const setLocalStorageFirstPage = (username: string, value: string) => {
  // 同一台电脑不同账号登录，作区分
  window.localStorage.setItem(
    `${username || ''}${LOCAL_STORAGE_FIRST_PAGE}`,
    value
  );
};

// 移动端断点
export const MOBILE_BREAKPOINT = 1280;
export const MOBILE_BREAKPOINT_1 = 768;

// 线下支付类型
export const OFFLINE_PAY_TYPE_LIST = ['bank'];

// 加密货币支付类型
export const CRYPTO_PAY_TYPE_LIST = ['CRYPTO_CURRENCY_TRIPLE_A'];

// 自动播放音频（需用户交互后触发）
export const storeScannerBeepAudioSuccess = new Audio(
  'https://static-cloudflare.ginzaxiaoma.com/store-scanner-beep-short.mp3'
);

export const storeScannerBeepAudioError = new Audio(
  'https://static-cloudflare.ginzaxiaoma.com/store-scanner-beep-error.mp3'
);
