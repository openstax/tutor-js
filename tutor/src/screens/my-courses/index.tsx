import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Dashboard from './dashboard'
import { useHasAnyCourses } from '../../store/courses'
import { getOfferings } from '../../store/api'

const MyCourses: React.FC = () => {
    const d = useDispatch()
    useEffect(() => {
        d(getOfferings())
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
