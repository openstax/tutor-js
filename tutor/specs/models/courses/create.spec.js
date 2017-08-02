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
  let creater;

  beforeEach(() => {

    creater = new CourseCreate({
      name: 'TEST COURSE FOR TESTING',
      estimated_student_count: 100,
      offering_id: 1,
      term: { year: 2018, term: 'spring' },
    });

  });

  it('creates a course', () => {
    expect(creater.cloned_from_id).toBe(false);
    const saved = creater.save();
    expect(saved.url).toEqual('/courses');
    expect(saved.data).toMatchSnapshot();
  });

  it('clones a course', () => {
    const course = bootstrapCoursesList().get('2');
    creater.cloned_from = course;
    expect(creater.cloned_from_id).toBe(course.id);
    const saved = creater.save();
    expect(saved.url).toEqual('/courses/2/clone');
    expect(saved.data).toMatchSnapshot();
  });

});
