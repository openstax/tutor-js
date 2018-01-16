import { Testing } from '../../components/helpers/component-testing';
import bootstrapScores from '../../helpers/scores-data.js';

import { LateWorkPopover } from '../../../src/screens/scores-report/late-work';

describe('Student Scores Latework Popover', function() {

  let props;
  let scores;
  let task;

  beforeEach(() => {
    ({ scores } = bootstrapScores());
    task = scores.getTask(18);
    task.acceptLate = jest.fn(() => Promise.resolve());
    props = {
      task,
      columnIndex: 0,
      hide: jest.fn(),
    };
  });

  it('accepts task on late button click and hides itself', function() {
    const lw = mount(<LateWorkPopover {...props} />);
    lw.find('.late-button').simulate('click');
    expect(task.acceptLate).toHaveBeenCalled();
  });

  it('displays re-approve messages for addtional work', function() {
    props.task.is_late_work_accepted = true;
    props.task.completed_exercise_count = 7;
    props.task.completed_on_time_step_count = 0;
    props.task.completed_accepted_late_exercise_count = 2;
    props.task.completed_accepted_late_step_count = 2;
    props.task.completed_step_count = 7;
    const lw = mount(<LateWorkPopover {...props} />);
    expect(lw.text()).toContain('student worked 3 questions');
    expect(lw.find('.popover-title').first().text()).to.equal('Additional late work');
  });
});
