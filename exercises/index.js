import React from 'react';
import { get } from 'lodash';
import { startMathJax } from 'shared/helpers/mathjax';
import api from './src/api';
import User from './src/models/user';
import renderRoot from 'shared/helpers/render-root';
import './resources/styles/app.scss';
import Root from './src/app';

async function loadApp() {
  api.start();
  startMathJax();
  const data = JSON.parse(
    get(document.getElementById('exercises-boostrap-data'), 'innerHTML', '{}')
  );
  User.bootstrap(data.user);

  const rootRenderer = await renderRoot({ Component: Root, props: { data } });

  if (module.hot) {
    module.hot.accept('./src/app', async () => {
      const NewApp = await import('./src/app');
      rootRenderer(NewApp.default);
    });
  }
}

document.addEventListener('DOMContentLoaded', loadApp);
