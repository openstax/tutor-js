import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import Icon from '../icon';

class SystemNotification extends React.Component {
  static displayName = 'SystemNotification';

  static propTypes = {
    onDismiss: PropTypes.func.isRequired,

    notice: PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.string,
      level: PropTypes.string,
      acknowledged: PropTypes.bool,
      message: PropTypes.string.isRequired,
    }).isRequired,
  };

  getIcon = () => {
    if (this.props.notice.icon) { return this.props.notice.icon; }
    switch (this.props.notice.level) {
      case 'alert': return 'exclamation-triangle';
      case 'error': case 'warning': return 'exclamation-circle';
      default:
        return 'info-circle';
    }
  };

  render() {

    return (
      <div
        className={classnames('notification', 'system', this.props.notice.level,
          { acknowledged: this.props.notice.acknowledged }
        )}>
        <span className="body">
          <Icon type={this.getIcon()} />
          {this.props.notice.message}
        </span>
        <Icon type="close" className="dismiss" onClick={this.props.onDismiss} />
      </div>
    );
  }
}

export default SystemNotification;
