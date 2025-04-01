import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocalStorageLanguage } from 'commons';

import en from './assets/locales/en.json';
import ja from './assets/locales/ja.json';
import zh_CN from './assets/locales/zh_CN.json';
import zh_TW from './assets/locales/zh_TW.json';

import en_IM from './components/im-chat-admin-components/locales/en.json';
import ja_IM from './components/im-chat-admin-components/locales/ja.json';
import zh_CN_IM from './components/im-chat-admin-components/locales/zh-CN.json';
import zh_TW_IM from './components/im-chat-admin-components/locales/zh-TW.json';

const resources = {
  en: {
    translation: { ...en_IM, ...en },
  },
  ja: {
    translation: { ...ja_IM, ...ja },
  },
  zh_CN: {
    translation: { ...zh_CN_IM, ...zh_CN },
  },
  zh_TW: {
    translation: { ...zh_TW_IM, ...zh_TW },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: getLocalStorageLanguage(), // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
