import { computed, override, observable, action, modelize } from 'shared/model';
import { get } from 'lodash';
import UiSettings from 'shared/model/ui-settings';
import { BaseOnboarding } from './base';
import Nags from '../../../components/onboarding/nags';
import { Course, TourContext } from '../../../models';
import { Payments } from '../../../helpers/payments';
import { forceReload } from '../../../helpers/reload';

const PAY_LATER_CHOICE  = 'PL';
const TRIAL_ACKNOWLEDGED = 'FTA';

export class StudentCourseOnboarding extends BaseOnboarding {
    @observable displayPayment = false;
    @observable displayTrialActive = false;
    @observable needsTermsSigned = false

    constructor(course: Course, tourContext: TourContext) {
        super(course, tourContext);
        modelize(this);
    }

    @override get nagComponent(): any {
        if (this.needsTermsSigned) { return null; }
        const student = this.course.userStudentRecord;
        if (!student || student.is_comped) { return null; }
        if (this.displayPayment) { return Nags.makePayment; }
        if (!Payments.config.is_enabled && this.course.does_cost){
            if (!UiSettings.get(TRIAL_ACKNOWLEDGED, this.course.id)) {
                return Nags.payDisabled;
            }
        } else if (this.course.needsPayment) {
            if (student.mustPayImmediately) {
                return Nags.freeTrialEnded;
            } else if (this.displayTrialActive) {
                return Nags.freeTrialActivated;
            } else if (!UiSettings.get(PAY_LATER_CHOICE, this.course.id)) {
                return Nags.payNowOrLater;
            }
        }

        return null;
    }

    @computed get isDisplaying() {
        return Boolean(this.nagComponent);
    }

    @computed get paymentIsPastDue() {
        return get(this.course, 'userStudentRecord.mustPayImmediately', false);
    }

    @action.bound
    acknowledgeTrial() {
        UiSettings.set(TRIAL_ACKNOWLEDGED, this.course.id, true);
    }

    @action.bound
    payNow() {
        this.displayPayment = true;
    }

    @action.bound
    onAccessCourse() {
        this.displayTrialActive = false;
    }

    @action.bound
    onPayLater() {
        UiSettings.set(PAY_LATER_CHOICE, this.course.id, true);
        this.displayTrialActive = true;
        this.displayPayment = false;
    }

    @action.bound
    onPaymentComplete() {
        if (this.paymentIsPastDue) {
        // in this case we have to reload since network requests have been failing silently
            setTimeout(forceReload);
        } else {
            this.displayPayment = false;
            this.course.userStudentRecord?.markPaid();
            // start fetch tasks since they could not be fetched while student was in unpaid status
            this.course.studentTaskPlans.startFetching();
        }
    }

    @action mount() {
        super.mount();
        if (this.paymentIsPastDue) {
            this.priority = 0;
        } else {
        // make sure tasks list is up-to-date
            this.course.studentTaskPlans.refreshTasks();
        }
        this.tourContext.otherModal = this;
    }

    @action close() {
        super.close();
        this.tourContext.otherModal = undefined;
    }
}
