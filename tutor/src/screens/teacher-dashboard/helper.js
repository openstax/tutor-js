import TutorRouter from '../../helpers/router';
import UiSettings from 'shared/model/ui-settings';
import { delay, partial } from 'lodash';

const SIDEBAR_KEY_PREFIX = 'CSB';

export default {

    shouldIntro() {
        return TutorRouter.currentQuery().showIntro === 'true';
    },

    scheduleIntroEvent(cbFn, ...args) {
        if (this.shouldIntro()) {
            delay(partial(cbFn, ...Array.from(args)), 1000);
        }
    },

    clearScheduledEvent(event) {
        if (event) { clearTimeout(event); }
    },

    isSidebarOpen(course) {
        return !!UiSettings.get(SIDEBAR_KEY_PREFIX, course.id);
    },

    setSidebarOpen(course, isOpen) {
        return UiSettings.set(SIDEBAR_KEY_PREFIX, course.id, isOpen);
    },
};
