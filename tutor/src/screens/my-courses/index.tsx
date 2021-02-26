import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Dashboard from './dashboard'
import { useHasAnyCourses } from '../../store/courses'
import { getOfferings } from '../../store/api'
import NewTeacher from './new-teacher'

const MyCourses: React.FC = (props) => {
    const d = useDispatch()
    useEffect(() => {
        d(getOfferings())
    }, [])
    const hasCourses = useHasAnyCourses()
    if (hasCourses) {
        return <Dashboard />
    }
    return (
        <NewTeacher history={props.history} data-test-id="new-teacher-screen" />
    )
}

export default MyCourses
