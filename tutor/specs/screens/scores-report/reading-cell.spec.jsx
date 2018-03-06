import { React, Testing, _ } from '../../components/helpers/component-testing';
import bootstrapScores from '../../helpers/scores-data.js';
import Cell from '../../../src/screens/scores-report/reading-cell';
import PieProgress from '../../../src/screens/scores-report/pie-progress';
import TH from '../../../src/helpers/task';

describe('Student Scores Report Reading Cell', function() {
  let task;
  let props;
  let scores;
  let period;

  beforeEach(function() {
    ({ scores, period } = bootstrapScores());
    task = scores.getTask(2);
    props = {
      courseId: '1',
      columnIndex: 0,
      isConceptCoach: false,
      student: {
        name: 'Molly Bloom',
        role: 1,
      },
      task,
      period,
    };
  });


  it('renders as not started', function() {
    props.task.completed_step_count = 0;
    props.task.completed_on_time_step_count = 0;
    expect(TH.getCompletedPercent(props.task)).to.equal(0);
    const wrapper = shallow(<Cell {...props} />);
    expect(wrapper).not.toHaveRendered('.worked .not-started');
  });

  it('displays late caret when worked late', function() {
    props.task.completed_on_time_step_count = 3;
    const wrapper = shallow(<Cell {...props} />);
    expect(wrapper).toHaveRendered('LateWork');
  });

  it('displays accepted caret when accepted', function() {
    props.task.completed_on_time_step_count = 1;
    props.task.completed_step_count = 2;
    props.task.is_late_work_accepted = true;
    expect(props.task.isLate).toBe(true);
    const wrapper = mount(<Cell {...props} />);
    expect(wrapper).toHaveRendered('LateWork');
    expect(wrapper).toHaveRendered('.late-caret.accepted');
  });

});
