import PropTypes from 'prop-types';
import React from 'react';

import { observer } from 'mobx-react';
import PaymentsCard from '../payments/panel';
import { OnboardingNag } from './onboarding-nag';

@observer
export default
class MakePayment extends React.Component {

  static propTypes = {
    ux: PropTypes.object.isRequired,
    onDismiss: PropTypes.func.isRequired,
  }

  static className = 'make-payment';

  render() {
    const { ux } = this.props;

    return (
      <OnboardingNag className="make-payment">
        <PaymentsCard onCancel={ux.onPayLater} onPaymentComplete={ux.onPaymentComplete} course={ux.course} />
      </OnboardingNag>
    );
  }

}
