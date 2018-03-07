import { React } from '../../components/helpers/component-testing';
import bootstrapScores from '../../helpers/scores-data.js';
import Cell from '../../../src/screens/scores-report/homework-cell';
import EnzymeContext from '../../components/helpers/enzyme-context';

import TH from '../../../src/helpers/task';

describe('Student Scores Homework Cell', function() {
  let props;
  let scores;
  let task;
  let period;

  beforeEach(() => {
    ({ scores, period } = bootstrapScores());
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
      period,
    };
  });

  it('renders as completed', function() {
    props.task.completed_on_time_step_count = 4;
    props.task.completed_step_count = 4;
    task.score = 0.8112;
    expect(task.isLate).toBe(false);
    const cell = mount(<Cell {...props} />, EnzymeContext.build());
    const score = ((task.correct_on_time_exercise_count / task.exercise_count) * 100).toFixed(0) + '%';
    expect(cell.text()).toEqual('81%');
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
    props.task.completed_step_count = 0;
    props.task.correct_on_time_exercise_count = 0;
    expect(props.task.isStarted).toBe(false);
    const cell = mount(<Cell {...props} />, EnzymeContext.build());
    expect(cell).toHaveRendered('.pie-progress.due');
    expect(cell.text()).toEqual(`50%`);
    expect(cell).not.toHaveRendered('.late-caret-trigger');
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

  it('hides late work from students', () => {
    const cell = mount(<Cell {...props} />, EnzymeContext.build());
    expect(cell).toHaveRendered('.late-caret');
    props.task.student.period.course.roles[0].type = 'student';
    expect(cell).not.toHaveRendered('.late-caret');
  });

});
