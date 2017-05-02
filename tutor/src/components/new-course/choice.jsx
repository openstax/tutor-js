import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { ReactHelpers } from 'shared';

@observer
export default class CourseChoiceItem extends React.PureComponent {

  static propTypes = {
    onClick:    React.PropTypes.func.isRequired,
    className:  React.PropTypes.string,
    children:   React.PropTypes.node,
    active:     React.PropTypes.bool,
    disabled:   React.PropTypes.bool,
  }

  render() {
    return (
      <div
        role="button"
        {...ReactHelpers.filterProps(this.props)}
        className={classnames('list-group-item', 'choice', this.props.className, {
          active: this.props.active, disabled: this.props.disabled,
        })}
        onClick={this.props.onClick}
      >
        {this.props.children}
      </div>
    );
  }
}
