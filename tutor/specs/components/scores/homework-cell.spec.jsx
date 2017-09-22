import { React } from '../helpers/component-testing';
import bootstrapScores from '../../helpers/scores-data.js';
import Cell from '../../../src/components/scores/homework-cell';
import EnzymeContext from '../helpers/enzyme-context';

import TH from '../../../src/helpers/task';

describe('Student Scores Homework Cell', function() {
  let props;
  let scores;
  let task;

  beforeEach(() => {
    scores = bootstrapScores().scores;
    task = scores.getTask(18);
    props = {
      courseId: '1',
      columnIndex: 1,
      isConceptCoach: false,
      student: {
        name: 'Molly Bloom',
        role: 1,
      },
      task,
    };
  });

  it('renders as completed', function() {
    task.completed_on_time_step_count = task.completed_step_count;
    expect(task.isLate).toBe(false);
    const cell = mount(<Cell {...props} />, EnzymeContext.build());
    const score = ((task.correct_on_time_exercise_count / task.exercise_count) * 100).toFixed(0) + '%';
    expect(cell.find('.score a').text()).to.equal(score);
    expect(cell).not.toHaveRendered('.late-caret');
  });

  it('renders progress cell', function() {
    props.size = 24;
    props.value = 33;
    const cell = mount(<Cell {...props} />, EnzymeContext.build());
    expect(cell).toHaveRendered('PieProgress');
  });

  it('renders as not started', function() {
    props.task.completed_exercise_count = 0;
    props.task.completed_on_time_exercise_count = 0;
    props.task.correct_on_time_exercise_count = 0;
    const cell = mount(<Cell {...props} />, EnzymeContext.build());
    expect(TH.getCompletedPercent(props.task)).to.equal(0);
    expect(cell).toHaveRendered('.worked .not-started');
  });

  it('displays late caret when worked late', function() {
    props.task.completed_on_time_step_count = 3;
    props.task.completed_step_count = 4;
    expect(task.isLate).toBe(true);
    const cell = mount(<Cell {...props} />, EnzymeContext.build());
    expect(cell).toHaveRendered('.late-caret');
  });

  it('displays accepted caret when accepted', function() {
    props.task.completed_on_time_step_count = 3;
    props.task.is_late_work_accepted = true;
    const cell = mount(<Cell {...props} />, EnzymeContext.build());
    expect(cell).toHaveRendered('.late-caret.accepted');
  });

});
