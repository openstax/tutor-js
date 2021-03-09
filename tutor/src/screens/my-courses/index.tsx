import React from 'react'
import Dashboard from './dashboard'
import { useHasAnyCourses } from '../../store/courses'
import NewTeacher from './new-teacher'
import PendingVerification from '../../components/my-courses/pending-verification';
import User from '../../models/user'
import EmptyCourses from '../../components/my-courses/empty'
import NonAllowedTeacher from '../../components/my-courses/non-allowed-teacher';

interface MyCoursesProps {
    history: any
}

const MyCourses: React.FC<MyCoursesProps> = ({ history }) => {
    // always show their courses if they have any
    if (useHasAnyCourses()) {
        return <Dashboard />
    }

    // a verified instructor from approved institution
    if (User.canCreateCourses) {
        return <NewTeacher history={history} data-test-id="new-teacher-screen" />
    }

    // even though this case should be handled by router;
    // check they've indicated they are a teacher
    if (!User.isProbablyTeacher) {
        return <EmptyCourses />
    }

    // let newly created and locked out teachers
    // that we're still working to verify them
    if (User.wasNewlyCreated) {
        return <PendingVerification />;
    } else {
        // otherwise just show "nope, can't use Tutor"
        return <NonAllowedTeacher />;
    }
}

export default MyCourses
