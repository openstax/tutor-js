import ReactHelpers from './src/helpers/react';

import { startMathJax } from './src/helpers/mathjax';
// In dev builds this enables hot-reloading,
// in production it simply renders the root app
// {AppContainer} = require 'react-hot-loader'
const loadApp = function() {
    if (document.readyState !== 'interactive') {
        return false;
    }

    startMathJax();

    // Both require and module.hot.accept must be passed a bare string, not variable
    const Renderer = ReactHelpers.renderRoot( () => require('./src/components/demo'));
    if (module.hot) { module.hot.accept('./src/components/demo', Renderer); }
    return true;
};


loadApp() || document.addEventListener('readystatechange', loadApp);
