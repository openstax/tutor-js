import Course from '../../../../src/models/course';
import Nags from '../../../../src/components/onboarding/nags';

import CourseUX from '../../../../src/models/course/onboarding/student-course';
import UiSettings from 'shared/src/model/ui-settings';

jest.mock('shared/src/model/ui-settings');
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

  it('#nagComponent', () => {
    expect(ux.nagComponent).toBeNull();
    ux.course.needsPayment = true;
    expect(ux.nagComponent).toBe(Nags.payNowOrLater);
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

});
