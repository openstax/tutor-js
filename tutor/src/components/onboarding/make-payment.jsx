import React from 'react';

import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import PaymentsPanel from '../payments/panel';
import { OnboardingNag, Body } from './onboarding-nag';

@observer
export default class MakePayment extends React.PureComponent {

  static propTypes = {
    ux: MobxPropTypes.observableObject.isRequired,
  }

  static className = 'make-payment';

  render() {
    const { ux } = this.props;

    return (
      <OnboardingNag className="make-payment">
        <PaymentsPanel onCancel={ux.onPayLater} onPaymentComplete={ux.onPaymentComplete} course={ux.course} />
      </OnboardingNag>
    );
  }

}
