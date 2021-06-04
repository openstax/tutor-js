import React, { useState, useCallback, useEffect, ReactElement, Dispatch, SetStateAction } from 'react'
import { map } from 'lodash'
import cn from 'classnames'
import { Icon } from 'shared'
import UiSettings from 'shared/model/ui-settings'
import Tabs from '../../../components/tabs'
import { Course, CoursesMap, CourseInformation, Offering, currentOfferings, ID } from '../../../models'
import CreateACourse from './create-course'
import CoursePreview from './preview-course'
import ViewCourse from './view-course'
import Resource from './resource'
import Sociology3eOfferingTooltip from './sociology-3e-offering-tooltip'

const sortByCourseEndsAt = (courseA: Course, courseB: Course) => {
    if (courseA.ends_at.isAfter(courseB.ends_at)) { return 1 }
    if (courseA.ends_at.isBefore(courseB.ends_at)) { return -1 }
    return 0
}
const sortCurrentCourses = (courses: Course[]) => courses.sort((a, b) => {
    // no students courses put them at the end of the list
    if (a.num_enrolled_students == 0) return -1
    return sortByCourseEndsAt(a, b);
})
const sortPastCourses = (courses: Course[]) => courses.sort((a, b) => {
    return sortByCourseEndsAt(a, b);
})

interface ResourcesInfoProps {
    offering: Offering
    os_book_id: string
    isFirstBlock: boolean
    renderCoursePreview: () => ReactElement | null
}

/**
 * Component that displays the resources
 */
const ResourcesInfo: React.FC<ResourcesInfoProps> = ({ offering, os_book_id, isFirstBlock, renderCoursePreview }) => {
    const generalResources = isFirstBlock && (
        <>
            <Resource
                title="Instructor Getting Started Guide"
                info="Find information on OpenStax Tutor features and answers to common questions"
                link={CourseInformation.gettingStartedGuide.teacher} 
                dataTestId="getting-started-guide"/>
            <Resource
                title={<span><Icon type="play-circle" /> Video Tutorials </span>}
                info="Step by step instructions on some of the most important tasks in OpenStax Tutor"
                link={CourseInformation.videoTutorials} 
                dataTestId="getting-started-video"/>
        </>
    )
    return (
        <>
            {generalResources}
            {os_book_id &&
                <Resource
                    appearanceCode={offering.appearance_code}
                    title="Instructor Resources"
                    info="Free resources available for your book"
                    link={`https://openstax.org/details/books/${os_book_id}?Instructor%20resources`} />
            }
            {renderCoursePreview()}
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
    if (courses.length === 0) {
        return <p className="no-courses-message">No past courses found.</p>
    }
    return (
        <> {map(courses, c => (<ViewCourse course={c} key={c.id} isPast={true} />))}</>
    )

}

interface CurrentCoursesProps {
    courses: Course[]
    renderCreateCourse: () => ReactElement
    renderCoursePreview: () => ReactElement | null
}

/**
 * Component that displays the current and future courses. Plus the Course Preview and the create course button
 */
const CurrentCourses: React.FC<CurrentCoursesProps> = ({ courses, renderCreateCourse, renderCoursePreview }) => (
    <>
        {map(courses, c => (<ViewCourse course={c} key={c.id} />))}
        {renderCoursePreview()}
        {renderCreateCourse()}
    </>
)

interface OfferingBlockProps {
    offering: Offering
    courses: CoursesMap
    swapOffering: (offeringId: ID, flow?: string) => void
    tryDeleteOffering: Dispatch<SetStateAction<string | number | null>>
    isEditMode: boolean
    isFirstBlock: boolean
    isLastBlock: boolean
}

/**
 * Component that holds the past, current and future courses. Also the resources for the course.
 */
const OfferingBlock: React.FC<OfferingBlockProps> = ({ offering, courses, swapOffering, tryDeleteOffering, isEditMode, isFirstBlock, isLastBlock }) => {
    const [tabIndex, setTabIndex] = useState(0)
    const [isPreviewInResource, setIsPreviewInResource] = useState<boolean>(UiSettings.get('isPreviewInResource')?.[offering.appearance_code] || false)

    const currentCourses = sortCurrentCourses(courses.nonPreview.currentAndFuture.array)
    const pastCourses = sortPastCourses(courses.nonPreview.completed.array)

    //Update the UI Settings for this offering
    useEffect(() => {
        const uiSettings = UiSettings.get('isPreviewInResource') || {}
        UiSettings.set('isPreviewInResource', { ...uiSettings, [offering.appearance_code]: isPreviewInResource })
    }, [isPreviewInResource])

    const renderCoursePreview = (isResourcesTab: boolean) => {
        if ((isPreviewInResource && isResourcesTab) || (!isPreviewInResource && !isResourcesTab)) {
            return (
                <CoursePreview
                    offering={offering}
                    isPreviewInResource={isPreviewInResource}
                    setIsPreviewInResource={setIsPreviewInResource} />
            )
        }
        return null;
    }

    const showTabInfo = useCallback(() => {
        switch (tabIndex) {
            case 0: {
                return (
                    <CurrentCourses
                        courses={currentCourses}
                        renderCreateCourse={() => (
                            <CreateACourse offering={offering} />
                        )}
                        renderCoursePreview={() => renderCoursePreview(false)}
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
                        renderCoursePreview={() => renderCoursePreview(true)}
                    />
                )
            }
            default: {
                return <p>How did you get here?!</p>
            }
        }
    }, [tabIndex, isPreviewInResource])

    const editModeIcons = isEditMode && (
        <div className="edit-mode-icons" data-test-id="edit-mode-icons">
            <Icon
                data-test-id="move-up-offering"
                type="arrow-up"
                onClick={() => swapOffering(offering.id, 'up')}
                buttonProps={{ disabled: isFirstBlock }} />
            <Icon
                data-test-id="move-down-offering"
                type="arrow-down"
                onClick={() => swapOffering(offering.id, 'down')}
                buttonProps={{ disabled: isLastBlock }} />
            <Icon
                data-test-id="delete-offering"
                type="trash"
                onClick={() => tryDeleteOffering(offering.id)} />
        </div>
    )

    const displaySoc3eTooltip = offering.isSociology2e && currentOfferings.soc3eAvailable

    return (
        <div className={cn('offering-container', { 'is-edit-mode': isEditMode })} data-offering-id={offering.id} data-test-id="offering-container">
            {editModeIcons}
            {displaySoc3eTooltip && <Sociology3eOfferingTooltip />}
            <h3>{offering.title}</h3>
            <Tabs
                tabs={['current', 'past', 'resources']}
                onSelect={(a) => setTabIndex(a)}
                pushToPath={false} />
            <div className="course-cards">
                {showTabInfo()}
            </div>
        </div>
    )
}

export default OfferingBlock
