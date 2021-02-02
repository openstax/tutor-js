import React, { useEffect } from 'react'
import Dashboard from './dashboard'
import { useHasAnyCourses } from '../../store/courses'
import store from '../../store'
import { getOfferings } from '../../store/api'

const MyCourses: React.FC = () => {
    useEffect(() => {
        store.dispatch(getOfferings())
    }, [])
    const hasCourses = useHasAnyCourses()
    if (hasCourses) {
        return <Dashboard />
    }
    return (
        <h1>new user!</h1>
    )
}

export default MyCourses
