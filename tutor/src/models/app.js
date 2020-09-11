import { isEmpty, forIn, isNil } from 'lodash';
import { observable, action } from 'mobx';
import { BootstrapURLs, ExerciseHelpers } from 'shared';
import UiSettings from 'shared/model/ui-settings';
import { startMathJax } from 'shared/helpers/mathjax';
import Notifications from 'shared/model/notifications';
import adapters from '../api/adapter';
import { TransitionAssistant } from '../components/unsaved-state';
import { documentReady, readBootstrapData } from '../helpers/dom';
import Api from '../api';
import User from './user';
import Raven from './app/raven';
import Courses from './courses-map';
import Payments from './payments';
import { FeatureFlagsApi } from './feature_flags';
import Notices from '../helpers/notifications';
import Chat from './chat';
import PulseInsights from './app/pulse-insights';
import Toasts from './toasts';
import Tutor from '../components/root';
import ResponseValidation from './response_validation';

const BOOTSTRAPED_MODELS = {
  user:     User,
  courses:  Courses,
  payments: Payments,
  feature_flags: FeatureFlagsApi,
  response_validation: ResponseValidation,
};

// _MODELS is for adhoc console debugging ONLY, no code should rely on this!
window._MODELS = Object.assign({
  settings: UiSettings,
  notifications: Notifications,
  toasts: Toasts,
}, BOOTSTRAPED_MODELS);


export default class TutorApp {

  @observable tutor_assets_hash;
  @observable osweb_base_url;
  @observable is_impersonating;

  static rootComponent = Tutor;

  static async boot() {
    await documentReady();

    const app = new TutorApp();
    [Raven, PulseInsights, Api].forEach(lib => lib.boot());

    app.data = readBootstrapData();
    if (isEmpty(app.data)) {
      return app.fetch().then(app.initializeApp);
    }
    return app.initializeApp();
  }

  static logError(error, info) {
    Raven.captureException(error, { extra: info });
  }

  logError(error, info) {
    Raven.captureException(error, { extra: info });
  }

  @action.bound initializeApp() {
    window._MODELS.bootstrapData = this.data;
    forIn(BOOTSTRAPED_MODELS, (model, storeId) => {
      const data = this.data[storeId];
      if (data) { model.bootstrap(data); }
    });
    // are we running under webpack?
    if (this.data.assets_url && typeof __webpack_public_path__ !== 'undefined') {
      // if so, tell it where to load chunks from.
      // eslint-disable-next-line no-undef
      __webpack_public_path__ = this.data.assets_url;
    }
    
    BootstrapURLs.update(this.data);
    UiSettings.initialize(this.data.ui_settings || {});
    Notifications.on('tutor-update', this.onNotice);
    Notices.start(this.data);
    this.osweb_base_url = this.data.osweb_base_url;
    this.is_impersonating = this.data.is_impersonating;
    ExerciseHelpers.setOSWebURL(this.osweb_base_url);
    Chat.initialize();
    startMathJax();
    TransitionAssistant.startMonitoring();
    Raven.setUser(User);
    return Promise.resolve(this);
  }

  @action.bound onNotice({ tutor_assets_hash, feature_flags }) {
    // set flags first because other behaviour might rely on them
    FeatureFlagsApi.merge(feature_flags);
    // when it's null, the url should default to the first update
    if (isNil(this.tutor_assets_hash)) {
      this.tutor_assets_hash = tutor_assets_hash;
    } else if (this.tutor_assets_hash !== tutor_assets_hash) {
      Toasts.push({ handler: 'reload' });
    }
  }

  fetch() {

  }

  onLoaded({ data }) {
    this.data = data;
  }
}

adapters.connectModelRead(TutorApp, 'fetch', { url: '/bootstrap', onSuccess: 'onLoaded' });
