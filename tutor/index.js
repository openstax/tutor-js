import ReactDOM from 'react-dom'
import React from 'react'

import { Exercise } from 'shared/model/exercise'
const ex = new Exercise
import Preview from 'shared/components/exercise-preview'

ReactDOM.render(<Preview exercise={ex} />, document.querySelector('div'))


// import renderRoot from 'shared/helpers/render-root';
// import App from './src/models/app';

// App.boot().then(async (app) => {
//   const rootRenderer = await renderRoot({
//     Component: App.rootComponent,
//     props: { app },
//   });
//   if (module.hot) {
//     module.hot.accept('./src/models/app', async () => {
//       const NewApp = await import('./src/models/app');
//       rootRenderer(NewApp.default.rootComponent);
//     });
//   }
// });
