// Only load recordo for dev code for now
import Recordo from 'recordo';
Recordo.initialize();
// Recordo.start()

import { BootstrapURLs, UiSettings, ExerciseHelpers } from 'shared';

import api from './src/api';
import Notices from './src/helpers/notifications';
import { readBootstrapData } from './src/helpers/dom';
import { startMathJax } from 'shared/src/helpers/mathjax';
import { TransitionAssistant } from './src/components/unsaved-state';

import ErrorMonitoring from 'shared/src/helpers/error-monitoring';


import OFFERINGS from './src/models/course/offerings';
import USER from './src/models/user';
import COURSES from './src/models/courses-map';
import EXERCISES from './src/models/exercises';
import Chat from './src/models/chat';
import { Logging, ReactHelpers } from 'shared';
import PAYMENTS from './src/models/payments';
import STUDENT_TASKS from './src/models/student-tasks';

window._STORES = {
  SETTINGS: UiSettings,
  APP:                  require('./src/flux/app'),
  EXERCISE:             require('./src/flux/exercise'),
  PERFORMANCE_FORECAST: require('./src/flux/performance-forecast'),
  TASK_PLAN:            require('./src/flux/task-plan'),
  TASK_STEP:            require('./src/flux/task-step'),
  TASK:                 require('./src/flux/task'),
  TIME:                 require('./src/flux/time'),
  NOTIFICATIONS:        require('./src/flux/notifications'),
  TOC:                  require('./src/flux/toc'),
};

window._MODELS = {
  USER,
  COURSES,
  EXERCISES,
  OFFERINGS,
  PAYMENTS,
  STUDENT_TASKS,
};

window._LOGGING = Logging;


// In dev builds this enables hot-reloading,
// in production it simply renders the root app

const loadApp = function() {
  if (document.readyState !== 'interactive') {
    return false;
  }

  const bootstrapData = readBootstrapData();
  api.start(bootstrapData);
  BootstrapURLs.update(bootstrapData);

  UiSettings.initialize(bootstrapData.ui_settings);
  Notices.start(bootstrapData);
  ExerciseHelpers.setErrataFormURL(bootstrapData.errata_form_url);
  ErrorMonitoring.start();
  Chat.initialize();
  startMathJax();
  TransitionAssistant.startMonitoring();

  // Both require and module.hot.accept must be passed a bare string, not variable
  const Renderer = ReactHelpers.renderRoot( () => require('./src/components/root').default);
  if (module.hot) { module.hot.accept('./src/components/root', Renderer); }
  return true;
};

loadApp() || document.addEventListener('readystatechange', loadApp);
