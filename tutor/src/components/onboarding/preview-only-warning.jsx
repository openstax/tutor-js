import { React, PropTypes, withRouter, action, observer, modelize } from 'vendor';
import { Button } from 'react-bootstrap';
import { OnboardingNag, GotItOnboardingNag, Heading, Body, Footer } from './onboarding-nag';
import { CourseUX } from '../../models';

@withRouter
@observer
export default
class PreviewOnlyWarning extends React.Component {
    static propTypes = {
        ux: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }


    constructor(props) {
        super(props);
        modelize(this);
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
        let cost = null;
        if (CourseUX.displayCourseCost) {
            cost = ` It’s free for you and students will pay ${CourseUX.formattedStudentCost} per course per semester.`;
        }
        return (
            <OnboardingNag className="only-preview">
                <Heading>
          Remember -- this is just a preview course!
                </Heading>
                <Body>
          If you’re ready to create real assignments your students can see, create your real course now.
                    {cost}
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
