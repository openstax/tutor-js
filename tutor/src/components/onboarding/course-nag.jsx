import React from 'react';
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { action, observable } from 'mobx';
import { Modal } from 'react-bootstrap';
import { get, pick } from 'lodash';
import TourContext from '../../models/tour/context';
import Onboarding from '../../models/course/onboarding/base';

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.spyMode) {
      Onboarding.spyMode = nextProps.spyMode.isEnabled;
    }
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
