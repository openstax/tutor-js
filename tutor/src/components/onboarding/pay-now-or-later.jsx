import React from 'react';
import { Button } from 'react-bootstrap';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { OnboardingNag, Body } from './onboarding-nag';

@observer
export default class PayNowOrLater extends React.PureComponent {

  static propTypes = {
    ux: MobxPropTypes.observableObject.isRequired,
  }

  static className = 'pay-now-or-later';

  render() {
    const { ux } = this.props;

    return (
      <OnboardingNag className="pay-now-or-later">
        <Body>

          <Button bsStyle="primary" className="now" onClick={ux.payNow}>
            Buy access now
          </Button>
          <p>You may request a refund within 14 days of purchasing</p>

          <div className="or">or</div>

          <Button className="later" onClick={ux.onPayLater}>
            Try free for 14 days
          </Button>
          <p>You can enter payment info anytime</p>

        </Body>

      </OnboardingNag>
    );
  }

}
