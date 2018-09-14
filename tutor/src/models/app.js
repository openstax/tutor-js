import { isEmpty, forIn, isNil } from 'lodash';
import { observable, action } from 'mobx';
import { BootstrapURLs, ExerciseHelpers } from 'shared';
import UiSettings from 'shared/model/ui-settings';
import { startMathJax } from 'shared/helpers/mathjax';
import Notifications from 'shared/model/notifications';
import { connectModelRead } from '../api/adapter';
import { TransitionAssistant } from '../components/unsaved-state';
import { readBootstrapData } from '../helpers/dom';
import { startAPI } from '../api';
import User from './user';
import Raven from './app/raven';
import Courses from './courses-map';
import Payments from './payments';
import Hypothesis from './annotations/hypothesis';
import { FeatureFlagsApi } from './feature_flags';
import Notices from '../helpers/notifications';
import Chat from './chat';
import Toasts from './toasts';

const BOOTSTRAPED_MODELS = {
  user:     User,
  courses:  Courses,
  payments: Payments,
  hypothesis: Hypothesis,
  feature_flags: FeatureFlagsApi,
};

export default class TutorApp {

  @observable tutor_js_url;
  @observable osweb_base_url;

  boot() {
    Raven.boot();
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
    this.osweb_base_url = this.data.osweb_base_url;
    ExerciseHelpers.setOSWebURL(this.osweb_base_url);
    Chat.initialize();
    startMathJax();
    TransitionAssistant.startMonitoring();
    Raven.setUser(User);
    return Promise.resolve(this);
  }

  @action.bound onNotice({ tutor_js_url }) {
    // when it's null, the url should default to the first update
    if (isNil(this.tutor_js_url)) {
      this.tutor_js_url = tutor_js_url;
    } else if (this.tutor_js_url !== tutor_js_url) {
      Toasts.push({ handler: 'reload' });
    }
  }

  fetch() {

  }

  onLoaded({ data }) {
    this.data = data;
  }
}

connectModelRead(TutorApp, 'fetch', { url: '/bootstrap', onSuccess: 'onLoaded' });
