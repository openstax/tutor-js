import React from 'react';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';

import { OnboardingNag, GotItOnboardingNag, Heading, Body, Footer } from './onboarding-nag';

export default
@observer
class ExpiredPreviewWarning extends GotItOnboardingNag {

  renderPrompt() {
    return (
      <OnboardingNag className="only-preview">
        <Heading>
          This preview course has expired.
        </Heading>
        <Body>
          Want to create a real course that students can access? Click “Create a course” on the top right of your dashboard.
        </Body>
        <Footer>
          <Button variant="primary" onClick={this.onAddCourse}>Create a course</Button>
          <Button variant="default" onClick={this.onContinue}>Stay in Preview course</Button>
        </Footer>
      </OnboardingNag>
    );
  }

};
