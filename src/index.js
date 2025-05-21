import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { UserLoggedContextProvider } from './context/UserLoggedContext';

import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web'
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web'

const configDefaults = {
  ignoreNetworkEvents: true
  // propagateTraceHeaderCorsUrls: [
  // /.+/g
  //This looks like regex.  Specify the URL of the domain we want to include (I assume just the BE?).  It looks like CORS headers might get intercepted or something otherwise?
  // ]
}

const sdk = new HoneycombWebSDK({
  // endpoint: "https://api.eu1.honeycomb.io/v1/traces", // Send to EU instance of Honeycomb. Defaults to sending to US instance.
  debug: true, // Set to false for production environment.  NOTE: isn't the Heroku version 'production' in essence?
  apiKey: `${process.env.HONEYCOMB_API_KEY}`, //NOTE: this is supposed to be the "Honeycomb Ingest API key".  I hope this is the same as the main API key I extracted earlier...
  serviceName: 'tracker-crm-fe', // Replace with your application name. Honeycomb uses this string to find your dataset when we receive your data. When no matching dataset exists, we create a new one with this name if your API Key has the appropriate permissions.
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
