import PropTypes from 'prop-types';
import React from 'react';
import _ from 'underscore';
import classnames from 'classnames';

class ControlsOverlay extends React.Component {
  static propTypes = {
    onClick:  PropTypes.func,
    actions:  PropTypes.object,
    exercise: PropTypes.object.isRequired,
  };

  onActionClick = (ev, handler) => {
    if (this.props.onClick) { ev.stopPropagation(); } // needed to prevent click from triggering onOverlay handler
    return handler(ev, this.props.exercise);
  };

  onClick = (ev) => {
    return this.props.onClick(ev, this.props.exercise);
  };

  render() {
    if (_.isEmpty(this.props.actions)) { return null; }

    return (
      <div
        onClick={this.props.onClick ? this.onClick : undefined}
        className={classnames('controls-overlay', { active: this.props.isSelected })}>
        <div className="message">
          {(() => {
            const result = [];
            for (let type in this.props.actions) {
              const action = this.props.actions[type];
              result.push(<div
                key={type}
                className={`action ${type}`}
                onClick={_.partial(this.onActionClick, _, action.handler)}>
                <span>
                  {action.message}
                </span>
              </div>);
            }
            return result;
          })()}
        </div>
      </div>
    );
  }
}


export default ControlsOverlay;
