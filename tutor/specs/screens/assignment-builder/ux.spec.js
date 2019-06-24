import UX from '../../../src/screens/assignment-builder/ux';
import { Factory, C } from '../../helpers';

describe('Homework Builder', function() {
  let ux, plan;

  beforeEach(() => {
    const course = Factory.course();
    plan = Factory.teacherTaskPlan({ course });
    ux = new UX({ course, plan });
  });

  // it('calculates min/max dates', () => {
  //   expect(ux.dueAt).toEqual({
  //     min: ux.course.term.start,
  //     max:  '2',
  //   })
  // });

});
