import { React, SnapShot, Wrapper } from '../../helpers';
import bootstrapScores from '../../helpers/scores-data.js';
import Cell from '../../../src/screens/scores-report/assignment-cell';
import EnzymeContext from '../../helpers/enzyme-context';
import ScoresUX from '../../../src/screens/scores-report/ux';

describe('Student Scores Assignment Cell', function() {
  let props;
  let scores;
  let course;
  let task;
  let ux;

  beforeEach(() => {
    ({ course, scores } = bootstrapScores());
    ux = new ScoresUX(course);
    task = scores.getTask(18);
    props = {
      ux,
      task,
      columnIndex: 0,
      isConceptCoach: false,
      headings: [
        { type: 'reading' },
      ],
      students: [{
        name: 'Molly Bloom',
        role: 1,
        data: [ task ],
      }],
    };
  });

  it('renders as absent for null type', function() {
    props.task.type = undefined;
    const cell = mount(<Cell {...props} />, EnzymeContext.build());
    expect(cell).toHaveRendered('AbsentCell');
    expect.snapshot(
      <Cell {...props} />
    ).toMatchSnapshot();
  });

});
