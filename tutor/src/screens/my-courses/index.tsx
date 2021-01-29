import * as React from 'react'
import { useHasAnyCourses } from '../../store/courses'

const MyCourses: React.FC = () => {
    const hasCourses = useHasAnyCourses()
    if (hasCourses) {
        return <h1>Courses Dashboard</h1>
    }
    return (
        <h1>new user!</h1>
    )
}

export default MyCourses
