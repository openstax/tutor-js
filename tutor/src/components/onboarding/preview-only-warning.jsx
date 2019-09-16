import { React, PropTypes, withRouter, action, observer }  from '../../helpers/react';
import { Button } from 'react-bootstrap';
import { OnboardingNag, GotItOnboardingNag, Heading, Body, Footer } from './onboarding-nag';
import CourseUX from '../../models/course/ux';

export default
@withRouter
@observer
class PreviewOnlyWarning extends React.Component {

  static propTypes = {
    ux: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }


  @action.bound onContinue(cb) {
    this.props.ux.hasViewedPublishWarning();
    cb();
  }

  render() {
    return (
      <GotItOnboardingNag
        {...this.props}
        promptRenderer={this.renderPrompt}
      />
    );
  }

  renderPrompt = (onAddCourse, onContinue) => {
    return (
      <OnboardingNag className="only-preview">
        <Heading>
          Remember -- this is just a preview course!
        </Heading>
        <Body>
          If you’re ready to create real assignments your students can see, create your real course now. It’s free for you and students will pay {CourseUX.formattedStudentCost} per course per semester.
        </Body>
        <Footer>
          <Button
            variant="primary" className="create"
            onClick={onAddCourse}
          >Create a course</Button>
          <Button
            onClick={() => this.onContinue(onContinue)}
            className="continue"
          >Stay in Preview course</Button>
        </Footer>
      </OnboardingNag>
    );
  }
}
