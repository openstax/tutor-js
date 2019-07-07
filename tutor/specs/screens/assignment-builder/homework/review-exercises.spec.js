import { React, C, TimeMock, createUX } from '../helpers';
import ReviewExercises from '../../../../src/screens/assignment-builder/homework/review-exercises';

jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);


describe('choose exercises component', function() {
  let props;
  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(function() {
    const ux = createUX({ now });
    ux.plan.settings.exercise_ids = [ ux.exercises.array[0].id ];
    props = { ux };
  });

  it('matches snapshot', () => {
    const revex = mount(<C><ReviewExercises {...props} /></C>);
    expect.snapshot(revex.debug()).toMatchSnapshot();
    revex.unmount();
  });

});
