import React from 'react';
import { Button } from 'react-bootstrap';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { OnboardingNag, Body, Heading, Footer } from './onboarding-nag';
import Link from '../link';

@observer
export default class ThankYouForNow extends React.PureComponent {

  static propTypes = {
    ux: MobxPropTypes.observableObject.isRequired,
    onDismiss: React.PropTypes.func.isRequired,
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

}
