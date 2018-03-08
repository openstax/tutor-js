import { isEmpty, forIn } from 'lodash';
import { observable, action } from 'mobx';
import { BootstrapURLs, ExerciseHelpers } from 'shared';
import UiSettings from 'shared/model/ui-settings';
import ErrorMonitoring from 'shared/helpers/error-monitoring';
import { startMathJax } from 'shared/helpers/mathjax';
import Notifications from 'shared/model/notifications';
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

  @observable tutor_js_url;

  boot() {
    startAPI();
    this.data = readBootstrapData();
    Notifications.on('tutor-update', this.onNotice);
    if (isEmpty(this.data)) {
      return this.fetch().then(this.initializeApp);
    } else {
      return this.initializeApp();
    }
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

  @action.bound onNotice({ tutor_js_url }) {
    //if (!this.tutor_js_url) this.tutor_js_url = tutor_js_url;
    if (this.tutor_js_url !== tutor_js_url) {
//      Notifications.display({message:'UPDATE!', type: 'reload'})
      //Notifications.on('tutor-update', this.onNotice);
    }
  }

  fetch() {

  }

  onLoaded({ data }) {
    this.data = data;
  }
}

connectModelRead(TutorApp, 'fetch', { url: '/bootstrap', onSuccess: 'onLoaded' });
