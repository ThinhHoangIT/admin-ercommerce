import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import NiceModal from '@ebay/nice-modal-react';
import { Provider } from 'react-redux';

import App from './App';
import ErrorFallback from '@/components/ErrorFallBack';

import store from '@/store';
import './styles.css';
import '@/dialogs';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Provider store={store}>
      <NiceModal.Provider>
        <App />
      </NiceModal.Provider>
    </Provider>
  </ErrorBoundary>,
);
