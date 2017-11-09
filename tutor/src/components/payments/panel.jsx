import React from 'react';
import { Button } from 'react-bootstrap';
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
      return (
        <div className="error-message">
          <p>{payments.errorMessage}</p>
          <Button bsStyle="primary" onClick={this.props.onCancel}>
            Close
          </Button>
        </div>
      );
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
