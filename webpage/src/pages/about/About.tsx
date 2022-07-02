import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import './scss/About.scss';

function getPageContent(t, i18n) {
  if(i18n.exists("pages.about")) {
    return (
      <>
      <span className="headline">{t("pages.about.title")}</span>
      <div className="text">
        <span className="main">
          <span>
            <span className="large">"</span>
            {t("pages.about.text.p1")}
          </span>
          <span>
            {t("pages.about.text.p2")}
          </span>
          <span>
            {t("pages.about.text.p3")}
          </span>
          <span>
            {t("pages.about.text.p4")}
            <span className="large">"</span>
          </span>
        </span>
        <span className="authorNote">- {t('pages.about.text.authorNote')} ;) - 2021</span>
      </div>
      </>
    );
  } else {
    return (
      <>
        <span>{t('pages.about_no_trans_note')}</span>
      </>
    );
  }
}

function Page_About() {
  const iconType = "chevron-back-outline";

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  return (
    <div id="about">
      <ion-icon name={iconType} class="back" onClick={ () => {navigate("/")} }></ion-icon>
      {getPageContent(t, i18n)}
    </div>
  );
}

export default Page_About;
