import { React, R } from '../../helpers';
import bootstrapScores from '../../helpers/scores-data.js';
import Cell from '../../../src/screens/scores-report/homework-cell';
import ScoresUX from '../../../src/screens/scores-report/ux';

describe('Student Scores Homework Cell', function() {
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
      columnIndex: 1,
      student: {
        name: 'Molly Bloom',
        role: 1,
      },
    };
  });

  it('renders as completed', function() {
    props.task.completed_on_time_step_count = 4;
    props.task.completed_step_count = 4;
    task.score = 0.8112;
    expect(task.isLate).toBe(false);
    const cell = mount(<R><Cell {...props} /></R>);
    expect(cell.text()).toEqual('81%');
    expect(cell).not.toHaveRendered('.late-caret');
    ux.displayValuesAs = 'number';
    expect(cell.text()).toEqual('2 of 4');
  });

  it('renders progress cell', function() {
    props.size = 24;
    props.value = 33;
    const cell = mount(<R><Cell {...props} /></R>);
    expect(cell).toHaveRendered('PieProgress');
  });

  it('renders dashes when no data', () => {
    props.task.correct_exercise_count = props.task.score = undefined;
    const cell = mount(<R><Cell {...props} /></R>);
    expect(cell).toHaveRendered('.correct-score');
    expect(cell.text()).toContain('---');
    ux.displayValuesAs = 'number';
    expect(cell).toHaveRendered('.correct-progress');
    expect(cell.text()).toContain('---');
  });

  it('renders as not started', function() {
    props.task.completed_exercise_count = 0;
    props.task.completed_on_time_exercise_count = 0;
    props.task.completed_step_count = 0;
    props.task.correct_on_time_exercise_count = 0;
    expect(props.task.isStarted).toBe(false);
    const cell = mount(<R><Cell {...props} /></R>);
    expect(cell).toHaveRendered('.pie-progress.due');
    expect(cell.text()).toEqual('50%');
    expect(cell).not.toHaveRendered('.late-caret-trigger');
  });

  it('displays late caret when worked late', function() {
    props.task.completed_on_time_step_count = 3;
    props.task.completed_step_count = 4;
    expect(task.isLate).toBe(true);
    const cell = mount(<R><Cell {...props} /></R>);
    expect(cell).toHaveRendered('.late-caret');
  });

  it('displays accepted caret when accepted', function() {
    props.task.completed_on_time_step_count = 3;
    props.task.is_late_work_accepted = true;
    const cell = mount(<R><Cell {...props} /></R>);
    expect(cell).toHaveRendered('.late-caret.accepted');
  });

  it('hides late work from students', () => {
    const cell = mount(<R><Cell {...props} /></R>);
    expect(cell).toHaveRendered('.late-caret');
    props.task.student.period.course.roles[0].type = 'student';
    expect(cell.update()).not.toHaveRendered('.late-caret');
  });

});
