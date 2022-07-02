import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Page_Main from './pages/main/Main';

export default (
  <Router>
    <Routes>
      <Route path="/" element={<Page_Main />} />
    </Routes>
  </Router>
);
