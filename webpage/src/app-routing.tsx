import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Page_Main from './pages/main/Main';
import Page_About from './pages/about/About';

export default function Routing() {
  const location = useLocation();
  return (
    <TransitionGroup>
      <CSSTransition key={location.key} timeout={2000} classNames="fade">
        <Routes location={location}>
          <Route path="/" element={<Page_Main />} />
          <Route path="/about" element={<Page_About />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}
