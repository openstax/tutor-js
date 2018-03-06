import React from 'react';
import { observer } from 'mobx-react';
import TaskResult from '../../models/course/scores/task-result';
import TH from '../../helpers/task';
import Percent from './percent';

@observer
export default class PercentCorrect extends React.Component {

  static propTypes = {
    task: React.PropTypes.instanceOf(TaskResult).isRequired,
  }

  render() {
    const { task } = this.props;
    if (task.isStarted || TH.isDue(task)) {
      return <Percent className="correct" value={task.score} />;
    } else {
      return <div className="correct unstarted">---</div>;
    }
  }
}
