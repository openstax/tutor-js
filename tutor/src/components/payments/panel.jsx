import React from 'react';
import { Alert } from 'react-bootstrap';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import Payments from '../../models/payments';
import OXFancyLoader from '../ox-fancy-loader';

@observer
export default class PaymentsPanel extends React.PureComponent {

  static propTypes = {
    course: MobxPropTypes.observableObject.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onPaymentComplete: React.PropTypes.func.isRequired,
  }

  payments = new Payments({
    product_uuid: 'e6d22dbc-0a01-5131-84ba-2214bbe4d74d', // FIXME get this from course once it's on representer
    course: this.props.course,
    messageHandlers: {
      cancel: this.props.onCancel,
      payment: this.props.onPaymentComplete,
    },
  })

  componentWillUnmount() {
    this.payments.close();
  }

  renderErrors(payments) {
    if (payments.hasError) {
      return <Alert bsStyle="danger" onDismiss={this.props.onCancel}>{payments.errorMessage}</Alert>;
    }
    return null;
  }

  render() {
    const { payments } = this;

    return (
      <div className="payments-panel">
        <OXFancyLoader isLoading={payments.isBusy} />
        {this.renderErrors(payments)}
        <div className="payments-wrapper" ref={el => payments.element=el} />
      </div>
    );
  }

}
