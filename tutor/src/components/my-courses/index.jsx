import React from 'react';
import { Redirect } from 'react-router-dom';
import { computed, modelize } from 'shared/model'
import { observer } from 'mobx-react';
import { currentCourses, currentUser } from '../../models';
import Router from '../../helpers/router';
import EmptyCourses from './empty';
import TourRegion from '../tours/region';
import PendingVerification from './pending-verification';
import NonAllowedTeacher from './non-allowed-teacher';
import { MyCoursesPast, MyCoursesCurrent } from './listings';

@observer
export default
class MyCourses extends React.Component {
    constructor(props) {
        super(props);
        modelize(this);
    }

    componentDidMount() {
        currentUser.logEvent({ category: 'onboarding', code: 'arrived_my_courses' });
    }

    @computed get firstCourse() {
        return currentCourses.array[0];
    }

    @computed get shouldRedirect() {
        if (currentCourses.size !== 1){
            return false;
        }
        return (
            !currentUser.canCreateCourses && this.firstCourse.currentRole.isStudent && this.firstCourse.isActive
        );
    }

    render() {
        if (currentCourses.isEmpty) {
            if (!currentUser.isProbablyTeacher) {
                return <EmptyCourses />;
            }
            if (currentUser.wasNewlyCreated && !currentUser.canCreateCourses) {
                return <PendingVerification />;
            } else if (currentUser.isConfirmedFaculty) {
                if (!currentUser.canCreateCourses) {
                    return <NonAllowedTeacher />;
                }
            } else if (currentUser.isUnverifiedInstructor) {
                return <PendingVerification />;
            } else {
                return <EmptyCourses />;
            }
        }

        if (this.shouldRedirect) {
            return (
                <Redirect to={Router.makePathname('dashboard', { courseId: this.firstCourse.id })} />
            );
        }

        return (
            <TourRegion
                id="my-courses"
                otherTours={[
                    'my-courses-coach-migrate',
                    'create-a-course',
                    'my-courses-coach-no-migrate',
                    'explore-a-preview', // this must come last, there's no dismiss btn
                ]}
                data-test-id="my-courses"
                className="my-courses"
            >
                <MyCoursesCurrent />
                <MyCoursesPast    />
            </TourRegion>
        );
    }
}
