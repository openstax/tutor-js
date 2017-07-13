import Course from '../../../../src/models/course';
import Nags from '../../../../src/components/onboarding/nags';

import CourseUX from '../../../../src/models/course/onboarding/student-course';
import UiSettings from 'shared/src/model/ui-settings';


jest.mock('shared/src/model/ui-settings' );
jest.mock('../../../../src/models/course');


describe('Full Course Onboarding', () => {
  let ux;

  beforeEach(() => {
    UiSettings.get.mockImplementation(() => undefined);
    ux = new CourseUX(
      new Course,
      { tour: null },
    );
  });

  afterEach(() => {
    ux.close();
  });

  it('#nagComponent', () => {
    expect(ux.nagComponent).toBeNull();
    ux.course.needsPayment = true;
    ux.course.userStudentRecord = {};
    expect(ux.nagComponent).toBe(Nags.payNowOrLater);
    ux.course.userStudentRecord = { mustPayImmediately: true };
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

});
