import React from 'react';
import { get } from 'lodash';
import { startMathJax } from 'shared/helpers/mathjax';
import api from './src/api';
import User from './src/models/user';
import { ReactHelpers } from 'shared';
import './resources/styles/app.scss';

function loadApp() {
  api.start();
  startMathJax();
  const data = JSON.parse(
    get(document.getElementById('exercises-boostrap-data'), 'innerHTML', '{}')
  );
  User.bootstrap(data.user);
  // Both require and module.hot.accept must be passed a bare string, not variable
  const Renderer = ReactHelpers.renderRoot( function() {
    const Component = require('./src/app').default;
    return () => React.createElement(Component, { data });
  });
  if (module.hot) { return module.hot.accept('./src/app', Renderer); }
};

document.addEventListener('DOMContentLoaded', loadApp);
