import React from 'react';
import { observable } from 'mobx';
import { Provider, observer, inject } from 'mobx-react';

import Joyride from 'react-joyride';
// When/if we move to using scss this can be imported in the main scss import
import 'resources/styles/components/tours/joyride.scss';
import TourContext from '../../models/tour/context';
import { SpyModeContext, Content as SpyModeContent } from 'shared/src/components/spy-mode';

import { create } from 'lodash';

let { createComponent } = Joyride.prototype;

Joyride.prototype.createComponent = function() {
  const { index, standaloneData } = this.state;
  const { steps } = this.props;

  const currentStep = standaloneData || steps[index];
  const step = { ...currentStep };

  if (step.customComponent) {
    return step.customComponent(this.state.xPos, this.state.yPos);
  } else {
    return createComponent.call(this);
  }
}

@inject("spyMode") @observer
export default class TourConductor extends React.PureComponent {

  @observable tourContext;

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    spyMode: React.PropTypes.instanceOf(SpyModeContext).isRequired,
  }

  constructor(props) {
    super(props);
    this.tourContext = new TourContext({ isEnabled: true });
  }

  componentWillReceiveProps(nextProps) {
    this.tourContext.emitDebugInfo = true
//    this.tourContext.isEnabled = this.tourContext.emitDebugInfo = nextProps.spyMode.isEnabled;
  }

  renderTour() {
    return this.tourContext.tourRide ?
      <Joyride {...this.tourContext.tourRide.joyrideProps} /> : null;
  }

  renderSpyModeInfo() {
    // return null; // temporarily disabled while tours are demoed
    return (
      <SpyModeContent>
        <div className="tour-spy-info">{this.tourContext.debugStatus}</div>
      </SpyModeContent>
    );
  }

  render() {
    return (
      <Provider tourContext={this.tourContext}>
        <div data-purpose="tour-conductor-wrapper">
          {this.renderTour()}
          {this.props.children}
          {this.renderSpyModeInfo()}
        </div>
      </Provider>
    );
  }


}
