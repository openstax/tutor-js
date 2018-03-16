import React from 'react';
import createReactClass from 'create-react-class';
import Icon from '../icon';

const MESSAGES = {
  student: (
    <div>
      <p key='s1'>The performance forecast is an estimate of your understanding of a topic.</p>
      <p key='s2'>{`\
        It is personalized display based on your answers to reading questions,
        homework problems, and previous practices.\
      `}</p>
    </div>
  ),
  teacher: (
    <div>
      <p key='s1'>The performance forecast is an estimate of each group’s understanding of a topic.</p>
      <p key='s2'>{`\
        It is personalized display based on their answers to reading questions,
        homework problems, and previous practices.\
      `}
      </p>
    </div>
  ),
  teacher_student: (
    <div>
      <p key='st1'>The performance forecast is an estimate of each student’s understanding of a topic.</p>
      <p key='st2'>{`\
        It is personalized display based on their answers to reading questions,
        homework problems, and previous practices.\
      `}
      </p>
    </div>
  ),
};

export default class PerformanceForecastInfoLink extends React.PureComponent {

  static propTypes = {
    type: React.PropTypes.oneOf(['student', 'teacher', 'teacher_student']).isRequired,
  }

  render() {
    return (
      <Icon
        className="info-link"
        type="info-circle"
        tooltipProps={{ placement: 'right' }}
        tooltip={MESSAGES[this.props.type]}
      />
    );
  }
};
