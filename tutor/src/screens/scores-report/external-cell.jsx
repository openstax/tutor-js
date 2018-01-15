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
    task: React.PropTypes.shape({
      id: React.PropTypes.number,
      type: React.PropTypes.string,
      status: React.PropTypes.string,
    }).isRequired,
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
        <LateIcon {...this.props} />
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
