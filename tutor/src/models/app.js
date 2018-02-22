import { isEmpty, forIn } from 'lodash';
import { observable, action } from 'mobx';
import { BootstrapURLs, UiSettings, ExerciseHelpers } from 'shared';
import ErrorMonitoring from 'shared/helpers/error-monitoring';
import { startMathJax } from 'shared/helpers/mathjax';
import { connectModelRead } from '../api/adapter';
import { TransitionAssistant } from '../components/unsaved-state';
import { readBootstrapData } from '../helpers/dom';
import { startAPI } from '../api';
import User from './user';
import Courses from './courses-map';
import Payments from './payments';
import Hypothesis from './annotations/hypothesis';
import { FeatureFlagsApi } from './feature_flags';
import Notices from '../helpers/notifications';
import Chat from './chat';

const BOOTSTRAPED_MODELS = {
  user:     User,
  courses:  Courses,
  payments: Payments,
  hypothesis: Hypothesis,
  feature_flags: FeatureFlagsApi,
};

export default class TutorApp {

  boot() {
    startAPI();
    this.data = readBootstrapData();
    if (!isEmpty(this.data)) {
      return this.initializeApp();
    }

    return this.fetch().then(this.initializeApp);
  }

  @action.bound initializeApp() {
    window._MODELS.bootstrapData = this.data;
    forIn(BOOTSTRAPED_MODELS, (model, storeId) => {
      const data = this.data[storeId];
      if (data) { model.bootstrap(data); }
    });
    BootstrapURLs.update(this.data);
    UiSettings.initialize(this.data.ui_settings || {});

    Notices.start(this.data);
    ExerciseHelpers.setErrataFormURL(this.data.errata_form_url);
    ErrorMonitoring.start();
    Chat.initialize();
    startMathJax();
    TransitionAssistant.startMonitoring();
    return Promise.resolve(this);
  }

  fetch() {

  }

  onLoaded({ data }) {
    this.data = data;
  }
}

connectModelRead(TutorApp, 'fetch', { url: '/bootstrap', onSuccess: 'onLoaded' });
