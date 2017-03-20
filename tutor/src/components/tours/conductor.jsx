import React from 'react';
import { observable } from 'mobx';
import { Provider, observer } from 'mobx-react';

import Joyride from 'react-joyride';
// When/if we move to using scss this can be imported in the main scss import
import 'resources/styles/components/tours/joyride.scss';
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
    return this.tourContext.tourRide ?
      <Joyride {...this.tourContext.tourRide.joyrideProps} /> : null;
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
