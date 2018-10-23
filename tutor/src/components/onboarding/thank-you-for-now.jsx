import MobxPropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { OnboardingNag, Body, Heading, Footer } from './onboarding-nag';
import Link from '../link';

export default
@observer
class ThankYouForNow extends React.Component {

  static propTypes = {
    ux: MobxPropTypes.observableObject.isRequired,
    onDismiss: MobxPropTypes.func.isRequired,
  }

  render() {
    return (
      <OnboardingNag className="thanks">
        <Heading>
          Thank you!
        </Heading>
        <Body>
          Thanks for letting us know!
          <Button bsStyle="link" onClick={this.props.onDismiss}>Back to dashboard</Button>
        </Body>
      </OnboardingNag>
    );
  }

};
