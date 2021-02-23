import React, { useState, useCallback, useEffect, ReactElement, Dispatch, SetStateAction } from 'react'
import { map, filter } from 'lodash'
import moment from 'moment'
import { Icon } from 'shared'
import UiSettings from 'shared/model/ui-settings'
import Tabs from '../../../components/tabs'
import CourseInformation from '../../../models/course/information'
import { useNumberOfStudents } from '../../../store/courses'
import CreateACourse from './create-course'
import CoursePreview from './preview-course'
import ViewCourse from './view-course'
import Resource from './resource'

import { Offering, Course } from '../../../store/types'

const isCourseCurrent = (course: Course) => moment().isBefore(course.ends_at)
const isCoursePast = (course: Course) => moment().isAfter(course.ends_at)

const sortByCourseEndsAt = (courseA: Course, courseB: Course) => {
    if(moment(courseA.ends_at).isAfter(courseB.ends_at)) { return 1 }
    if(moment(courseA.ends_at).isBefore(courseB.ends_at)) { return -1 }
     return 0
}
const sortCurrentCourses = (courses: Course[]) => courses.sort((a, b) => {
    // no students courses put them at the end of the list
    if (useNumberOfStudents(a.id) === 0) { return -1 }
    return sortByCourseEndsAt(a, b);
})
const sortPastCourses = (courses: Course[]) => courses.sort((a, b) => {
    return sortByCourseEndsAt(a, b);
})

interface ResourcesInfoProps {
    offering: Offering
    os_book_id: string
    isFirstBlock: boolean
    isPreviewInResource: boolean
    renderCoursePreview: () => ReactElement
}

/**
 * Component that displays the resources
 */
const ResourcesInfo: React.FC<ResourcesInfoProps> = ({ offering, os_book_id, isFirstBlock, isPreviewInResource, renderCoursePreview }) => {
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
        {isPreviewInResource && renderCoursePreview()}
        {isFirstBlock && generalResources}
        {os_book_id &&
        <Resource
          appearanceCode={offering.appearance_code}
          title="Instructor Resources"
          info="Free resources integrated with your book. "
          link={`https://openstax.org/details/books/${os_book_id}?Instructor%20resources`} />
        }
    </>
    )
}

interface PastCoursesProps {
    courses: Course[]
}

/**
 * Component that displays the past courses
 */
const PastCourses: React.FC<PastCoursesProps> = ({ courses }) => {
    if(courses.length === 0) {
        return <p className="no-courses-message">No past courses found.</p>
    }
    return (
        <> {map(courses, c => (<ViewCourse course={c} key={c.id} isPast={true} />))}</>
    )

}

interface CurrentCoursesProps {
    courses: Course[]
    isPreviewInResource: boolean
    renderCoursePreview: () => ReactElement 
}

/**
 * Component that displays the current and future courses. Plus the Course Preview and the create course button
 */
const CurrentCourses: React.FC<CurrentCoursesProps> = ({ courses, isPreviewInResource, renderCoursePreview }) => (
    <>
        {map(courses, c => (<ViewCourse course={c} key={c.id}/>))}
        {!isPreviewInResource && renderCoursePreview()}
        <CreateACourse />
    </>
)

interface OfferingBlockProps {
    offering: Offering
    courses: Course[]
    swapOffering: (offeringId: ID, flow?: string) => void
    tryDeleteOffering: Dispatch<SetStateAction<string | number | null>>
    isEditMode: boolean
    isFirstBlock: boolean
    isLastBlock: boolean
}

/**
 * Component that holds the past, current and future courses. Also the resources for the course.
 */
const OfferingBlock: React.FC<OfferingBlockProps> = ({ offering, courses, tryDeleteOffering, swapOffering, tryDeleteOffering, isEditMode, isFirstBlock, isLastBlock }) => {
    const [tabIndex, setTabIndex] = useState(0)
    const [isPreviewInResource, setIsPreviewInResource] = useState<boolean>(UiSettings.get('isPreviewInResource')?.[offering.appearance_code] || false)

    const currentCourses = sortCurrentCourses(filter(courses, c => isCourseCurrent(c)))
    const pastCourses = sortPastCourses(filter(courses, c => isCoursePast(c)))

    //Update the UI Settings for this offering
    useEffect(() => {
        const uiSettings = UiSettings.get('isPreviewInResource') || {}
        UiSettings.set('isPreviewInResource', { ...uiSettings, [offering.appearance_code]: isPreviewInResource })
    }, [isPreviewInResource])

    const showTabInfo = useCallback(() => {
        switch(tabIndex) { 
            case 0: { 
                return ( 
                <CurrentCourses
                  courses={currentCourses}
                  isPreviewInResource={isPreviewInResource}
                  renderCoursePreview={() => (
                  <CoursePreview
                    offering={offering}
                    isPreviewInResource={isPreviewInResource}
                    setIsPreviewInResource={setIsPreviewInResource} />
                  )}
                />
                )
            } 
            case 1: { 
                return <PastCourses courses={pastCourses} />
            } 
            case 2: { 
                return (
                <ResourcesInfo
                  offering={offering}
                  os_book_id={offering.os_book_id}
                  isFirstBlock={isFirstBlock}
                  isPreviewInResource={isPreviewInResource}
                  renderCoursePreview={() => (
                    <CoursePreview
                      offering={offering}
                      isPreviewInResource={isPreviewInResource}
                      setIsPreviewInResource={setIsPreviewInResource} />
                    )}
                />
                )
            } 
            default: { 
               return <p>How did you get here?!</p>
            } 
         } 
    }, [tabIndex, isPreviewInResource])

    const editModeIcons = isEditMode && (
        <div className="edit-mode-icons">
            <Icon
              type="arrow-up"
              onClick={() => swapOffering(offering.id, 'up')}
              buttonProps={{ disabled: isFirstBlock }}/>
            <Icon
              type="arrow-down"
              onClick={() => swapOffering(offering.id, 'down')}
              buttonProps={{ disabled: isLastBlock }}/>
            <Icon
              type="trash"
              onClick={() => tryDeleteOffering(offering.id)}/>
        </div>
    )

    return (
        <div className="offering-container">
            {editModeIcons}
            <h3>{offering.title}</h3>
            <Tabs
              tabs={['CURRENT', 'PAST', 'RESOURCES']}
              onSelect={(a) => setTabIndex(a)}
              pushToPath={false}/>
            <div className="course-cards">
            {showTabInfo()}
            </div>
        </div>
    )
}

export default OfferingBlock