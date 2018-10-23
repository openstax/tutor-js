import MobxPropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import Payments from '../../models/payments';
import OXFancyLoader from '../ox-fancy-loader';
import BrowserWarning, { isBrowserExcluded } from '../browser-warning-modal';

export default
@observer
class PaymentsPanel extends React.Component {

  static propTypes = {
    course: MobxPropTypes.observableObject.isRequired,
    onCancel: MobxPropTypes.func.isRequired,
    onPaymentComplete: MobxPropTypes.func.isRequired,
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

    if (isBrowserExcluded()) {
      return (<BrowserWarning />);
    }

    return (
      <div className="payments-panel">
        <OXFancyLoader isLoading={payments.isBusy} />
        {this.renderErrors(payments)}
        <div className="payments-wrapper" ref={el => payments.element=el} />
      </div>
    );
  }

};
