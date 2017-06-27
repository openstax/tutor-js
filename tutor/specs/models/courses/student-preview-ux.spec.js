import CourseStudentPreviewUX from '../../../src/models/course/student-preview-ux';
import { observable } from 'mobx';

describe('Course Student Preview UX Model', () => {
  let course, ux;
  beforeEach(() => {
    course = observable.object({
      appearance_code: 'invalid',
    });
    ux = new CourseStudentPreviewUX(course, 'reading');
  });
  it('checks for valid planTypes', () => {
    expect(ux.isPlanTypeValid()).toBe(true);
    ux.planType = 'bad';
    expect(ux.isPlanTypeValid()).toBe(false);
    expect(ux.isPlanTypeValid('homework')).toBe(true);
  });
  it('doesnt blowup on invalid codes', () => {
    expect(ux.isPlanTypeValid()).toBe(true);
    expect(ux.builderVideoId).toBeNull();
    expect(ux.studentPreviewVideoId('reading')).toBeNull();
  });
  it('calculates for bio', () => {
    ux.course.appearance_code = 'college_biology';
    expect(ux.isPlanTypeValid()).toBe(true);
    expect(ux.builderVideoId).toEqual('4neNaHRyTUw');
    ux.planType=null;
    expect(ux.studentPreviewVideoId('reading')).toEqual('4neNaHRyTUw');
  });
  it('calculates for phys', () => {
    ux.course.appearance_code = 'college_physics';
    expect(ux.isPlanTypeValid()).toBe(true);
    expect(ux.builderVideoId).toEqual('tCocd4jCVCA');
    ux.planType='homework';
    expect(ux.builderVideoId).toEqual('Ic2_9LYXY84');
    ux.playType=null;
    expect(ux.studentPreviewVideoId('reading')).toEqual('tCocd4jCVCA');
  });
});
