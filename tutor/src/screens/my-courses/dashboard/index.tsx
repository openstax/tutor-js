import React, { useState, useMemo, ReactElement } from 'react'
import { connect } from 'react-redux'
import { isEmpty, map, compact, filter } from 'lodash'
import styled from 'styled-components'
import moment from 'moment'
import { colors } from 'theme'
import Tabs from '../../../components/tabs'
import CreateACourse from './create-course'
import CoursePreview from './preview-course'
import ViewCourse from './view-course'

import { IOffering, Course } from '../../../store/types'

export interface IOfferingWithCourses extends IOffering {
    courses: Course[]
}

interface MyCoursesDashboardProps {
    offeringsWithCourses: IOfferingWithCourses[]
}

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

const isCourseCurrent = (course: Course) => moment().isBetween(course.starts_at, course.ends_at)
const isCoursePast = (course: Course) => moment().isAfter(course.ends_at)

const MyCourses = ({ courses }: {courses: Course[]}) => {
    return (
        <>
        {
            map(courses, c => (
                <div key={c.id}><ViewCourse course={c} /></div>
            ))
        }
        </>
    )
}

const OfferingBlock = ({ offeringWithCourses }: {offeringWithCourses: IOfferingWithCourses}): ReactElement => {
    const [tabIndex, setTabIndex] = useState(0);

    const currentCourses = useMemo(() => filter(offeringWithCourses.courses, c => isCourseCurrent(c), offeringWithCourses))
    const pastCourses = useMemo(() => filter(offeringWithCourses.courses, c => isCoursePast(c), offeringWithCourses))

    return (
        <div className="offering-container">    
            <h2>{offeringWithCourses.title}</h2>
            <Tabs
              tabs={['CURRENT', 'PAST']}
              onSelect={(a) => setTabIndex(a)}/>
            <MyCourses courses={tabIndex === 0 ? currentCourses : pastCourses}/>
            { tabIndex === 0 &&
            <>
                <CoursePreview offeringWithCourses={offeringWithCourses} />
                <CreateACourse />
            </>
        }
        </div>
    )
}

export const MyCoursesDashboard = ({ offeringsWithCourses }: MyCoursesDashboardProps): ReactElement => {
    return (
        <StyledMyCoursesDashboard>
            { map(offeringsWithCourses, o => <OfferingBlock key={o.id} offeringWithCourses={o} /> )}
        </StyledMyCoursesDashboard>
    )
}

const mapStateToProps = (state) => {
    let offeringsWithCourses: IOfferingWithCourses[] = []
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
