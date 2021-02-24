import PropTypes from 'prop-types';
import React from 'react';
import TutorLink from '../../components/link';
import LateIcon from '../../components/late-icon';
import UX from './ux';

const STATUS = {
    'completed':   'Clicked',
    'in_progress': 'Viewed',
    'not_started': '---',
};

export default class ExternalCell extends React.Component {

  static propTypes = {
      ux: PropTypes.instanceOf(UX).isRequired,
      className: PropTypes.string,
      task: PropTypes.shape({
          id: PropTypes.number,
          type: PropTypes.string,
          status: PropTypes.string,
      }).isRequired,
  }

  renderLateIcon() {
      if (this.props.ux.course.currentRole.isTeacher) {
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
              params={{ courseId: this.props.ux.course.id, id: this.props.task.id }}
          >
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
