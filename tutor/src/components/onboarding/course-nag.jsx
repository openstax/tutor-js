import React from 'react';
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { action, observable } from 'mobx';
import { Modal } from 'react-bootstrap';
import { get } from 'lodash';
import TourContext from '../../models/tour/context';


@inject('tourContext')
@observer
export default class CourseNagModal extends React.PureComponent {

  static propTypes = {
    ux: MobxPropTypes.observableObject,
    tourContext: React.PropTypes.instanceOf(TourContext).isRequired,
  }

  @action.bound
  onDismiss() { this.isDismissed = true; }

  @observable isDismissed = false

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
