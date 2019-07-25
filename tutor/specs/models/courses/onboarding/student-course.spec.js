import Course from '../../../../src/models/course';
import Nags from '../../../../src/components/onboarding/nags';
import CourseUX from '../../../../src/models/course/onboarding/student-course';
import UiSettings from 'shared/model/ui-settings';
import User from '../../../../src/models/user';
import Payments from '../../../../src/models/payments';

jest.mock('shared/model/ui-settings', () => ({
  set: jest.fn(),
  get: jest.fn(),
}));
jest.mock('../../../../src/models/course');
jest.mock('../../../../src/models/payments');

jest.useFakeTimers();

describe('Student Course Onboarding', () => {
  let ux;

  beforeEach(() => {
    UiSettings.get.mockImplementation(() => undefined);
    User.terms_signatures_needed = false;
    window.location.reload = jest.fn();
    ux = new CourseUX(
      new Course({ id: 1 }),
      { tour: null },
    );
    Object.assign(ux.course, {
      id: 1,
      primaryRole: { joinedAgo: jest.fn(() => 18120) },
      userStudentRecord: { is_comped: false },
      studentTaskPlans: {
        startFetching: jest.fn(() => Promise.resolve()),
        stopFetching: jest.fn(),
      },
    });
  });

  afterEach(() => {
    ux.close();
  });

  it('#nagComponent', () => {
    expect(ux.course.needsPayment).toBeUndefined();
    expect(ux.nagComponent).toBeNull();
    ux.course.does_cost = true;
    expect(ux.nagComponent).toBe(Nags.payDisabled);
    Payments.config.is_enabled = true;
    ux.course.needsPayment = true;
    ux.course.userStudentRecord = {};
    expect(ux.nagComponent).toBe(Nags.payNowOrLater);
    User.terms_signatures_needed = false;
    ux.course.userStudentRecord = { mustPayImmediately: true };
    expect(ux.nagComponent).toBe(Nags.freeTrialEnded);
    User.terms_signatures_needed = true;
    expect(ux.nagComponent).toBe(Nags.freeTrialEnded);
  });

  it('#payNow', () => {
    ux.course.needsPayment = true;
    ux.payNow();
    expect(ux.nagComponent).toBe(Nags.makePayment);
  });

  it('#onPaymentComplete', () => {
    ux.course.needsPayment = true;
    ux.payNow();
    ux.course.userStudentRecord = {
      markPaid: jest.fn(),
    };
    ux.onPaymentComplete();
    expect(ux.course.studentTaskPlans.startFetching).toHaveBeenCalled();
    expect(ux.course.userStudentRecord.markPaid).toHaveBeenCalled();
  });

  it('silences tours', () => {
    ux.course.userStudentRecord = { mustPayImmediately: false };
    UiSettings.get.mockImplementation(() => true);
    ux.mount();
    expect(ux.tourContext.otherModal).toBe(ux);
    ux.course.needsPayment = true;
    ux.displayPayment = true;
    expect(ux.tourContext.otherModal.isDisplaying).toBe(true);
    ux.close();
    expect(ux.tourContext.otherModal).toBeNull();
  });

  it('fetches tasks on mount and periodically after that', () => {
    ux.course.userStudentRecord = {
      mustPayImmediately: false, markPaid: jest.fn(),
    };
    expect(ux.course.studentTaskPlans.startFetching).not.toHaveBeenCalled();
    expect(ux.paymentIsPastDue).toBe(false);
    ux.mount();
    expect(ux.course.studentTaskPlans.startFetching).toHaveBeenCalledTimes(1);
  });

  it('reloads page when paid after being locked out', () => {
    ux.course.userStudentRecord = {
      mustPayImmediately: true, markPaid: jest.fn(() => Promise.resolve()),
    };
    expect(ux.paymentIsPastDue).toEqual(true);
    ux.onPaymentComplete();
    expect(setTimeout).toHaveBeenCalled();
    jest.runOnlyPendingTimers();
    expect(window.location.reload).toHaveBeenCalled();
  });

});
