import React from 'react';
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { action, observe, observable } from 'mobx';
import { Modal } from 'react-bootstrap';
import { delay } from 'lodash';
import { autobind } from 'core-decorators';
import User from '../../models/user';
import Courses from '../../models/courses-map';

import OXFancyLoader from '../ox-fancy-loader';

import Payments from '../../models/payments';

@observer
export default class PaymentsModal extends React.PureComponent {

  @observable isDismissed;
  @observable hasPaid;

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
  }

  @action.bound
  onDismiss() { this.isDismissed = true; }


  ux = new Payments({
    product_uuid: 'e6d22dbc-0a01-5131-84ba-2214bbe4d74d',
    course: Courses.get(this.props.courseId),
    messageHandlers: {
      cancel: this.onDismiss,
      payment: this.onDismiss, // will probably be different (display thanks?)
    },
  })

  render() {
    // TODO something like this?:
    // if (!User.needsPayment) { return null }
    const { ux } = this;

    return (
      <Modal
        show={!this.isDismissed}
        onHide={this.onClose}
        className="payments"
      >
        <Modal.Header>
          PAYME!
        </Modal.Header>
        <div
          className="payments-wrapper"
          ref={b => ux.element=b}
        />


        <OXFancyLoader isLoading={ux.isBusy} />



      </Modal>
    );
  }


}
