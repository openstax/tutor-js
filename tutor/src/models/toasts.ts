import invariant from 'invariant';
import { Store, setHandlers } from 'shared/model/toasts';

import * as lms from '../components/toasts/lms';
import * as scores from '../components/toasts/scores';
import Reload from '../components/toasts/reload';
import ScoresPublished from '../components/toasts/scores-published';
import QuestionPublished from '../components/toasts/add-edit';
import CourseSettingsSaved from '../components/toasts/course-settings-saved';
import { Toast } from 'shared/model/toasts';

const JobToasts = { lms, scores };

setHandlers({
    job(toast: Toast) {
        invariant(['ok', 'failed'].includes(toast.status), 'job status must be ok or failed');
        return JobToasts[toast.type][toast.status == 'ok' ? 'Success' : 'Failure'];
    },
    reload() {
        return Reload;
    },
    scoresPublished() {
        return ScoresPublished;
    },
    questionPublished() {
        return QuestionPublished;
    },
    courseSettingsSaved() {
        return CourseSettingsSaved;
    },
});

export { Toast }

export default Store;
