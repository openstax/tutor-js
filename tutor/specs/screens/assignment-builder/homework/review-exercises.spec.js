import { React, C, TimeMock, createUX } from '../helpers';
import ReviewExercises from '../../../../src/screens/assignment-builder/homework/review-exercises';

jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);


describe('choose exercises component', function() {
  let props;
  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(async () => {
    const ux = await createUX({ now });
    ux.plan.settings.exercise_ids = [ ux.exercises.array[0].id ];
    props = { ux };
  });

  it('matches snapshot', () => {
    const revex = mount(<C><ReviewExercises {...props} /></C>);
    expect.snapshot(revex.debug()).toMatchSnapshot();
    revex.unmount();
  });

  it('renders MPQ individually', () => {
    props.ux.selectedExercises[0].content.questions = [
      props.ux.selectedExercises[0].content.questions[0],
      props.ux.selectedExercises[0].content.questions[0],
    ];
    expect(
      props.ux.selectedExercises[0].content.questions
    ).toHaveLength(2);
    const revex = mount(<C><ReviewExercises {...props} /></C>);
    expect(revex.find('.exercise-table .exercise-number')).toHaveLength(2);
    expect(revex.find('CardHeader .exercise-number').text()).toEqual('1 - 2');
    revex.unmount();
  });

});
