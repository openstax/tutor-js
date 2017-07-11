import React from 'react';

import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import PaymentsModal from '../payments/modal';
import { OnboardingNag, Body } from './onboarding-nag';

@observer
export default class MakePayment extends React.PureComponent {

  static propTypes = {
    ux: MobxPropTypes.observableObject.isRequired,
  }

  render() {
    const { ux } = this.props;

    return (
      <OnboardingNag className="make-payment">
        <PaymentsModal
          onComplete={ux.onPaymentComplete}
          courseId={ux.course.id}
        />
      </OnboardingNag>
    );
  }

}
