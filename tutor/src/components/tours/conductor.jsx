import React from 'react';
import { observable, observe } from 'mobx';
import { Provider, observer, inject } from 'mobx-react';
import { autobind } from 'core-decorators';
import Joyride from 'react-joyride';
// When/if we move to using scss this can be imported in the main scss import
import 'resources/styles/components/tours/joyride.scss';
import TourContext from '../../models/tour/context';
import User from '../../models/user';
import { SpyModeContext, Content as SpyModeContent } from 'shared/src/components/spy-mode';

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

  componentWillUnmount() {
    this.spyModeObserverDispose();
  }

  componentWillMount() {
    this.spyModeObserverDispose = observe(this.props.spyMode, 'isEnabled', this.onSpyModelChange);
  }

  @autobind
  onSpyModelChange({ newValue: isEnabled }) {
    this.tourContext.emitDebugInfo = isEnabled;
    if (isEnabled) {
      User.resetTours();

    }
  }

  renderTour() {
    return this.tourContext.tourRide ?
      <Joyride {...this.tourContext.tourRide.joyrideProps} /> : null;
  }

  renderSpyModeInfo() {
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
