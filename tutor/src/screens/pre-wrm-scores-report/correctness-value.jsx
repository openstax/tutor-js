import PropTypes from 'prop-types';
import React from 'react';
import { isNil } from 'lodash';
import { observer } from 'mobx-react';
import S from '../../helpers/string';
import TaskResult from '../../models/scores/task-result';
import TutorLink from '../../components/link';
import UX from './ux';

const ReviewLink = ({ task, children }) => {
  const { course } = task.student.period;
  if (!course.currentRole.isTeacher) {
    return children;
  }
  return (
    <TutorLink
      to="viewTask"
      data-assignment-type={`${task.type}`}
      params={{ courseId: course.id, id: task.id }}
    >
      {children}
    </TutorLink>
  );
};

ReviewLink.propTypes = {
  task: PropTypes.instanceOf(TaskResult).isRequired,
  children: PropTypes.node.isRequired,
};

const Progress = observer(({ task }) => {
  const progress = isNil(task.correct_exercise_count) ? '---' : task.preWrmHumanScoreNumber;
  return <div className="correct-progress">{progress}</div>;
});

const Percent = observer(({ task: { published_score } }) => {
  // Pre-WRM scores don't get higher precision
  const display = isNil(published_score) ? '---' : `${S.asPercent(published_score)}%`;
  return <div className="correct-score">{display}</div>;
});


export default
@observer
class CorrectnessValue extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    task: PropTypes.instanceOf(TaskResult).isRequired,
  }

  render() {
    const { ux, task, task: { isDue } } = this.props;

    if (task.isStarted || isDue) {
      const Display = (ux.displayValuesAs === 'percentage') ? Percent : Progress;
      const value = <Display task={task} />;

      return task.isStarted ?
        <ReviewLink task={task}>{value}</ReviewLink> : value;
    } else {
      return <div className="correct unstarted">---</div>;
    }
  }
}
