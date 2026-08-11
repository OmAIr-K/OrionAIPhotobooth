import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import './assets/styles/custom-styles.css';
import AIPhotobooth from './components/AIPhotobooth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AIPhotobooth />
    </BrowserRouter>
  </React.StrictMode>
); 