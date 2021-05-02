import { React, observer } from 'vendor'
import Dashboard from './dashboard'
import NewTeacher from './new-teacher'
import PendingVerification from '../../components/my-courses/pending-verification';
import { currentUser, currentCourses } from '../../models'
import EmptyCourses from '../../components/my-courses/empty'
import NonAllowedTeacher from '../../components/my-courses/non-allowed-teacher';

interface MyCoursesProps {
    history: any
}

const MyCourses: React.FC<MyCoursesProps> = observer(({ history }) => {
    // always show their courses if they have any
    if (currentCourses.any) {
        return <Dashboard />
    }

    // a verified instructor from approved institution
    if (currentUser.canCreateCourses) {
        return <NewTeacher history={history} />
    }

    // even though this case should be handled by router;
    // check they've indicated they are a teacher
    if (!currentUser.isProbablyTeacher) {
        return <EmptyCourses />
    }

    // let newly created and locked out teachers
    // that we're still working to verify them
    if (currentUser.wasNewlyCreated) {
        return <PendingVerification />;
    } else {
        // otherwise just show "nope, can't use Tutor"
        return <NonAllowedTeacher />;
    }
})

export default MyCourses
