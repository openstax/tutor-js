import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { isEmpty, map, compact, filter } from 'lodash'
import styled from 'styled-components'
import moment from 'moment'
import { colors } from 'theme'
import { Icon } from 'shared';
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
    background-color: white;
    padding: 3.8rem 1.6rem;
    .controls {
        display: flex;
        justify-content: flex-end;
    }
    .offering-container {
        margin: 1.6rem 0 1.6rem 0;
        background-color: ${colors.neutral.bright};
        padding-top: 2.4rem;
        padding: 2.4rem 3.2rem 6.4rem;
        min-height: 40rem;
        h2 {
            font-weight: 700;
            font-size: 2.4rem;
            line-height: 3rem;
            color: ${colors.neutral.std};
        }
        .course-cards {
            --gap: 3.2rem;
            display: inline-flex;
            flex-wrap: wrap;
            margin: calc(-1 * var(--gap)) 0 0 calc(-1 * var(--gap));
            width: calc(100% + var(--gap));
            > div {
                margin: var(--gap) 0 0 var(--gap);
                width: 260px;
                > div:hover {
                    box-shadow: 0 5px 15px rgb(0 0 0 / 30%);
                }
            }
            .no-courses-message {
                font-weight: 700;
                font-size: 1.8rem;
                color: ${colors.neutral.darker};
                margin: 7rem auto;
            }
        }
    }
`

const isCourseCurrent = (course: Course) => moment().isBetween(course.starts_at, course.ends_at)
const isCoursePast = (course: Course) => moment().isAfter(course.ends_at)

const PastCourses = ({ courses }: {courses: Course[]}) => {
    if(courses.length === 0) {
        return <p className="no-courses-message">No past courses found.</p>
    }
    return map(courses, c => (<ViewCourse course={c} key={c.id}/>))
}

const CurrentCourses = ({ courses, offeringWithCourses }: {courses: Course[], offeringWithCourses: IOfferingWithCourses}) => (
    <>
        {map(courses, c => (<ViewCourse course={c} key={c.id}/>))}
        <CoursePreview offeringWithCourses={offeringWithCourses} />
        <CreateACourse />
    </>
)

const OfferingBlock = ({ offeringWithCourses }: {offeringWithCourses: IOfferingWithCourses}) => {
    const [tabIndex, setTabIndex] = useState(0);

    const currentCourses = useMemo(() => filter(offeringWithCourses.courses, c => isCourseCurrent(c), offeringWithCourses))
    const pastCourses = useMemo(() => filter(offeringWithCourses.courses, c => isCoursePast(c), offeringWithCourses))
    const isCurrent = tabIndex === 0

    return (
        <div className="offering-container">    
            <h2>{offeringWithCourses.title}</h2>
            <Tabs
              tabs={['CURRENT', 'PAST']}
              onSelect={(a) => setTabIndex(a)}/>
              <div className="course-cards">
                { isCurrent ? <CurrentCourses courses={currentCourses} offeringWithCourses={offeringWithCourses} /> : <PastCourses courses={pastCourses} />}
              </div>
        </div>
    )
}

export const MyCoursesDashboard = ({ offeringsWithCourses }: MyCoursesDashboardProps) => {
    return (
        <StyledMyCoursesDashboard>
            <h2>My Courses</h2>
            <div className="controls">
                <Button variant="link"><Icon type="cog" />Manage subjects</Button>
            </div>
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
