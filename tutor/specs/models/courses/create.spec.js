import CourseCreate from '../../../src/models/course/create'
import { bootstrapCoursesList } from '../../courses-test-data';
import Offerings from '../../../src/models/course/offerings';
import Router from '../../../src/helpers/router';
import { extend, defer } from 'lodash';
jest.mock('../../../src/helpers/router');
jest.mock('../../../src/models/course/offerings', () => ({
  get: jest.fn(() => undefined),
}));

describe('Course Builder UX Model', () => {
  let creator;

  beforeEach(() => {

    creator = new CourseCreate({
      name: 'TEST COURSE FOR TESTING',
      estimated_student_count: 100,
      offering_id: 1,
      term: { year: 2018, term: 'spring' },
    });

  });

  it('creates a course', () => {
    expect(creator.cloned_from_id).toBe(false);
    const saved = creator.save();
    expect(saved.url).toEqual('/courses');
    expect(saved.data).toMatchSnapshot();
  });

  it('clones a course', () => {
    const course = bootstrapCoursesList().get('2');
    creator.cloned_from = course;
    expect(creator.cloned_from_id).toBe(course.id);
    const saved = creator.save();
    expect(saved.url).toEqual('/courses/2/clone');
    expect(saved.data).toMatchSnapshot();
  });

  it('validates ranges', () => {
    expect(creator.hasError).toBe(false);
    creator.setValue('estimated_student_count', 2000);
    expect(creator.hasError).toBe(true);
    expect(creator.errorMessage).toContain('must be between 1-1500');
    creator.setValue('estimated_student_count', 20);
    expect(creator.hasError).toBe(false);
    expect(creator.errorMessage).toEqual('');
    creator.setValue('num_sections', 20);
    expect(creator.hasError).toBe(true);
    expect(creator.errorMessage).toContain('must be between 1-9');
  });

});
