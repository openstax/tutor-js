import React from 'react';
import { action } from 'mobx';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { OnboardingNag, GotItOnboardingNag, Heading, Body, Footer } from './onboarding-nag';
import CourseUX from '../../models/course/ux';

export default
@observer
class PreviewOnlyWarning extends GotItOnboardingNag {


  @action.bound
  onContinue() {
    this.props.ux.hasViewedPublishWarning();
  }

  render() {
    const { ux } = this.props;

    return (
      <OnboardingNag className="only-preview">
        <Heading>
          Remember -- this is just a preview course!
        </Heading>
        <Body>
          If you’re ready to create real assignments your students can see, create your real course now. It’s free for you and students will pay {CourseUX.formattedStudentCost} per course per semester.
        </Body>
        <Footer>
          <Button variant="primary" className="create"
            onClick={this.onAddCourse}>Create a course</Button>
          <Button onClick={this.onContinue}
            className="continue"
          >Stay in Preview course</Button>
        </Footer>
      </OnboardingNag>
    );
  }
};
