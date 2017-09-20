import React from 'react';

export default class PieProgress extends React.PureComponent {

  static propTypes = {
    size: React.PropTypes.number.isRequired,
    value: React.PropTypes.number.isRequired,
    isConceptCoach: React.PropTypes.bool.isRequired,
    isLate: React.PropTypes.bool,
  }

  roundToQuarters(value) {
    if (value <= 49) {
      return (
        25
      );
    } else if ((value >= 50) && (value < 75)) {
      return (
        50
      );
    } else if ((value >= 75) && (value < 100)) {
      return (
        75
      );
    } else {
      return (
        100
      );
    }
  }

  render() {
    const { size, value, isConceptCoach, isLate } = this.props;
    const progress = this.roundToQuarters(value);

    const lateClass = isLate && !isConceptCoach ? 'late' : '';
    const q1 =
      <g id="q1">
        <g>
          <circle fill="#DDDDDD" cx="12.334" cy="11.583" r="12" />
          <path
            className={`slice ${lateClass}`}
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
      </g>;
    const q2 =
      <g id="q2">
        <g>
          <circle fill="#DDDDDD" cx="11.566" cy="11.582" r="12" />
          <path
            className={`slice ${lateClass}`}
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
      </g>;
    const q3 =
      <g id="q3">
        <g>
          <circle fill="#DDDDDD" cx="11.799" cy="11.583" r="12" />
          <g>
            <path
              className={`slice ${lateClass}`}
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
      </g>;
    const q4 =
      <g id="q4">
        <circle className={`slice ${lateClass}`} cx="12.03" cy="11.583" r="12" />
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
      </g>;
    const pieCircle =
      <svg
        width={`${size}`}
        height={`${size}`}
        className="pie-progress"
        viewBox="0 0 24 24">
        {progress === 25 ? q1 : undefined}
        {progress === 50 ? q2 : undefined}
        {progress === 75 ? q3 : undefined}
        {progress === 100 ? q4 : undefined}
      </svg>;
    const finishedIcon =
      <svg
        width={`${size}`}
        height={`${size}`}
        viewBox="0 0 24 24"
        className="finished">
        <g>
          <circle className={`slice ${lateClass}`} cx="11.778" cy="12.296" r="12" />
          <g>
            <polygon
              fill="#FFFFFF"
              points="10.364,15.106 5.414,10.158 3.293,12.276 10.364,19.349 20.264,9.449 18.143,7.328" />
          </g>
        </g>
      </svg>;
    const notStarted = <span className="not-started">
      ---
    </span>;

    if (value >= 100) {
      if (isConceptCoach) { return finishedIcon; } else { return pieCircle; }
    } else if (value <= 0) {
      return (
        notStarted
      );
    } else {
      return (
        pieCircle
      );
    }
  }
}
