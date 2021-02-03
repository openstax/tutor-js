import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { isEmpty, map, compact, filter } from 'lodash'
import styled from 'styled-components'
import moment from 'moment'
import { colors } from 'theme'
import Tabs from '../../../components/tabs'
import CreateACourse from './create-a-course'
import CoursePreview from './preview-course'

const StyledMyCoursesDashboard = styled.div`
    .offering-container {
        margin: 1.6rem;
        background-color: ${colors.neutral.bright};
        padding-top: 2.4rem;
        padding-left: 3.2rem;
        h2 {
            font-weight: 700;
            font-size: 2.4rem;
            line-height: 3rem;
            color: ${colors.neutral.std};
        }
    }
`

const isCourseCurrent = (course) => moment().isBetween(course.starts_at, course.ends_at)
const isCoursePast = (course) => moment().isAfter(course.ends_at)

const Courses = ({ courses }) => {
    return (
        <>
        {
            map(courses, c => (
                <p>{c.name}</p>
            ))
        }
        </>
    )
}

const OfferingBlock = ({ offeringWithCourses }) => {
    const [tabIndex, setTabIndex] = useState(0);

    const currentCourses = useMemo(() => filter(offeringWithCourses.courses, c => isCourseCurrent(c), offeringWithCourses))
    const pastCourses = useMemo(() => filter(offeringWithCourses.courses, c => isCoursePast(c), offeringWithCourses))

    return (
        <div className="offering-container">    
            <h2>{offeringWithCourses.title}</h2>
            <Tabs
              tabs={['CURRENT', 'PAST']}
              onSelect={(a) => setTabIndex(a)}/>
            <Courses courses={tabIndex === 0 ? currentCourses : pastCourses}/>
            { tabIndex === 0 &&
            <>
                <CoursePreview offeringWithCourses={offeringWithCourses} />
                <CreateACourse />
            </>
        }
        </div>
    )
}


export const MyCoursesDashboard = ({ offeringsWithCourses }) => {
    return (
        <StyledMyCoursesDashboard>
            { map(offeringsWithCourses, o => <OfferingBlock key={o.id} offeringWithCourses={o} /> )}
        </StyledMyCoursesDashboard>
    )
}

const mapStateToProps = (state) => {
    let offeringsWithCourses = []
    const courses = state.courses.entities
    const offerings = state.offerings.entities

    if(!isEmpty(courses) && !isEmpty(offerings)) {
        offeringsWithCourses = map(offerings, o => {
            const offeringCourses = compact(
                    map(courses, c => {
                if(c.offering_id === o.id) return c;
                return null
            }));
            return { ...o, courses: offeringCourses }
        });
    }
    return {
        offeringsWithCourses,
    }
}

export default connect(mapStateToProps)(MyCoursesDashboard)
