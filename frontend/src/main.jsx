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
