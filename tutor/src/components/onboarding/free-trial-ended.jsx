import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';
import { action, modelize } from 'shared/model'
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { OnboardingNag, Heading, Body, Footer } from './onboarding-nag';
import { CourseUX, currentCourses }  from '../../models';
import TutorRouter from '../../helpers/router';

@withRouter
@observer
export default
class FreeTrialEnded extends React.Component {
    static propTypes = {
        ux: PropTypes.object.isRequired,
        onDismiss: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
    }

    static className = 'free-trial-ended'

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound
    goToMyCourses() {
        this.props.history.push(TutorRouter.makePathname('myCourses'));
    }

    renderBackLink() {
        if (currentCourses.size <= 1) { return null; }

        return (
            <Button variant="link" onClick={this.goToMyCourses}>
          Return to my courses
            </Button>
        );
    }

    // if a course has eneded without being paid
    // we do not allow paying or accessing it
    renderCourseEnded(course) {
        return (
            <OnboardingNag className="free-trial-ended">
                <Heading>
                    {course.name} has ended.
                </Heading>
                <Body />
                <Footer>
                    {this.renderBackLink()}
                </Footer>
            </OnboardingNag>
        );
    }

    render() {
        const { ux } = this.props;
        if (ux.course.hasEnded) { return this.renderCourseEnded(ux.course); }
        // we do not check CourseUX.displayCourseCost here because if they're on
        // a free trial we already know the course is not comped
        return (
            <OnboardingNag className="free-trial-ended">
                <Heading>
            Your free trial for {ux.course.name} has ended
                </Heading>
                <Body>
                    <p>
              To continue accessing your course, click the button below to pay your
              one-time {CourseUX.formattedStudentCost} fee for the semester.
                    </p>
                </Body>
                <Footer>
                    <Button variant="primary" onClick={ux.payNow}>
              Buy access now
                    </Button>
                    {this.renderBackLink()}
                </Footer>
            </OnboardingNag>
        );

    }
}
