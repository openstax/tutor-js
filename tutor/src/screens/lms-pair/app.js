import { Raven,currentCourses, currentUser } from '../../models';
import urlFor from '../../api';
import UX from './ux';
import { ModelApi } from 'shared/model/api'

class App {
    api = new ModelApi()

    async bootstrap() {
        Raven.boot();
        urlFor('boot');
        const { user, courses } = await this.api.request(['GET', 'user/bootstrap'])
        currentUser.bootstrap(user);
        currentCourses.bootstrap(courses);
        this.ux = new UX();
    }
}

const app = new App();
export default app;
