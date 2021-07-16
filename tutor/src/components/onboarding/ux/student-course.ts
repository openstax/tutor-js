import { computed, override, observable, action, modelize, hydrateModel, runInAction } from 'shared/model';
import { get } from 'lodash';
import UiSettings from 'shared/model/ui-settings';
import { BaseOnboarding } from './base';
import Nags from '../../../components/onboarding/nags';
import { Course, TourContext } from '../../../models';
import { Payments } from '../../../helpers/payments';
import { PaymentCode } from '../../../models'

export const PAY_LATER_CHOICE = 'PL';
const TRIAL_ACKNOWLEDGED = 'FTA';

export class StudentCourseOnboarding extends BaseOnboarding {
    @observable displayPayment = false
    @observable displayPaymentOptions = false
    @observable displayRedeemCode = false
    @observable codeRedeemed = false
    @observable displayTrialActive = false
    @observable needsTermsSigned = false
    @observable paymentCode: PaymentCode
    @observable paymentCodeError = ''

    constructor(course: Course, tourContext: TourContext) {
        super(course, tourContext)
        modelize(this)
        this.paymentCode = hydrateModel(PaymentCode, { courseId: this.course.id })
    }

    @override get nagComponent(): any {
        if (this.needsTermsSigned) { return null; }
        const student = this.course.userStudentRecord;
        if (!student || student.is_comped) { return null; }
        if (this.displayPaymentOptions) { return Nags.paymentOptions; }
        if (this.displayRedeemCode) { return Nags.redeemCode; }
        if (this.displayPayment) { return Nags.makePayment; }
        if (!Payments.config.is_enabled && this.course.does_cost) {
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
    reset() {
        this.displayPayment = false
        this.displayPaymentOptions = false
        this.displayTrialActive = false
        this.displayRedeemCode = false
    }

    @action.bound showPaymentOptions() {
        this.displayPaymentOptions = true;
    }

    @action.bound showRedeemCode() {
        this.displayRedeemCode = true;
        this.displayPaymentOptions = false;
    }

    @action.bound
    payNow() {
        this.displayPayment = true;
        this.displayPaymentOptions = false;
    }

    @action.bound
    onAccessCourse() {
        this.displayRedeemCode = false;
        this.displayPaymentOptions = false;
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
        this.displayPayment = false;
        this.course.userStudentRecord?.markPaid();
        // start fetch tasks since they could not be fetched while student was in unpaid status
        this.course.studentTaskPlans.startFetching();
    }

    @action.bound setCode(code: string) {
        this.paymentCodeError = ''
        return this.paymentCode.code = code
    }

    @computed get codeRedeemable() {
        return Boolean(!this.paymentCodeError && this.paymentCode.isValid())
    }

    @action.bound async redeemCode() {
        await this.paymentCode.redeem()

        if (this.paymentCode.hasErrorNotFound) {
            runInAction(() => this.paymentCodeError = 'Invalid access code')
            return null
        } else if (this.paymentCode.hasErrorAlreadyRedeemed) {
            runInAction(() => this.paymentCodeError = 'Access code already in use')
            return null
        } else if (this.paymentCode.api.errors.any) {
            throw (this.paymentCode.api.errors.latest?.data)
        }

        this.codeRedeemed = true
        return this.paymentCode
    }

    @action.bound finalizeRedemption() {
        this.reset()
        this.onPaymentComplete()
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
