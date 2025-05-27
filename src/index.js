import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { UserLoggedContextProvider } from './context/UserLoggedContext';

import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web'
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web'

const configDefaults = {
  ignoreNetworkEvents: true     //Apparently this will reduce lots of traffic.  We can always try turning it on later (or for specific instrumentation(s) only)
  // propagateTraceHeaderCorsUrls: [
  // /.+/g
  //This looks like regex.  Specify the URL of the domain we want to include (I assume just the BE?); perhaps intercepting these headers will affect tracing to/from BE?
  // ]
}

const sdk = new HoneycombWebSDK({
  debug: false,   // Set to false for production environment (default; can enable on local implementations...)
  apiKey: process.env.REACT_APP_HONEYCOMB_API_INGEST_KEY,
  serviceName: process.env.REACT_APP_HONEYCOMB_DATASET,
  instrumentations: [getWebAutoInstrumentations({
    // Loads custom configuration for xml-http-request instrumentation.
    '@opentelemetry/instrumentation-xml-http-request': configDefaults,
    '@opentelemetry/instrumentation-fetch': configDefaults,
    '@opentelemetry/instrumentation-document-load': configDefaults,
  })],
});
sdk.start();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    {/* <React.StrictMode> */}
      <UserLoggedContextProvider>
        <App />
      </UserLoggedContextProvider>
    {/* </React.StrictMode> */}
  </BrowserRouter>
);
