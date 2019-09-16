import { React, R } from '../../helpers';
import moment from 'moment';
import bootstrapScores from '../../helpers/scores-data.js';
import Cell from '../../../src/screens/scores-report/external-cell';
import ScoresUX from '../../../src/screens/scores-report/ux';

describe('Student Scores External Cell', function() {
  let props;
  let scores;
  let course;
  let task;
  let ux;

  beforeEach(() => {
    ({ course, scores } = bootstrapScores());
    ux = new ScoresUX(course);
    task = scores.getTask(702);
    props = {
      ux,
      task,
      columnIndex: 1,
      student: {
        name: 'Molly Bloom',
        role: 1,
      },
    };
  });


  it('renders late work icon', function() {
    const cell = mount(<R><Cell {...props} /></R>);
    expect(cell).toHaveRendered('LateIcon .late');
    expect(cell.find('OverlayTrigger').props().overlay.props.children).toEqual(
      'External was a month late'
    );
    cell.unmount();

  });

  it('renders late work iconspan', function() {
    task.last_worked_at = moment(task.last_worked_at).subtract(2, 'weeks').toDate();
    const cell = mount(<R><Cell {...props} /></R>);
    expect(cell.find('OverlayTrigger').props().overlay.props.children).toEqual(
      'External was 14 days late'
    );
  });

  it('hides late work icon', function() {
    task.last_worked_at = moment(task.due_at).subtract(1, 'day').toDate();
    const cell = mount(<R><Cell {...props} /></R>);
    expect(cell).not.toHaveRendered('LateIcon i.late'); // it renders but no icon
  });

});
