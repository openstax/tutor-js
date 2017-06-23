import React from 'react';
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { action, observe, observable } from 'mobx';
import { Modal } from 'react-bootstrap';
import { get, pick } from 'lodash';
import { autobind } from 'core-decorators';
import User from '../../models/user';

import OXFancyLoader from '../ox-fancy-loader';

import Payments from '../../models/payments';

@observer
export default class PaymentsModal extends React.PureComponent {

  @action.bound
  onDismiss() { this.isDismissed = true; }

  ux = new Payments();

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
