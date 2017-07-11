import React from 'react';

import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import Payments from '../../models/payments';
import { OnboardingNag } from './onboarding-nag';

@observer
export default class MakePayment extends React.PureComponent {

  static propTypes = {
    ux: MobxPropTypes.observableObject.isRequired,
  }

  static className = 'make-payment';

  payments = new Payments({
    product_uuid: 'e6d22dbc-0a01-5131-84ba-2214bbe4d74d',
    course: this.props.ux.course,
    messageHandlers: {
      cancel: this.props.ux.payLater,
      payment: this.props.ux.onPaymentComplete,
    },
  })

  componentWillUnmount() {
    this.payments.close();
  }

  render() {

    return (
      <OnboardingNag className="make-payment">
        <div className="payments-wrapper" ref={el => this.payments.element=el} />
      </OnboardingNag>
    );
  }

}
