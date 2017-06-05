import React from 'react';
import { Button } from 'react-bootstrap';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { OnboardingNag, Body, Heading, Footer } from './onboarding-nag';

@observer
export default class CourseUseTips extends React.PureComponent {

  static propTypes = {
    ux: MobxPropTypes.observableObject.isRequired,
    onDismiss: React.PropTypes.func.isRequired,
  }

  render() {
    return (
      <OnboardingNag className="course-use-tips">
        <Heading>
          Great news! Let's pioneer the future of better learning together.
        </Heading>
        <Body>
          Your students can access your course as soon as you send them the enrollment code,
          found on the Course Settings in and Roster page. Also, download our best practices PDF
          so you can make the most of OpenStax Tutor.
        </Body>
        <Footer className="got-it">
          <Button bsStyle="primary" onClick={this.props.onDismiss}>Got it</Button>
        </Footer>
      </OnboardingNag>
    );
  }


}
