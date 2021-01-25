import { readBootstrapData } from '../../../src/helpers/dom';
import User from '../../models/user';
import Courses from '../../models/courses';
import Raven from '../../models/app/raven';
import Api from '../../api';
import UX from './ux';

const App = {

  bootstrap() {
    const data = readBootstrapData();
    Raven.boot();
    Api.boot();
    User.bootstrap(data.user);
    Courses.bootstrap(data.courses);
    this.ux = new UX();
  },

};


export default App;
