// Only load recordo for dev code for now
import Recordo from 'recordo';
Recordo.initialize();
// Recordo.start()
import './resources/styles/tutor.scss';

import UiSettings from 'shared/model/ui-settings';
import App from './src/models/app';
import whenDomReady from 'when-dom-ready';

import OFFERINGS from './src/models/course/offerings';
import USER from './src/models/user';
import COURSES from './src/models/courses-map';
import EXERCISES from './src/models/exercises';
import { Logging, ReactHelpers } from 'shared';
import PAYMENTS from './src/models/payments';
import STUDENT_TASKS from './src/models/student-tasks';
import TEACHER_PLANS from './src/models/course/task-plans';
import TOASTS from './src/models/toasts';

window._STORES = {
  SETTINGS: UiSettings,
  APP:                  require('./src/flux/app'),
  PERFORMANCE_FORECAST: require('./src/flux/performance-forecast'),
  TASK_PLAN:            require('./src/flux/task-plan'),
  TASK_STEP:            require('./src/flux/task-step'),
  TASK:                 require('./src/flux/task'),
  TIME:                 require('./src/flux/time'),
};

window._MODELS = {
  USER,
  COURSES,
  EXERCISES,
  OFFERINGS,
  PAYMENTS,
  TOASTS,
  STUDENT_TASKS,
  TEACHER_PLANS,
};

window._LOGGING = Logging;

// In dev builds this enables hot-reloading,
// in production it simply renders the root app

whenDomReady().then(() => {
  const app = new App();
  app.boot().then(() => {
    // Both require and module.hot.accept must be passed a bare string, not variable
    const Renderer = ReactHelpers.renderRoot( () => require('./src/components/root').default);
    if (module.hot) { module.hot.accept('./src/components/root', Renderer); }
  });
});
