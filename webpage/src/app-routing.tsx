import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Page_Main from './pages/main/Main';
import Page_About from './pages/about/About';

export default (
  <Router>
    <Routes>
      <Route path="/" element={<Page_Main />} />
      <Route path="/about" element={<Page_About />} />
    </Routes>
  </Router>
);
