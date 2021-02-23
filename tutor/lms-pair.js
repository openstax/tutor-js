import whenDomReady from 'when-dom-ready';
import ReactDOM from 'react-dom';
import React from 'react';
import App from './src/screens/lms-pair/app';
import LmsPair from './src/screens/lms-pair';

whenDomReady().then(async () => {
  await App.bootstrap();
  const root = document.getElementById('ox-root-view');
  ReactDOM.render(React.createElement(LmsPair, { ux: App.ux }), root);
});
