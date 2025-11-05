import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import{Toaster} from 'react-hot-toast';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
import axios from 'axios';
import { BASE_URL } from './config.js';

  let persistor = persistStore(store);
  
// Global axios defaults
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

// Attach Authorization header from localStorage token if present
axios.interceptors.request.use((config) => {
  try {
    const t = localStorage.getItem('auth_token');
    if (t) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${t}`;
    }
  } catch {}
  return config;
});

// Global 401 handler: clear token and redirect to login
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      try { localStorage.removeItem('auth_token'); } catch {}
      // Avoid infinite redirects if already on login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
    <App />
    <Toaster />
    </PersistGate>
    </Provider>
  </StrictMode>,
)
