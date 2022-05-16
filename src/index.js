import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom"
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import walletReducer from "./features/wallet"
import factoryContractReducer from "./features/factoryContract"
import userAddressReducer from "./features/userAddress"
import productReducer from "./features/product"
import generatorReducer from "./features/generator"
import alertsReducer from "./features/alerts"
import networkReducer from "./features/network"

const store = configureStore({
  reducer: {
    wallet: walletReducer,
    factoryContract: factoryContractReducer,
    userAddress: userAddressReducer,
    product: productReducer,
    generator: generatorReducer,
    alerts: alertsReducer,
    network: networkReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>

  </React.StrictMode>
);

