import * as React from 'react'
import { useHasAnyCourses } from '../../store/courses'

const MyCourses: React.FC = () => {
    const hasCourses = useHasAnyCourses()
    if (hasCourses) {
        return <h1 data-test-id="existing-teacher-screen">Courses Dashboard</h1>
    }
    return (
        <h1 data-test-id="new-teacher-screen">new user!</h1>
    )
}

export default MyCourses
