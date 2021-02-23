import { React, PropTypes, withRouter, observer }  from 'vendor';
import { Button } from 'react-bootstrap';

import { OnboardingNag, GotItOnboardingNag, Heading, Body, Footer } from './onboarding-nag';

@withRouter
@observer
export default
class ExpiredPreviewWarning extends React.Component {

  static propTypes = {
    ux: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  render() {
    return (
      <GotItOnboardingNag
        {...this.props}
        promptRenderer={this.renderPrompt}
      />
    );
  }

  renderPrompt(onAddCourse, onContinue) {
    return (
      <OnboardingNag className="only-preview">
        <Heading>
          This preview course has expired.
        </Heading>
        <Body>
          Want to create a real course that students can access? Click “Create a course” on the top right of your dashboard.
        </Body>
        <Footer>
          <Button variant="primary" onClick={onAddCourse}>Create a course</Button>
          <Button variant="default" onClick={onContinue}>Stay in Preview course</Button>
        </Footer>
      </OnboardingNag>
    );
  }


}
