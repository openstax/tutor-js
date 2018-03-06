import React from 'react';
import { observer } from 'mobx-react';
import TaskResult from '../../models/course/scores/task-result';
import TH from '../../helpers/task';
import Percent from './percent';
import TutorLink from '../../components/link';

const ReviewLink = ({ task, children }) => {
  const { course } = task.student.period;
  if (!course.isTeacher) {
    return children;
  }
  return (
    <TutorLink
      to="viewTaskStep"
      data-assignment-type={`${task.type}`}
      params={{ courseId: course.id, id: task.id, stepIndex: 1 }}
    >
      {children}
    </TutorLink>
  );
};

@observer
export default class PercentCorrect extends React.Component {

  static propTypes = {
    task: React.PropTypes.instanceOf(TaskResult).isRequired,
  }

  render() {
    const { task } = this.props;
    const isDue = TH.isDue(task);
    if (task.isStarted || isDue) {
      const value = <Percent className="correct" value={task.score} />;
      return task.isStarted ?
        <ReviewLink task={task}>{value}</ReviewLink> : value;
    } else {
      return <div className="correct unstarted">---</div>;
    }
  }
}
