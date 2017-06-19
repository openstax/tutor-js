import React from 'react';
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { action, observe, observable } from 'mobx';
import { Modal } from 'react-bootstrap';
import { get, pick } from 'lodash';
import TourContext from '../../models/tour/context';
import Onboarding from '../../models/course/onboarding/base';
import { autobind } from 'core-decorators';

@inject((context) => pick(context, 'tourContext', 'spyMode'))
@observer
export default class CourseNagModal extends React.PureComponent {

  static propTypes = {
    ux: MobxPropTypes.observableObject,
    tourContext: React.PropTypes.instanceOf(TourContext).isRequired,
    spyMode: MobxPropTypes.observableObject,
  }

  @action.bound
  onDismiss() { this.isDismissed = true; }

  @observable isDismissed = false

  componentWillUnmount() {
    if (this.spyModeObserverDispose) { this.spyModeObserverDispose(); }
  }

  componentWillMount() {
    if (this.props.spyMode) {
      this.spyModeObserverDispose = observe(this.props.spyMode, 'isEnabled', this.onSpyModelChange);
    }
  }

  @autobind
  onSpyModelChange({ newValue: isEnabled }) {
    Onboarding.spyMode = isEnabled;
  }

  render() {
    const NagComponent = get(this.props, 'ux.nagComponent');

    if (this.props.tourContext.tour || this.isDismissed || !NagComponent) {
      return null;
    }

    return (
      <Modal
        show={!this.isDismissed}
        onHide={this.onClose}
        className="onboarding"
      >
        <NagComponent
          onDismiss={this.onDismiss}
          ux={this.props.ux}
        />
      </Modal>
    );
  }


}
