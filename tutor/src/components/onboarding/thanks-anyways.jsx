import React from 'react';
import { Button } from 'react-bootstrap';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { OnboardingNag, Body, Heading, Footer } from './onboarding-nag';
import Link from '../link';

@observer
export default class ThanksAnways extends React.PureComponent {

  static propTypes = {
    ux: MobxPropTypes.observableObject.isRequired,
    onDismiss: React.PropTypes.func.isRequired,
  }

  render() {
    return (
      <OnboardingNag className="thanks">
        <Heading>
          Thanks for letting us know!
        </Heading>
        <Body>
          If you want to use OpenStax Tutor in the future, you’ll always be able to create a
          course from <Link to='myCourses'>My Courses</Link>.
          You can get there from a link in your profile menu.
        </Body>
        <Footer className="got-it">
          <Button bsStyle="primary" onClick={this.props.onDismiss}>Got it</Button>
        </Footer>
      </OnboardingNag>
    );
  }

}
