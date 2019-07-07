import Event from '../../../src/screens/assignment-builder/event';
import { C, TimeMock, createUX, setTaskDates } from './helpers';

describe('Event Plan', function() {
  let props;

  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(() => {
    const ux = createUX({ now, type: 'event' });
    props = { ux };
  });

  it('works on happy path', () => {
    const plan = mount(<C><Event {...props} /></C>);

    plan.find('TutorInput[name="title"] input').simulate('change', {
      target: { value: 'Do this thing' },
    });
    plan.find('TutorTextArea[name="description"] textarea').simulate('change', {
      target: { value: 'This is more info about the thing' },
    });

    setTaskDates({ plan, now });

    plan.find('SaveButton AsyncButton').simulate('click');

    expect(props.ux.plan.title).toEqual('Do this thing');
    expect(props.ux.plan.description).toEqual('This is more info about the thing');

    plan.unmount();
  });
});
