import { React, withRouter, action, observer }  from 'vendor';
import { Button } from 'react-bootstrap';
import { OnboardingNag, GotItOnboardingNag, Body, Footer } from './onboarding-nag';
import User from '../../models/user';
import CourseUX from '../../models/course/ux';

@withRouter
@observer
export default
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
        let cost = null;
        if (CourseUX.displayCourseCost) {
            cost = ` It’s free for you and students will pay ${CourseUX.formattedStudentCost} per course.`;
        }
        return (
            <OnboardingNag className="second-session-prompt">
                <Body>
          Ready to create your real course?
                    {cost}
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
