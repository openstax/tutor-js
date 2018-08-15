import whenDomReady from 'when-dom-ready';
//import App from './src/models/app';
import { ReactHelpers } from 'shared';

whenDomReady().then(() => {
  const Renderer = ReactHelpers.renderRoot( () => require('./src/screens/lms-pair').default);
  if (module.hot) { module.hot.accept('./src/screens/lms-pair', Renderer); }
});
