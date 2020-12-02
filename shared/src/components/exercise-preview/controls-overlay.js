import PropTypes from 'prop-types';
import React from 'react';
import { isEmpty, partial } from 'lodash';
import classnames from 'classnames';
import { Icon } from 'shared';

class ControlsOverlay extends React.Component {
  static propTypes = {
    onClick:  PropTypes.func,
    actions:  PropTypes.object,
    exercise: PropTypes.object.isRequired,
    isSelected: PropTypes.bool,
  };

  onActionClick = (ev, handler) => {
    if (this.props.onClick) { ev.stopPropagation(); } // needed to prevent click from triggering onOverlay handler
    return handler(ev, this.props.exercise);
  };

  onClick = (ev) => {
    return this.props.onClick(ev, this.props.exercise);
  };

  render() {
    if (isEmpty(this.props.actions)) { return null; }

    const iconTypes = {
      'include': 'plus-circle',
      'exclude': 'minus-circle',
      'copyEdit': 'edit',
      'feedback-on': 'eye',
      'feedback-off': 'eye-slash',
      'report-error': 'exclamation-circle',
    };

    return (
      <div
        onClick={this.props.onClick ? this.onClick : undefined}
        className={classnames('controls-overlay', { active: this.props.isSelected })}>
        <div className="message">
          {(() => {
            const result = [];
            for (let type in this.props.actions) {
              const action = this.props.actions[type];
              result.push(
                <div
                  key={type}
                  className={`action ${type}`}
                  onClick={partial(this.onActionClick, partial.placeholder, action.handler)}
                >
                  <Icon type={iconTypes[type]} />
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
