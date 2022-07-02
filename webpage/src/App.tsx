import React from 'react';
import { Route, Link, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

import Page_Main from './pages/main/Main';

import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translation from './translation/translation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page_Main />} />
      </Routes>
    </Router>
  );
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
