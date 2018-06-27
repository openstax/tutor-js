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

  it('validates ranges', () => {
    expect(creator.error).toBeNull();
    creator.setValue('estimated_student_count', 2000);
    expect(creator.error).toEqual({ attribute: 'students', value: 1500 });
    creator.setValue('estimated_student_count', 20);
    expect(creator.error).toBeNull();
    creator.setValue('num_sections', 20);
    expect(creator.error).toEqual({ attribute: 'sections', value: 10 });
  });

  it('identifies future uses of bio1e', () => {
    expect(creator.isFutureLegacyBio).toBe(false);
    Offerings.get.mockImplementation(() => ({ isLegacyBiology: true }));
    expect(creator.isFutureLegacyBio).toBe(false);
    Object.assign(creator.term, { term: 'winter', year: 2018 });
    expect(creator.isFutureLegacyBio).toBe(true);
    Object.assign(creator.term, { term: 'spring', year: 2018 });
    expect(creator.isFutureLegacyBio).toBe(false);
    Object.assign(creator.term, { term: 'spring', year: 2019 });
    expect(creator.isFutureLegacyBio).toBe(true);
    Offerings.get.mockImplementation(() => ({ isLegacyBiology: false }));
    expect(creator.isFutureLegacyBio).toBe(false);
  });

  describe('cloning a course', () => {
    const prepCourseClone = () => {
      const course = bootstrapCoursesList().get('2');
      creator.cloned_from = course;
      expect(creator.cloned_from_id).toBe(course.id);
      return creator.save();
    };

    it('clones a course', () => {
      Offerings.get.mockImplementation(() => ({ is_available: true }));
      const saved = prepCourseClone();
      expect(saved.url).toEqual('/courses/2/clone');
      expect(saved.data).toMatchSnapshot();
    });

    it('does not clone if the course offering is no longer available', () => {
      Offerings.get.mockImplementation(() => ({ is_available: false }));
      const saved = prepCourseClone();
      expect(saved.url).toEqual('/courses');
      expect(saved.data.cloned_from_id).toBeUndefined();
    });
  });

});
