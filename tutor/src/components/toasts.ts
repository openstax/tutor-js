import invariant from 'invariant';
import { currentToasts, Toast, ToastAttrs, setToastHandlers } from 'shared/model/toasts'
import Toasts from 'shared/components/toasts'
import * as lms from './toasts/lms';
import * as scores from './toasts/scores';
import Reload from './toasts/reload';
import ScoresPublished from './toasts/scores-published';
import QuestionPublished from './toasts/add-edit';
import CourseSettingsSaved from './toasts/course-settings-saved';

const JobToasts = { lms, scores };

setToastHandlers({
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

export default Toasts
export type { ToastAttrs }
export { Toast, currentToasts }
