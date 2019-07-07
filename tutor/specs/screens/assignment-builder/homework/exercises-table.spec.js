import { React, C, TimeMock, createUX } from '../helpers';
import ExercisesTable from '../../../../src/screens/assignment-builder/homework/exercises-table';

jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('review exercises table', function() {
  let props;
  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(function() {
    const ux = createUX({ now });
    ux.plan.settings.exercise_ids = [ ux.exercises.array[0].id ];
    props = { ux };
  });

  it('matches snapshot', () => {
    const revex = mount(<C><ExercisesTable {...props} /></C>);
    expect.snapshot(revex.debug()).toMatchSnapshot();
    revex.unmount();
  });

  it('strips images', () => {
    const [ex] = props.ux.exercises.array;
    ex.content.questions[0].stem_html = `
      <div>
<p>hi image here: <img title="one"/></p>
<img title="two" />
        this is a test exercise
      </div>
    `;
    props.exercises = [ex];
    const et = mount(<ExercisesTable {...props} />);
    const html = et.find(`tr[data-ex-id=${ex.id}] div[dangerouslySetInnerHTML]`).props().dangerouslySetInnerHTML.__html;
    expect(html).toContain('this is a test exercise');
    expect(html).not.toContain('img');
    expect(html).toMatchSnapshot();
    et.unmount();
  });

});
