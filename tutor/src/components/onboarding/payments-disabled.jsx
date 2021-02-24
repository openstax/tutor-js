import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { OnboardingNag, Body } from './onboarding-nag';

@observer
export default
class PaymentsDisabled extends React.Component {

  static propTypes = {
      ux: PropTypes.object.isRequired,
      onDismiss: PropTypes.func.isRequired,
  }

  static className = 'payments-disabled';

  render() {
      const { ux } = this.props;

      return (
          <OnboardingNag className="payments-disabled">
              <Body>

                  <h3>
            You are now enrolled in {ux.course.name}
                  </h3>

                  <Button variant="primary" onClick={ux.acknowledgeTrial}>
            Start your free trial
                  </Button>
                  <p>
            You will be prompted to pay once the trial period is complete.
                  </p>

              </Body>

          </OnboardingNag>
      );
  }

}
