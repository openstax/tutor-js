import { React, PropTypes, withRouter, action, observer, modelize } from 'vendor';
import { Button } from 'react-bootstrap';
import { OnboardingNag, GotItOnboardingNag, Body, Footer } from './onboarding-nag';

@withRouter
@observer
export default class DisplayPreviewMessage extends React.Component {
    static propTypes = {
        ux: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        modelize(this);
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
                    <p data-test-id="preview-message" dangerouslySetInnerHTML={{ __html: this.props.ux.course.offering.preview_message }} />
                </Body>
                <Footer>
                    <Button data-test-id="dismiss-preview-msg" onClick={() => this.onContinue(onContinue)} className="continue">Ok</Button>
                </Footer>
            </OnboardingNag>
        );
    }
}
