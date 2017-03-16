import React from 'react';
import { observable } from 'mobx';
import { Provider, observer } from 'mobx-react';

import Joyride from 'react-joyride';

import TourContext from '../../models/tour/context';

@observer
export default class TourConductor extends React.PureComponent {

  @observable tourContext;

  static propTypes = {
    children: React.PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props);
    this.tourContext = new TourContext(this.props);
  }

  renderTour() {
    if (this.tourContext.tourRide) {
      return <Joyride {...this.tourContext.tourRide.joyrideProps} />;
    }
  }

  render() {
    return (
      <Provider tourContext={this.tourContext}>
        <div data-purpose="tour-conductor-wrapper">
          {this.renderTour()}
          {this.props.children}
        </div>
      </Provider>
    );
  }


}
