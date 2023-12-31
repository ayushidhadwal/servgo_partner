import * as React from 'react';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import English from './locales/en';
import Arabic from './locales/ar';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    en: English,
    ar: Arabic,
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
