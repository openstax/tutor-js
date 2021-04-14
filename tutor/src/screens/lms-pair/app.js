import { Raven,currentCourses, currentUser } from '../../models';
import urlFor from '../../api';
import UX from './ux';
import adapters from '../../api/adapter';

class App {
    async bootstrap() {
        Raven.boot();
        urlFor('boot');
        const { data: { user, courses } } = await this.fetch();
        currentUser.bootstrap(user);
        currentCourses.bootstrap(courses);
        this.ux = new UX();
    }
}

adapters.connectModelRead(App, 'fetch', { url: '/user/bootstrap', onSuccess: 'onLoaded' });

const app = new App();
export default app;
