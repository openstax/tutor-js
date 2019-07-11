import Form from '../../../src/screens/assignment-builder/form';
import { Factory, TimeMock } from '../../helpers';

describe('Assignment Form', function() {
  let form, plan, course;
  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(() => {
    course = Factory.course();
    plan = Factory.teacherTaskPlan({ course });
    form = new Form({ plan });
  });

  it('sets fields', () => {
    form.title.onChange('1234');
    expect(plan.title).toEqual('1234');
  });
});
