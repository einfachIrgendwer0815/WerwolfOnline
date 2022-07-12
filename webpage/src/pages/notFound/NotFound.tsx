import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import './scss/NotFound.scss';

function Page_NotFound() {
  const { t, i18n } = useTranslation();
  return (
    <div id="notFound">
      <span className="headline">{ t('gameName') }</span>
      <p>{ t('pages.notFound.notFound') }</p>
      <Link to="/" className="link">{ t('pages.notFound.back') }</Link>
    </div>
  );
}

export default Page_NotFound;
