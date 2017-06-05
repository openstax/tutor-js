import React from 'react';
import { action } from 'mobx';

export default class ValueProp extends React.PureComponent {

  @action.bound
  onHide() {
    this.props.ride.joyrideRef.next()
  }

  render () {
    return (
      <div className="super value-prop">
        <h3>This is the VALUE OF TUTOR!</h3>
        <button onClick={this.onHide}>Done</button>
      </div>
    );
  }
}
