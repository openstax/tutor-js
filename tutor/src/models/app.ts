import { forIn, isNil } from 'lodash';
import { observable, action, modelize, ModelApi } from 'shared/model'
import { BootstrapURLs, ExerciseHelpers } from 'shared';
import UiSettings from 'shared/model/ui-settings';
import { startMathJax } from 'shared/helpers/mathjax';
import Notifications from 'shared/model/notifications';
import { TransitionAssistant } from '../components/unsaved-state';
import { read_csrf, documentReady } from '../helpers/dom';
import { Payments } from '../helpers/payments'
import { Chat } from '../helpers/chat'
import urlFor from '../api';
import {
    FeatureFlagsApi, PulseInsights, Raven, ResponseValidation, currentErrors,
    currentOfferings, currentUser, currentCourses, currentExercises, currentToasts,
} from '../models'
import type { BootstrapData } from '../models'

import Notices from '../helpers/notifications';
import Tutor from '../components/root';
import { request } from 'shared/api/request'


const BOOTSTRAPED_MODELS = {
    user:     currentUser,
    courses:  currentCourses,
    payments: Payments,
    feature_flags: FeatureFlagsApi,
    response_validation: ResponseValidation,
    offerings: currentOfferings,
};


// _MODELS is for adhoc console debugging ONLY, no code should rely on this!
window._MODELS = Object.assign({
    settings: UiSettings,
    notifications: Notifications,
    toasts: currentToasts,
    exercises: currentExercises,
}, BOOTSTRAPED_MODELS);


export class TutorApp {
    @observable tutor_assets_hash: string | null = null;
    @observable osweb_base_url = '';
    @observable is_impersonating = false;
    @observable data?: BootstrapData
    currentUser = currentUser
    currentCourses = currentCourses

    static rootComponent = Tutor;

    constructor() {
        modelize(this);
    }

    static async boot() {
        await documentReady();
        const app = new TutorApp();
        Raven.boot()
        const data: BootstrapData = await app.fetch();
        await app.initializeApp(data);
        return app
    }

    static logError(error: any, info: any) {
        Raven.captureException(error, { extra: info });
    }

    logError(error: any, info: any) {
        Raven.captureException(error, { extra: info });
    }

    @action.bound initializeApp(data: BootstrapData) {

        window._MODELS.bootstrapData = this.data = data;
        window._MODELS.app = this;
        forIn(BOOTSTRAPED_MODELS, (model, storeId) => {
            const mdata = data[storeId];
            if (mdata) { model.bootstrap(mdata); }
        });
        // are we running under webpack?
        // @ts-ignore eslint-disable-next-line
        if (data.assets_url && typeof __webpack_public_path__ !== 'undefined') { //eslint-disable-line
            // if so, tell it where to load chunks from.
            // eslint-disable-next-line no-undef
            // @ts-ignore
            __webpack_public_path__ = this.data.assets_url; //eslint-disable-line
        }

        BootstrapURLs.update(data);
        UiSettings.initialize(data.ui_settings || {});
        Notifications.on('tutor-update', this.onNotice);
        Notices.start(data);
        this.is_impersonating = data.is_impersonating
        ExerciseHelpers.setOSWebURL(data.osweb_base_url)
        Chat.initialize();
        startMathJax();
        TransitionAssistant.startMonitoring();
        Raven.setUser(currentUser)
        PulseInsights.boot(currentUser)

        currentUser.csrf_token = read_csrf() as string;
        ModelApi.errorListener = currentErrors.record
        return Promise.resolve(this);
    }

    @action.bound onNotice({ tutor_assets_hash, feature_flags }: {
        tutor_assets_hash: string,
        feature_flags: any,
    }) {
        // set flags first because other behaviour might rely on them
        FeatureFlagsApi.merge(feature_flags);
        // when it's null, the url should default to the first update
        if (isNil(this.tutor_assets_hash)) {
            this.tutor_assets_hash = tutor_assets_hash;
        } else if (this.tutor_assets_hash !== tutor_assets_hash) {
            currentToasts.add({ handler: 'reload' });
        }
    }

    async fetch() {
        return request<BootstrapData>(urlFor('bootstrap').methodUrl)
    }

}
