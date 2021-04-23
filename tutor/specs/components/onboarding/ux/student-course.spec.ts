import { hydrateModel, runInAction } from '../../../helpers'
import Nags from '../../../../src/components/onboarding/nags';
import UiSettings from 'shared/model/ui-settings';
import {
    Course, TourContext, currentUser,
} from '../../../../src/models'
import {
    StudentCourseOnboarding as CourseUX,
} from '../../../../src/components/onboarding/ux/student-course'
import { Payments } from '../../../../src/helpers/payments'
jest.mock('shared/model/ui-settings', () => ({
    set: jest.fn(),
    get: jest.fn(),
}))
jest.mock('../../../../src/models/course')
jest.mock('../../../../src/helpers/payments')

jest.useFakeTimers();

const mockedSettings = UiSettings as any
describe('Student Course Onboarding', () => {
    let ux:CourseUX;

    beforeEach(() => {
        mockedSettings.get.mockImplementation(() => undefined);
        runInAction(() => {
            currentUser.available_terms.push({
                id: 1, name: 'general_terms_of_use', title: 'T&C', is_signed: false,
            } as any)
        })
        window.location.reload = jest.fn();
        ux = new CourseUX(
            hydrateModel(Course, { id: 1 }),
            hydrateModel(TourContext, {}),
        );
        runInAction(() => {
            Object.assign(ux.course, {
                id: 1,
                primaryRole: { joinedAgo: jest.fn(() => 18120) },
                userStudentRecord: { is_comped: false },
                studentTaskPlans: {
                    startFetching: jest.fn(),
                    refreshTasks: jest.fn(),
                },
            });
        })
    });

    afterEach(() => {
        runInAction(() => ux!.close() )
    });

    it('#nagComponent', () => {
        expect(ux.course.needsPayment).toBeUndefined();
        expect(ux.nagComponent).toBeNull();
        ux.course.does_cost = true
        expect(ux.nagComponent).toBe(Nags.payDisabled)
        Payments.config.is_enabled = true;
        (ux.course as any).needsPayment = true;
        (ux.course as any).userStudentRecord = {};
        expect(ux.nagComponent).toBe(Nags.payNowOrLater);
        expect(currentUser.terms.areSignaturesNeeded).toEqual(true);
        (ux.course as any).userStudentRecord = { mustPayImmediately: true };
        expect(ux.nagComponent).toBe(Nags.freeTrialEnded);
    });

    it('#payNow', () => {
        (ux.course as any).needsPayment = true;
        ux.payNow();
        expect(ux.nagComponent).toBe(Nags.makePayment);
    });

    it('#onPaymentComplete', () => {
        (ux.course as any).needsPayment = true;
        ux.payNow();
        (ux.course as any).userStudentRecord = {
            markPaid: jest.fn(),
        };
        ux.onPaymentComplete();
        expect(ux.course.studentTaskPlans.startFetching).toHaveBeenCalled();
        expect((ux.course as any).userStudentRecord.markPaid).toHaveBeenCalled();
    });

    it('silences tours', () => {
        runInAction(() => {
            (ux.course as any).userStudentRecord = { mustPayImmediately: false };
        });
        (UiSettings.get as any).mockImplementation(() => true);
        runInAction(() => ux.mount() )
        expect(ux.tourContext.otherModal).toBe(ux);
        runInAction(() => {
            (ux.course as any).needsPayment = true
            ux.displayPayment = true
        })
        expect(ux.tourContext.otherModal?.isDisplaying).toBe(true);
        ux.close()
        expect(ux.tourContext.otherModal).toBeUndefined()
    });

    it('fetches tasks on mount and periodically after that', () => {
        (ux.course as any).userStudentRecord = {
            mustPayImmediately: false, markPaid: jest.fn(),
        };
        expect(ux.course.studentTaskPlans.refreshTasks).not.toHaveBeenCalled();
        expect(ux.paymentIsPastDue).toBe(false);
        ux.mount();
        expect(ux.course.studentTaskPlans.refreshTasks).toHaveBeenCalledTimes(1);
    });

    it('reloads page when paid after being locked out', () => {
        (ux.course as any).userStudentRecord = {
            mustPayImmediately: true, markPaid: jest.fn(() => Promise.resolve()),
        };
        expect(ux.paymentIsPastDue).toEqual(true);
        ux.onPaymentComplete();
        expect(setTimeout).toHaveBeenCalled();
        jest.runOnlyPendingTimers();
        expect(window.location.reload).toHaveBeenCalled();
    });

});
