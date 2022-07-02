import React from 'react';
import './App.css';

import Routing from './app-routing';

import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translation from './translation/translation';

function App() {
  return Routing;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",

    resources: translation,

    interpolation: {
      escapeValue: false
    },

    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lng',
      lookupLocalStorage: 'page-language',
      caches: ['localStorage'],
    }
  });

export default App;
