import React from 'react';
import { action } from 'mobx';

export default class HowToUseQL extends React.PureComponent {


  @action.bound
  onHide() {
    this.props.ride.joyrideRef.next()
  }

  render () {
    return (
      <div>
        <h3>This is how you use The QL!</h3>
        <button onClick={this.onHide}>Done</button>
      </div>
    );
  }
}
