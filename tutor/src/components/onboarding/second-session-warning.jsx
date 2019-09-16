import { React, withRouter, action, observer }  from '../../helpers/react';
import { Button } from 'react-bootstrap';
import { OnboardingNag, GotItOnboardingNag, Body, Footer } from './onboarding-nag';
import User from '../../models/user';
import CourseUX from '../../models/course/ux';

export default
@withRouter
@observer
class SecondSessionWarning extends React.Component {

  @action.bound
  onLoggedContinue(cb) {
    User.logEvent({ category: 'onboarding', code: 'like_preview_ask_later' });
    cb();
  }

  @action.bound
  onLoggedAddCourse(cb) {
    User.logEvent({ category: 'onboarding', code: 'like_preview_yes' });
    cb();
  }

  @action.bound renderPrompt(onAddCourse, onContinue) {
    return (
      <OnboardingNag className="second-session-prompt">
        <Body>
          Ready to create your real course? It’s free for you and students will pay {CourseUX.formattedStudentCost} per course.
        </Body>
        <Footer>
          <Button
            variant="primary"
            className="create"
            onClick={() => this.onLoggedAddCourse(onAddCourse)}
          >Create your course</Button>
          <Button
            className="ask-later"
            onClick={() => this.onLoggedContinue(onContinue)}
          >Ask me later</Button>
        </Footer>
      </OnboardingNag>
    );
  }

  render() {
    return (
      <GotItOnboardingNag
        {...this.props}
        promptRenderer={this.renderPrompt}
      />
    );
  }


}
