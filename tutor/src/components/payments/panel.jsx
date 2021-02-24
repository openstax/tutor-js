import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import Payments from '../../models/payments';
import OXFancyLoader from 'shared/components/staxly-animation';
import BrowserWarning, { isBrowserExcluded } from '../browser-warning-modal';

@observer
export default
class PaymentsCard extends React.Component {

  static propTypes = {
      course: PropTypes.object.isRequired,
      onCancel: PropTypes.func.isRequired,
      onPaymentComplete: PropTypes.func.isRequired,
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
                  <Button variant="primary" onClick={this.props.onCancel}>
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

}
