import renderRoot from 'shared/helpers/render-root';
import { TutorApp } from './src/models/app';

TutorApp.boot().then(async (app) => {
    await renderRoot({
        Component: TutorApp.rootComponent,
        props: { app },
    });
});
