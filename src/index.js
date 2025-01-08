import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { UserLoggedContextProvider } from './context/UserLoggedContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    {/*<React.StrictMode>*/}
    {/*</React.StrictMode>*/}
      <UserLoggedContextProvider>
        <App />
      </UserLoggedContextProvider>
  </BrowserRouter>
);
