import { React, PropTypes, withRouter, action, observer }  from 'vendor';
import { Button } from 'react-bootstrap';
import { OnboardingNag, GotItOnboardingNag, Body, Footer } from './onboarding-nag';

export default
@withRouter
@observer
class DisplayPreviewMessage extends React.Component {

  static propTypes = {
    ux: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  @action.bound onContinue(cb) {
    this.props.ux.hasViewedDisplayPreviewMessage();
    cb();
  }

  render() {
    return (
      <GotItOnboardingNag {...this.props} promptRenderer={this.renderPrompt} />
    );
  }

  renderPrompt = (onAddCourse, onContinue) => {
    return (
      <OnboardingNag className="only-preview">
        <Body>
          <p dangerouslySetInnerHTML={{ __html: this.props.ux.course.offering.preview_message }} />
        </Body>
        <Footer>
          <Button onClick={() => this.onContinue(onContinue)} className="continue">Ok</Button>
        </Footer>
      </OnboardingNag>
    );
  }
}
