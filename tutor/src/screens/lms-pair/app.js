import User from '../../models/user';
import Courses from '../../models/courses-map';
import Raven from '../../models/app/raven';
import Api from '../../api';
import UX from './ux';
import adapters from '../../api/adapter';

class App {
  async bootstrap() {
    Raven.boot();
    Api.boot();
    const { data: { user, courses } } = await this.fetch();
    User.bootstrap(user);
    Courses.bootstrap(courses);
    this.ux = new UX();
  }
}

adapters.connectModelRead(App, 'fetch', { url: '/user/bootstrap', onSuccess: 'onLoaded' });

const app = new App();
export default app;
