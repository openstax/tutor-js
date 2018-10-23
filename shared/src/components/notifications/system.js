import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

class SystemNotification extends React.Component {
  static displayName = 'SystemNotification';

  static propTypes = {
    onDismiss: PropTypes.func.isRequired,

    notice: PropTypes.shape({
      id: PropTypes.string.isRequired,
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
          <i className={`icon fa fa-${this.getIcon()}`} />
          {this.props.notice.message}
        </span>
        <a className="dismiss" onClick={this.props.onDismiss}>
          <i className="icon fa fa-close" />
        </a>
      </div>
    );
  }
}

export default SystemNotification;
