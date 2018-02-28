import React from 'react';
import TutorLink from '../../components/link';
import LateIcon from '../../components/late-icon';

const STATUS = {
  'completed':   'Clicked',
  'in_progress': 'Viewed',
  'not_started': '---',
};

export default class ExternalCell extends React.PureComponent {

  static propTypes = {
    className: React.PropTypes.string,
    courseId: React.PropTypes.string.isRequired,
    period: React.PropTypes.object.isRequired,
    task: React.PropTypes.shape({
      id: React.PropTypes.number,
      type: React.PropTypes.string,
      status: React.PropTypes.string,
    }).isRequired,
  }

  renderLateIcon() {
    if (this.props.period.course.isTeacher) {
      return <LateIcon {...this.props} />;
    }
    return null;
  }

  renderLink({ message }) {
    return (
      <TutorLink
        className={`task-result status-cell ${this.props.className}`}
        to="viewTask"
        data-assignment-type={`${this.props.task.type}`}
        params={{ courseId: this.props.courseId, id: this.props.task.id }}>
        <span>
          {message}
        </span>
        {this.renderLateIcon()}
      </TutorLink>
    );
  }

  render() {
    return (
      <div className="external-cell">
        {this.renderLink({ message: STATUS[this.props.task.status] })}
      </div>
    );
  }

}
