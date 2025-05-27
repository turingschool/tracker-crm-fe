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
  //This looks like regex.  Specify the URL of the domain we want to include (I assume just the BE?).  It looks like CORS headers might get intercepted or something otherwise?
  // ]
}

console.log(process.env.VITE_RANDOM_VAR)
// console.log(import.meta.env.VITE_RANDOM_VAR)

const honeycombApiKey = process.env.REACT_APP_HONEYCOMB_API_INGEST_KEY

const sdk = new HoneycombWebSDK({
  debug: false, // Set to false for production environment.  NOTE: isn't the Heroku version 'production' in essence?
  //NOTE: if I type the plaintext API key, it works.  WHY!?!?!  Something is clearly not working correctly with the env vars.
  // apiKey: 'hcaik_01jvrs56j54sf3ykggjz1dehsmk108bnj2qqf4qhtntmdtw0snv6hgjgge',
  // apiKey: process.env.HONEYCOMB_API_CONFIG_KEY, //NOTE: this is supposed to be the "Honeycomb Ingest API key".  I hope this is the same as the main API key I extracted earlier...
  // apiKey: `${process.env.HONEYCOMB_API_INGEST_KEY}`, //NOTE: this is supposed to be the "Honeycomb Ingest API key".  I hope this is the same as the main API key I extracted earlier...
  apiKey: honeycombApiKey,
  // apiKey: `${process.env.HONEYCOMB_API_INGEST_KEY}`, //NOTE: this is supposed to be the "Honeycomb Ingest API key".  I hope this is the same as the main API key I extracted earlier...
  // apiKey: `${process.env.HONEYCOMB_API_CONFIG_KEY}`, //NOTE: this is supposed to be the "Honeycomb Ingest API key".  I hope this is the same as the main API key I extracted earlier...
  serviceName: 'tracker-crm-fe', // Replace with your application name. Honeycomb uses this string to find your dataset when we receive your data. When no matching dataset exists, we create a new one with this name if your API Key has the appropriate permissions.
  instrumentations: [getWebAutoInstrumentations({
    // Loads custom configuration for xml-http-request instrumentation.
    '@opentelemetry/instrumentation-xml-http-request': configDefaults,
    '@opentelemetry/instrumentation-fetch': configDefaults,
    '@opentelemetry/instrumentation-document-load': configDefaults,
  })],
});
sdk.start();

debugger

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
