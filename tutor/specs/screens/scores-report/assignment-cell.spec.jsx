import { React, R } from '../../helpers';
import bootstrapScores from '../../helpers/scores-data.js';
import Cell from '../../../src/screens/scores-report/assignment-cell';
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
      rowIndex: 1,
      columnIndex: 0,
      headings: [
        { type: 'reading' },
      ],
    };
  });

  it('renders as absent for null type', function() {
    props.task.type = undefined;
    const student = props.ux.students[props.rowIndex];
    student.data[props.columnIndex].type = 'unknown';
    const cell = mount(<R><Cell {...props} /></R>);
    expect(cell).toHaveRendered('AbsentCell');
    expect.snapshot(
      <Cell {...props} />
    ).toMatchSnapshot();
  });

});
