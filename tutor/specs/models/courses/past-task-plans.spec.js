import PastTaskPlans from '../../../src/models/course/past-task-plans';
import Factory from '../../factories';

describe(PastTaskPlans, () => {
  let course;

  beforeEach(() => {
    course = Factory.course({ is_teacher: true });
    Factory.taskPlans({ course, type: 'pastTaskPlans' });
  });

  it('fetches using past course id', () => {
    course.cloned_from_id = null;
    expect(course.isCloned).toBe(false);
    expect(course.pastTaskPlans.fetch()).toBe('ABORT');
    course.cloned_from_id = 123;
    expect(course.isCloned).toBe(true);
    expect(course.pastTaskPlans.fetch()).toEqual({ id: 123 });
  });

});
