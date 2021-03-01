import React from 'react'
import Dashboard from './dashboard'
import { useHasAnyCourses } from '../../store/courses'
import NewTeacher from './new-teacher'
import PendingVerification from '../../components/my-courses/pending-verification';
import User from '../../models/user'


interface MyCoursesProps {
    history: any
}

const MyCourses: React.FC<MyCoursesProps> = ({ history }) => {
    const hasCourses = useHasAnyCourses()
    if (hasCourses) {
        return <Dashboard />
    }
    if (!User.canCreateCourses) {
        return <PendingVerification />
    }
    return (
        <NewTeacher history={history} data-test-id="new-teacher-screen" />
    )
}

export default MyCourses
