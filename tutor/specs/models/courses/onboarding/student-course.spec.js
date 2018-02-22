import Course from '../../../../src/models/course';
import Nags from '../../../../src/components/onboarding/nags';

import CourseUX from '../../../../src/models/course/onboarding/student-course';
import UiSettings from 'shared/model/ui-settings';
import User from '../../../../src/models/user';
import Payments from '../../../../src/models/payments';

jest.mock('shared/model/ui-settings' );
jest.mock('../../../../src/models/course');
jest.mock('../../../../src/models/payments' );
jest.useFakeTimers();

describe('Full Course Onboarding', () => {
  let ux;

  beforeEach(() => {
    UiSettings.get.mockImplementation(() => undefined);
    User.terms_signatures_needed = false;
    ux = new CourseUX(
      new Course,
      { tour: null },
    );
    ux.course.studentTasks = { fetch: jest.fn(), };
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
    ux.course.studentTasks = { fetch: jest.fn() };
    ux.payNow();
    ux.course.userStudentRecord = {
      markPaid: jest.fn(),
    };
    ux.onPaymentComplete();
    expect(ux.course.studentTasks.fetch).toHaveBeenCalled();
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
      mustPayImmediately: true, markPaid: jest.fn(),
    };
    expect(ux.course.studentTasks.fetch).not.toHaveBeenCalled();
    expect(ux.paymentIsPastDue).toBe(true);
    ux.mount();
    expect(ux.course.studentTasks.fetch).not.toHaveBeenCalled();
    ux.onPaymentComplete();
    expect(setInterval).toHaveBeenCalled();
    expect(ux.course.studentTasks.fetch).toHaveBeenCalledTimes(1);
    expect(ux.refreshTasksTimer).not.toBeNull();
    jest.runOnlyPendingTimers();
    expect(ux.course.studentTasks.fetch).toHaveBeenCalledTimes(2);
    ux.close();
    expect(ux.refreshTasksTimer).toBeNull();
    jest.runAllTimers();
    expect(ux.course.studentTasks.fetch).toHaveBeenCalledTimes(2);
  });

});
