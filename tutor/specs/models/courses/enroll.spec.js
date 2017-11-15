import CourseEnroll from '../../../src/models/course/enroll';
import Courses from '../../../src/models/courses-map';
jest.mock('../../../src/models/courses-map', () => ({
  fetch: jest.fn(() => ({
    then: jest.fn((cb) => cb()),
  })),
}));

describe('Course Enrollment', function() {
  let enroll;
  beforeEach(() => {
    enroll = new CourseEnroll();
  });

  it('#isPending', () => {
    expect(enroll.isPending).toBe(true);
    enroll.api.errors = { foo: 'bar' };
    expect(enroll.isPending).toBe(false);
    enroll.api.errors = null;
    expect(enroll.isPending).toBe(true);
    enroll.to = { course: { name: 'test' } };
    expect(enroll.isPending).toBe(false);
  });

  it('#courseName', () => {
    enroll.to = { course: { name: 'test course' } };
    expect(enroll.courseName).toEqual('test course');
    enroll.api.errors = { is_teacher: { data: { course_name: 'TEST COURSE' } } };
    expect(enroll.courseName).toEqual('TEST COURSE');
  });

  it('#isInvalid', () => {
    expect(enroll.isInvalid).toBe(false);
    enroll.api.errors = { invalid_enrollment_code: 'true' };
    expect(enroll.isInvalid).toBe(true);
  });

  it('#onCancelStudentId', () => {
    enroll.confirm = jest.fn();
    enroll.onCancelStudentId();
    expect(enroll.student_identifier).toEqual('');
    expect(enroll.confirm).toHaveBeenCalled();
  });

  it('#isRegistered', () => {
    expect(enroll.isRegistered).toBe(false);
    enroll.api.errors = { already_enrolled: 'true' };
    expect(enroll.isRegistered).toBe(true);
    enroll.api.errors = null;
    expect(enroll.isRegistered).toBe(false);
    enroll.status = 'processed';
    expect(enroll.isRegistered).toBe(true);
  });

  it('fetches on complete', () => {
    enroll.status = 'processed';
    expect(enroll.isRegistered).toBe(true);
    expect(Courses.fetch).toHaveBeenCalled();
    expect(enroll.isComplete).toBe(true);
  });

  test('#confirm', () => {
    enroll.student_identifier = '1234';
    expect(enroll.confirm()).toEqual({ data: { student_identifier: '1234' } });
  });

  test('confirmation api flow', () => {
    enroll.enrollment_code = enroll.originalEnrollmentCode = 'e1e1a822-0985-4b54-b5ab-f0963d98c494';
    expect(enroll.needsPeriodSelection).toBe(true);
    expect(enroll.courseToJoin).toBeUndefined();
    expect(enroll.create()).toEqual({ method: 'GET', url: `enrollment/${enroll.originalEnrollmentCode}/choices` });
    expect(enroll.courseToJoin).not.toBeUndefined();
    enroll.onEnrollmentCreate({ data: { id: '1234' } });
    expect(enroll.courseToJoin.id).toEqual('1234');
    expect(enroll.id).toBeUndefined();
    enroll.enrollment_code = '1234';
    expect(enroll.needsPeriodSelection).toBe(false);
    expect(enroll.create()).toEqual({ data: { enrollment_code: '1234' } });
    enroll.onEnrollmentCreate({ data: { id: '1234' } });
    expect(enroll.id).toEqual('1234');
    enroll.student_identifier = 'student-id-1234';
    expect(enroll.confirm()).toEqual(
      { data: { student_identifier: 'student-id-1234' } }
    );
  });

  it('blocks lms and links from the wrong way', () => {
    enroll.to = { course: { is_lms_enabled: true } };
    let comp = mount(enroll.bodyContents);
    expect(comp.text()).toContain('this enrollment link isn’t valid');

    enroll.to.is_lms_enabled = false;
    enroll.originalEnrollmentCode = 'e1e1a822-0985-4b54-b5ab-f0963d98c494';
    enroll.courseToJoin = { is_lms_enabled: false };
    expect(enroll.isFromLms).toBe(true);
    expect(enroll.courseIsLmsEnabled).toBe(false);
    comp = mount(enroll.bodyContents);
    expect(comp.text()).toContain('you need an enrollment link');
  });

});
