import React from 'react';
import { Route, Link, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

import Page_Main from './pages/main/Main';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Page_Main />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
