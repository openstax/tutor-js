import PropTypes from 'prop-types';
import React from 'react';
import TaskResult from '../../models/scores/task-result';
import { observer } from 'mobx-react';
import cn from 'classnames';

const Q0 = (
  <g id="q0">
    <g>
      <circle fill="#DDDDDD" cx="12.334" cy="11.583" r="12" />
    </g>
    <line
      fill="none"
      stroke="#FFFFFF"
      strokeMiterlimit="10"
      x1="12.334"
      y1="-0.417"
      x2="12.334"
      y2="23.582" />
    <line
      fill="none"
      stroke="#FFFFFF"
      strokeMiterlimit="10"
      x1="0.334"
      y1="11.583"
      x2="24.334"
      y2="11.583" />
  </g>
);

const Q1 = (
  <g id="q1">
    <g>
      <circle fill="#DDDDDD" cx="12.334" cy="11.583" r="12" />
      <path
        d="M12.334,11.582h12l0,0c0-6.628-5.371-12-12-12V11.582z" />
    </g>
    <line
      fill="none"
      stroke="#FFFFFF"
      strokeMiterlimit="10"
      x1="12.334"
      y1="-0.417"
      x2="12.334"
      y2="23.582" />
    <line
      fill="none"
      stroke="#FFFFFF"
      strokeMiterlimit="10"
      x1="0.334"
      y1="11.583"
      x2="24.334"
      y2="11.583" />
  </g>
);

const Q2 = (
  <g id="q2">
    <g>
      <circle fill="#DDDDDD" cx="11.566" cy="11.582" r="12" />
      <path
        d="M11.566-0.417v24c6.629,0,12-5.371,12-12C23.566,4.955,18.195-0.417,11.566-0.417z" />
    </g>
    <line
      fill="none"
      stroke="#FFFFFF"
      strokeMiterlimit="10"
      x1="11.566"
      y1="-0.417"
      x2="11.566"
      y2="23.582" />
    <line
      fill="none"
      stroke="#FFFFFF"
      strokeMiterlimit="10"
      x1="-0.434"
      y1="11.583"
      x2="23.566"
      y2="11.583" />
  </g>
);

const Q3 = (
  <g id="q3">
    <g>
      <circle fill="#DDDDDD" cx="11.799" cy="11.583" r="12" />
      <g>
        <path
          d={'M11.799-0.418v12h-12c0,6.627,5.373,12,12,12s12-5.373, \
12-12C23.799,4.955,18.426-0.418,11.799-0.418z'} />
      </g>
    </g>
    <g>
      <line
        fill="none"
        stroke="#FFFFFF"
        strokeMiterlimit="10"
        x1="11.798"
        y1="-0.417"
        x2="11.798"
        y2="23.582" />
      <line
        fill="none"
        stroke="#FFFFFF"
        strokeMiterlimit="10"
        x1="-0.202"
        y1="11.583"
        x2="23.799"
        y2="11.583" />
    </g>
  </g>
);

const Q4 = (
  <g id="q4">
    <circle cx="12.03" cy="11.583" r="12" />
    <g>
      <line
        fill="none"
        stroke="#FFFFFF"
        strokeMiterlimit="10"
        x1="12.03"
        y1="-0.418"
        x2="12.03"
        y2="23.582" />
      <line
        fill="none"
        stroke="#FFFFFF"
        strokeMiterlimit="10"
        x1="0.03"
        y1="11.582"
        x2="24.03"
        y2="11.582" />
    </g>
  </g>
);

export default
@observer
class PieProgress extends React.Component {

  static propTypes = {
    task: PropTypes.instanceOf(TaskResult).isRequired,
    size: PropTypes.number,
  };

  static defaultProps = {
    size: 20,
  }

  roundToQuarters(task) {
    const value = task.completedPercent;
    if (!value)                         { return 0;  }
    if (value <= 49)                    { return 25; }
    if ((value >= 50) && (value < 75))  { return 50; }
    if ((value >= 75) && (value < 100)) { return 75; }
    return 100;
  }

  render() {
    const { size, task, task: { isDue } } = this.props;

    if (!isDue && !task.isStarted) {
      return <div className="unstarted">---</div>;
    }

    const progress = this.roundToQuarters(task);

    const pieCircle =
      <svg
        width={`${size}`}
        height={`${size}`}
        className={cn('pie-progress', { due: isDue, started: task.isStarted })}
        viewBox="0 0 24 24"
      >
        {progress === 0 && Q0}
        {progress === 25 && Q1}
        {progress === 50 && Q2}
        {progress === 75 && Q3}
        {progress === 100 && Q4}
      </svg>;

    return pieCircle;

  }
}
