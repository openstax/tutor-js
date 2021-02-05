import React, { useState, useMemo, useCallback } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { isEmpty, map, compact, filter } from 'lodash'
import styled from 'styled-components'
import moment from 'moment'
import { colors } from 'theme'
import { Icon } from 'shared';
import Tabs from '../../../components/tabs'
import CourseInformation from '../../../models/course/information'
import CreateACourse from './create-course'
import CoursePreview from './preview-course'
import ViewCourse from './view-course'
import Resource from './resource'

import { Offering, Course } from '../../../store/types'

export interface OfferingWithCourses extends Offering {
    courses: Course[]
}

interface MyCoursesDashboardProps {
    offeringsWithCourses: OfferingWithCourses[]
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
const CurrentCourses = ({ courses, offeringWithCourses }: {courses: Course[], offeringWithCourses: OfferingWithCourses}) => (
    <>
        {map(courses, c => (<ViewCourse course={c} key={c.id}/>))}
        <CoursePreview offeringWithCourses={offeringWithCourses} />
        <CreateACourse />
    </>
)

/**
 * Component that holds the past, current and future courses. Also the resources for the course.
 */
const OfferingBlock = ({ offeringWithCourses, isFirstBlock }: {offeringWithCourses: OfferingWithCourses, isFirstBlock: boolean}) => {
    const [tabIndex, setTabIndex] = useState(0);

    const currentCourses = useMemo(() => filter(offeringWithCourses.courses, c => isCourseCurrent(c), offeringWithCourses))
    const pastCourses = useMemo(() => filter(offeringWithCourses.courses, c => isCoursePast(c), offeringWithCourses))

    const showTabInfo = useCallback(() => {
        switch(tabIndex) { 
            case 0: { 
                return <CurrentCourses courses={currentCourses} offeringWithCourses={offeringWithCourses} />
            } 
            case 1: { 
                return <PastCourses courses={pastCourses} />
            } 
            case 2: { 
                return <ResourcesInfo appearanceCode={offeringWithCourses.appearance_code} isFirstBlock={isFirstBlock} />
            } 
            default: { 
               return <p>How did you get here?!</p>
            } 
         } 
    }, [tabIndex])

    return (
        <div className="offering-container">    
            <h2>{offeringWithCourses.title}</h2>
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
export const MyCoursesDashboard = ({ offeringsWithCourses }: MyCoursesDashboardProps) => {
    return (
        <StyledMyCoursesDashboard>
            <h2>My Courses</h2>
            <div className="controls">
                <Button variant="link"><Icon type="cog" />Manage subjects</Button>
            </div>
            { map(offeringsWithCourses, (o, i) => <OfferingBlock key={o.id} offeringWithCourses={o} isFirstBlock={i === 0} /> )}
        </StyledMyCoursesDashboard>
    )
}

const mapStateToProps = (state) => {
    let offeringsWithCourses: OfferingWithCourses[] = []
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
