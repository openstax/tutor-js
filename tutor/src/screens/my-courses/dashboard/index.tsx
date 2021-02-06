import React, { useState, useMemo, useCallback } from 'react'
import { Button } from 'react-bootstrap'
import { map, filter } from 'lodash'
import styled from 'styled-components'
import moment from 'moment'
import { colors } from 'theme'
import { Icon } from 'shared';
import Tabs from '../../../components/tabs'
import CourseInformation from '../../../models/course/information'
import { useCoursesByOfferingId, useNumberOfStudents } from '../../../store/courses'
import { useAllOfferings } from '../../../store/offering'
import CreateACourse from './create-course'
import CoursePreview from './preview-course'
import ViewCourse from './view-course'
import Resource from './resource'

import { Offering, Course } from '../../../store/types'

export interface OfferingWithCourses extends Offering {
    courses: Course[]
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

const isCourseCurrent = (course: Course) => moment().isBefore(course.ends_at)
const isCoursePast = (course: Course) => moment().isAfter(course.ends_at)
const sortCurrentCourses = (courses: Course[]) => courses.sort((a, b) => {
    // no students courses put them at the end of the list
    if (useNumberOfStudents(a) === 0) { return -1 }
    if(moment(a.ends_at).isAfter(b.ends_at)) { return 1 }
    return 0
})
const sortPastCourses = (courses: Course[]) => courses.sort((a, b) => {
    if(moment(a.ends_at).isAfter(b.ends_at)) { return 1 }
    return 0
})  

/**
 * Component that displays the resources
 */
const ResourcesInfo = ({ appearanceCode, isFirstBlock } : {appearanceCode: string, isFirstBlock: boolean}) => {
    const generalResources = 
    <>
        <Resource
          title="Instructor Getting Started Guide"
          info="Find information on OpenStax Tutor features and answers to common questions"
          link={CourseInformation.gettingStartedGuide.teacher} />
        <Resource
          title={<span><Icon type="play-circle"/> Video Tutorials </span>}
          info="Step by step instructions on some of the most important tasks in OpenStax Tutor"
          link={CourseInformation.videoTutorials} />
    </>
    return (
    <>
        {isFirstBlock && generalResources}
        <Resource
          appearanceCode={appearanceCode}
          title="Instructor Resources"
          info="Free resources integrated with your book. "
          link={CourseInformation.gettingStartedGuide.teacher} />
    </>
    )
}

/**
 * Component that displays the past courses
 */
const PastCourses = ({ courses }: {courses: Course[]}) => {
    if(courses.length === 0) {
        return <p className="no-courses-message">No past courses found.</p>
    }
    return map(courses, c => (<ViewCourse course={c} key={c.id} isPast={true} />))
}

/**
 * Component that displays the current and future courses. Plus the Course Preview and the create course button
 */
const CurrentCourses = ({ courses, offering }: {courses: Course[], offering: Offering}) => (
    <>
        {map(courses, c => (<ViewCourse course={c} key={c.id}/>))}
        <CoursePreview offering={offering} />
        <CreateACourse />
    </>
)

/**
 * Component that holds the past, current and future courses. Also the resources for the course.
 */
const OfferingBlock = ({ offering, isFirstBlock }: {offering: Offering, isFirstBlock: boolean}) => {
    const [tabIndex, setTabIndex] = useState(0);

    const courses = useCoursesByOfferingId(offering.id)
    const currentCourses = useMemo(() => sortCurrentCourses(filter(courses, c => isCourseCurrent(c)), offering))
    const pastCourses = useMemo(() => sortPastCourses(filter(courses, c => isCoursePast(c)), offering))

    const showTabInfo = useCallback(() => {
        switch(tabIndex) { 
            case 0: { 
                return <CurrentCourses courses={currentCourses} offering={offering} />
            } 
            case 1: { 
                return <PastCourses courses={pastCourses} />
            } 
            case 2: { 
                return <ResourcesInfo appearanceCode={offering.appearance_code} isFirstBlock={isFirstBlock} />
            } 
            default: { 
               return <p>How did you get here?!</p>
            } 
         } 
    }, [tabIndex])

    return (
        <div className="offering-container">    
            <h2>{offering.title}</h2>
            <Tabs
              tabs={['CURRENT', 'PAST', 'RESOURCES']}
              onSelect={(a) => setTabIndex(a)}/>
              <div className="course-cards">
                {showTabInfo()}
              </div>
        </div>
    )
}

/**
 * Main component
 */
export const MyCoursesDashboard = () => {
    const offerings = useAllOfferings()
    return (
        <StyledMyCoursesDashboard>
            <h2>My Courses</h2>
            <div className="controls">
                <Button variant="link"><Icon type="cog" />Manage subjects</Button>
            </div>
            { map(offerings, (o, i) => <OfferingBlock key={o.id} offering={o} isFirstBlock={i === 0} /> )}
        </StyledMyCoursesDashboard>
    )
}

export default MyCoursesDashboard
