import CourseEnroll from '../../../src/models/course/enroll';
import CL from '../../../src/flux/course-listing';
jest.mock('../../../src/flux/course-listing', () => ({
  CourseListingStore: { once: jest.fn((signal, cb) => cb()) },
  CourseListingActions: { load: jest.fn() },
}));

describe('Course Enrollment', function() {
  let enroll;
  beforeEach(() => {
    enroll = new CourseEnroll();
  });

  it('#isPending', () => {
    expect(enroll.isPending).toBe(true);
    enroll.apiErrors = { foo: 'bar' };
    expect(enroll.isPending).toBe(false);
    enroll.apiErrors = null;
    expect(enroll.isPending).toBe(true);
    enroll.to = { course: { name: 'test' } };
    expect(enroll.isPending).toBe(false);
  });

  it('#courseDescription', () => {
    enroll.to = { course: { name: 'test course' } };
    expect(enroll.courseDescription).toEqual('test course');
  });

  it('#isInvalid', () => {
    expect(enroll.isInvalid).toBe(false);
    enroll.apiErrors = { invalid_enrollment_code: 'true' };
    expect(enroll.isInvalid).toBe(true);
  });

  it('#isRegistered', () => {
    expect(enroll.isRegistered).toBe(false);
    enroll.apiErrors = { already_enrolled: 'true' };
    expect(enroll.isRegistered).toBe(true);
    enroll.apiErrors = null;
    expect(enroll.isRegistered).toBe(false);
    enroll.status = 'processed';
    expect(enroll.isRegistered).toBe(true);
  });

  it('fetches on complete', () => {
    enroll.status = 'processed';
    expect(enroll.isRegistered).toBe(true);
    expect(CL.CourseListingStore.once).toHaveBeenCalled();
    expect(CL.CourseListingActions.load).toHaveBeenCalled();
    expect(enroll.isComplete).toBe(true);
  });

  test('#confirm', () => {
    enroll.student_identifier = '1234';
    expect(enroll.confirm()).toEqual({ data: { student_identifier: '1234' } });
  });

});
