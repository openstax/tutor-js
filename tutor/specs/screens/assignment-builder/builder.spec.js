import UX from '../../../src/screens/assignment-builder/ux';
import Builder from '../../../src/screens/assignment-builder/builder';
import { C, Factory, TimeMock } from '../../helpers';

describe('Task Plan Builder', function() {
  let props, plan;

  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(() => {
    const course = Factory.course({ now });
    plan = Factory.teacherTaskPlan({ course, now });
    const ux = new UX({ course, plan });
    props = { ux };
  });

  it('sets name & description', () => {
    const builder = mount(<C><Builder {...props} /></C>);
    plan.save = jest.fn();
    builder.find('.assignment-name input').simulate('change', {
      target: { value: 'an updated title' },
    });
    builder.find('.assignment-description textarea').simulate('change', {
      target: { value: 'an updated description' },
    });

    props.ux.onPublish({ preventDefault: jest.fn() });

    expect(plan.title).toEqual('an updated title');
    expect(plan.description).toEqual('an updated description');
    builder.unmount();
  });

  it('switches periods', () => {
    const builder = mount(<C><Builder {...props} /></C>);
    expect(builder.find('Tasking')).toHaveLength(1);
    builder.find('#show-periods-radio').simulate('change', {
      target: { value: 'periods' },
    });
    expect(builder.find('Tasking')).toHaveLength(props.ux.course.periods.length);
    builder.unmount();
  });
});
