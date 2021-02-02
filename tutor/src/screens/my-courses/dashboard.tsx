import React from 'react'
import { connect } from 'react-redux'
import { useCoursesByOffering } from '../../store/courses'

export const dashboard = (props) => {
    console.log(useCoursesByOffering())
    return (
        <div>
            My Courses
        </div>
    )
}

const mapStateToProps = (state) => ({
    courses: state.courses,
})

export default connect(mapStateToProps)(dashboard)
