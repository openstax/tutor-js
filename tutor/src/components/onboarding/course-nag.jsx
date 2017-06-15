import React from 'react';
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { action, observable, observe } from 'mobx';
import { Modal } from 'react-bootstrap';
import { get, pick } from 'lodash';
import TourContext from '../../models/tour/context';
import User from '../../models/user';

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
      this.spyModeObserverDispose = observe(this.props.spyMode, 'isEnabled', ({ newValue }) => {
        if (newValue) { this.resetOnboarding(); }
      });
    }
  }

  @action resetOnboarding() {
    User.viewed_tour_ids.clear();
    this.props.ux.course.resetToursAndOnboarding();
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
