import { React, PropTypes } from 'vendor';
import { observe, computed, observable } from 'mobx';
import { Provider, observer, inject } from 'mobx-react';
import { autobind } from 'core-decorators';
import TourContext from '../../models/tour/context';
import User from '../../models/user';
import { SpyModeContext, SpyModeContent } from 'shared/components/spy-mode';
import ModalManager from '../modal-manager';
import Step from './step';

@inject('modalManager', 'spyMode')
@observer
export default
class TourConductor extends React.Component {

  @observable tourContext;
  @observable menuOpen = false;

  static propTypes = {
      children: PropTypes.node.isRequired,
      modalManager: PropTypes.instanceOf(ModalManager).isRequired,
      spyMode: PropTypes.instanceOf(SpyModeContext).isRequired,
      tourContext: PropTypes.instanceOf(TourContext),
  }

  constructor(props) {
      super(props);
      modelize(this);
      this.tourContext = props.tourContext || new TourContext();

      this.props.modalManager.queue(this, 2);
      this.spyModeObserverDispose = observe(this.props.spyMode, 'isEnabled', this.onSpyModelChange);
  }

  componentWillUnmount() {
      this.spyModeObserverDispose();
  }

  @autobind
  onSpyModelChange({ newValue: isEnabled }) {
      if (isEnabled) {
          User.resetTours();
      }
  }

  @computed get isReady() {
      return Boolean(
          this.tourContext.isReady &&
        this.tourContext.tourRide &&
        this.tourContext.tourRide.isReady
      );
  }

  renderTour() {
      if (this.props.modalManager.canDisplay(this)) {
          const { tourRide } = this.tourContext;
          return <Step {...tourRide.props} />;
      }
      return null;
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
