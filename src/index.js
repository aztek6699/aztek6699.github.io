import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { Routes, Route, BrowserRouter as Router} from 'react-router-dom'

import { Home } from './pages/Home';
import { NQueens } from './pages/NQueens';
import { Polysphere } from './pages/Polysphere';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nQueens" element={<NQueens />} />
        <Route path="/polysphere" element={<Polysphere />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

