import Course from '../../../../src/models/course';
import Nags from '../../../../src/components/onboarding/nags';
import CourseUX from '../../../../src/models/course/onboarding/student-course';
import UiSettings from 'shared/model/ui-settings';
import User from '../../../../src/models/user';
import Payments from '../../../../src/models/payments';
import StudentTasks from '../../../../src/models/student-tasks';
jest.mock('shared/model/ui-settings', () => ({
  set: jest.fn(),
  get: jest.fn(),
}));
jest.mock('../../../../src/models/course');
jest.mock('../../../../src/models/payments');

jest.useFakeTimers();

describe('Full Course Onboarding', () => {
  let ux;

  beforeEach(() => {
    UiSettings.get.mockImplementation(() => undefined);
    User.terms_signatures_needed = false;
    ux = new CourseUX(
      new Course({ id: 1 }),
      { tour: null },
    );
    ux.course.studentTasks = { fetch: jest.fn(() => Promise.resolve()) };
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
    return ux.onPaymentComplete().then(() => {
      expect(ux.course.studentTasks.fetch).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenCalledWith(ux.fetchTaskPeriodically, 1000 * 60 * 60 * 4);
      jest.runOnlyPendingTimers();
      expect(ux.course.studentTasks.fetch).toHaveBeenCalledTimes(2);
      ux.close();
      expect(ux.refreshTasksTimer).toBeNull();
    });

  });

  it('fast fetches when expected task count is set', () => {
    const fetchMock = Promise.resolve();
    ux.course.studentTasks = {
      expecting_assignments_count: 12,
      isEmpty: true,
      fetch: jest.fn(() => fetchMock),
    };
    ux.course.primaryRole = { joinedAgo: jest.fn(() => 1) };
    expect(ux.isEmptyNewStudent).toBe(true);
    ux.mount();
    expect(ux.course.studentTasks.fetch).toHaveBeenCalledWith();
    return fetchMock.then(() => {
      // fetches every minute
      expect(setTimeout).toHaveBeenCalledWith(ux.fetchTaskPeriodically, 1000 * 60);

      ux.course.studentTasks.expecting_assignments_count = 0;
      expect(ux.isEmptyNewStudent).toBe(false);
      jest.runOnlyPendingTimers();
      expect(ux.course.studentTasks.fetch).toHaveBeenCalledTimes(2);
      return fetchMock.then(() => {
        // and now back to every 4 hours
        expect(setTimeout).toHaveBeenCalledWith(ux.fetchTaskPeriodically, 1000 * 60 * 60 * 4);
        ux.close();
        expect(ux.refreshTasksTimer).toBeNull();
      });
    });
  });

});
