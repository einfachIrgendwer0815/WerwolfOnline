import React from "react";
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';

import Page_NotFound from '../notFound/NotFound';
import Page_Play_Login from './login/Login';
import Page_Play_Join from './join/Join';
import Page_Play_Create from './create/Create';

class Page_Play extends React.Component {
  renderMain() {
    return (
      <></>
    );
  }

  render() {
    return (
      <Routes>
        <Route path="login" element={<Page_Play_Login />} />
        <Route path="join" element={<Page_Play_Join />} />
        <Route path="create" element={<Page_Play_Create />} />

        <Route path="*" element={this.renderMain()} />
      </Routes>
    );
  }
}

export default Page_Play;
