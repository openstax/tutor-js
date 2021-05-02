import renderRoot from 'shared/helpers/render-root';
import { TutorApp } from './src/models/app';

TutorApp.boot().then(async (app) => {
    const rootRenderer = await renderRoot({
        Component: TutorApp.rootComponent,
        props: { app },
    });
    if (module.hot) {
        module.hot.accept('./src/models/app', async () => {
            const NewApp = await import('./src/models/app');
            rootRenderer(NewApp.default.rootComponent);
        });
    }
});
