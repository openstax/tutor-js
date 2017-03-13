import React from 'react';
import { observable } from 'mobx';
import { Provider, observer } from 'mobx-react';

import Joyride from 'react-joyride';
import 'react-joyride/lib/react-joyride-compiled.css';

import TourContext from '../../models/tour/context';

@observer
export default class TourConductor extends React.PureComponent {

  @observable tourContext;

  constructor(props) {
    super(props);
    this.tourContext = new TourContext(this.props);
  }

  renderTour() {
    const { tour, joyrideProps } = this.tourContext;

    if (tour) {
      return <Joyride {...joyrideProps} />;
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
