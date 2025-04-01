import axios from 'axios';
import { getLocalStorageLanguage, getLocalStorageToken } from '../commons';
import { message } from 'antd';

export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_BASE_API
    : window.location.origin + '/mall-admin';

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
});

request.interceptors.request.use(
  (config) => {
    config.headers['Accept-Language'] = getLocalStorageLanguage();
    config.headers['Authorization'] = getLocalStorageToken();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    const { data } = response;

    if (data.code && data.code === 200) {
      return response.data;
    }

    // 未登录
    if (data.code === 401) {
      window.location.href = '/login';
      return;
    }

    // 错误提示
    message.error({
      key: 'error',
      type: 'error',
      content: data.message,
      duration: 5,
    });

    /**
     * code为非 200 是业务错误
     */
    return Promise.reject(data);
  },
  (error) => {
    // 错误提示
    message.error({
      key: 'error',
      type: 'error',
      content: error.message,
      duration: 5,
    });

    return Promise.reject(error);
  }
);

export default request;

/** Node服务 */
export const getGinzaxiaomaApiUrl = () => {
  const hostname = window.location.hostname;

  if (
    hostname === 'admin-shop.ginzaxiaoma.com' ||
    hostname === 'admin.ginzaxiaoma.com'
  ) {
    return 'https://api.ginzaxiaoma.com';
  } else {
    return 'https://test-api.ginzaxiaoma.com';
  }
};


export const getGinzaxiaomaSocketApiUrl = () => {
  const hostname = window.location.hostname;

  if (
    hostname === 'admin-shop.ginzaxiaoma.com' ||
    hostname === 'admin.ginzaxiaoma.com'
  ) {
    return 'wss:://api.ginzaxiaoma.com';
  } else {
    return 'wss://test-api.ginzaxiaoma.com';
  }
};
export const ginzaxiaomaApiRequest = axios.create({
  baseURL: getGinzaxiaomaApiUrl(),
});

ginzaxiaomaApiRequest.interceptors.request.use(
  (config) => {
    config.headers['Accept-Language'] = getLocalStorageLanguage();
    config.headers['Authorization'] = getLocalStorageToken();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

ginzaxiaomaApiRequest.interceptors.response.use(
  (response) => {
    return Promise.resolve(response.data);
  },
  (error) => {
    message.error({
      key: 'error',
      type: 'error',
      content: error.response.data.message || error.message,
      duration: 2,
    });

    return Promise.reject(error);
  }
);
