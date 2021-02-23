import React, { useState, useCallback, useEffect } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import { map, filter, some, groupBy } from 'lodash'
import styled from 'styled-components'
import moment from 'moment'
import { colors } from 'theme'
import { Icon } from 'shared'
import Tabs from '../../../components/tabs'
import TutorDropdown from '../../../components/dropdown';
import CourseInformation from '../../../models/course/information'
import { useAllCourses, useNumberOfStudents } from '../../../store/courses'
import { useAllOfferings } from '../../../store/offering'
import CreateACourse from './create-course'
import CoursePreview from './preview-course'
import ViewCourse from './view-course'
import Resource from './resource'

import { Offering, Course } from '../../../store/types'

const StyledMyCoursesDashboard = styled.div`
    background-color: white;
    padding: 3.8rem 1.6rem;
    h3 {
        font-weight: 700;
        font-size: 2.4rem;
        line-height: 3rem;
        color: ${colors.neutral.darker};
        margin-bottom: 1rem;
    }
    .controls {
        display: flex;
        justify-content: flex-end;
        &.bottom-controls {
            margin-top: 1.2rem;
        }
    }
    .offering-container {
        margin: 1.6rem 0 1.6rem 0;
        background-color: ${colors.neutral.bright};
        padding-top: 2.4rem;
        padding: 2.4rem 3.2rem 6.4rem;
        min-height: 40rem;
        .tutor-tabs {
            .nav-tabs {
                li a {
                    padding: 1rem 3rem;
                }
            }
        }
        .course-cards {
            --gap: 3.2rem;
            display: inline-flex;
            flex-wrap: wrap;
            margin-left: calc(-1 * var(--gap));
            width: calc(100% + var(--gap));
            > div {
                margin: var(--gap) 0 0 var(--gap);
                width: 260px;
                margin-top: 0;
                > div {
                    &:hover {
                        box-shadow: 0 5px 15px rgb(0 0 0 / 30%);
                    }
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
    .add-subject-dropdown {
        margin-top: 3.2rem;
        padding-bottom: 8rem;
        border-bottom: 1px solid ${colors.neutral.pale};
        .dropdown-toggle {
            width: 35rem;
            font-size: 1.4rem;
            color: ${colors.neutral.thin};
        }
        .dropdown-menu {
            .subject-offering-items-container {
                &:not(:last-child) {
                    border-bottom: 1px solid ${colors.neutral.pale};
                }
                .subject-item {
                    color: ${colors.neutral.thin};
                    font-weight: 400;
                }
                .offering-item {
                    padding-left: 2rem;
                    &.disabled {
                        opacity: 0.4;
                    }
                }
            }
        }
    }
`

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

/**
 * Component that displays the resources
 */
const ResourcesInfo = ({ appearanceCode, os_book_id, isFirstBlock } : {appearanceCode: string, os_book_id: string, isFirstBlock: boolean}) => {
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
        {os_book_id && 
        <Resource
          appearanceCode={appearanceCode}
          title="Instructor Resources"
          info="Free resources integrated with your book. "
          link={`https://openstax.org/details/books/${os_book_id}?Instructor%20resources`} />
        }
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
    return (
        <> {map(courses, c => (<ViewCourse course={c} key={c.id} isPast={true} />))}</>
    )

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
const OfferingBlock = ({ offering, isFirstBlock, courses }: {offering: Offering, courses: Course[], isFirstBlock: boolean}) => {
    const [tabIndex, setTabIndex] = useState(0);

    const currentCourses = sortCurrentCourses(filter(courses, c => isCourseCurrent(c)))
    const pastCourses = sortPastCourses(filter(courses, c => isCoursePast(c)))

    const showTabInfo = useCallback(() => {
        switch(tabIndex) { 
            case 0: { 
                return <CurrentCourses courses={currentCourses} offering={offering} />
            } 
            case 1: { 
                return <PastCourses courses={pastCourses} />
            } 
            case 2: { 
                return <ResourcesInfo
                  appearanceCode={offering.appearance_code}
                  os_book_id={offering.os_book_id}
                  isFirstBlock={isFirstBlock} />
            } 
            default: { 
               return <p>How did you get here?!</p>
            } 
         } 
    }, [tabIndex])

    return (
        <div className="offering-container">    
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

interface AddSubjectsDropdownProps {
    allOfferings: Offering[]
    displayedOfferings: Offering[]
    setDisplayedOfferings: React.Dispatch<React.SetStateAction<Offering[]>>
}

const AddSubjectsDropdown: React.FC<AddSubjectsDropdownProps> = ({ allOfferings, displayedOfferings, setDisplayedOfferings }) => {
    const offeringsBySubject = groupBy(allOfferings, o => o.subject)
    const subjects = map(offeringsBySubject, (offerings, subject) => {
        return (
        <div key={subject} className="subject-offering-items-container">
            <Dropdown.Item
              className="subject-item"
              eventKey={subject}
              disabled>
                {subject}
            </Dropdown.Item>

            {map(offerings, offering => {
            const isDisplayed = some(displayedOfferings, dio => dio.id === offering.id)
            return (
                <Dropdown.Item
                  className="offering-item"
                  key={offering.id}
                  eventKey={offering.title}
                  onSelect={() => setDisplayedOfferings(prevState => [...prevState, offering])}
                  disabled={isDisplayed}>
                    {offering.title}
                </Dropdown.Item>
            )}
        )}
        </div>
        )
    });

    return (
        <div className="add-subject-dropdown">
            <h3>Add subject</h3>
            <TutorDropdown
              toggleName="Select a subject you will be teaching"
              dropdownItems={subjects}
        />
        </div>
    )
}

/**
 * Main component
 */
export const MyCoursesDashboard = () => {
    // getting all the data: offerings and courses
    const offerings = useAllOfferings()
    const courses = useAllCourses()

    const [displayedOfferings, setDisplayedOfferings] = useState<Offering[]>([])
    const [isEditMode, setIsEditMode] = useState<boolean>(false)

    // onLoad, display offerings who has at least 1 course
    useEffect(() => {
        if(offerings.length > 0 && courses.length > 0) {
            setDisplayedOfferings(filter(offerings, o => some(courses, c => c.offering_id === o.id)))
        }
    }, [offerings, courses])

    const settingsButton =
    <Button
      variant="link"
      onClick={() => setIsEditMode(prevState => !prevState)}>
      <Icon type="cog" />{isEditMode ? 'Exit settings' : 'Manage subjects'}
    </Button>

    return (
        <StyledMyCoursesDashboard>
            <h2 data-test-id="existing-teacher-screen">My Courses</h2>
            <div className="controls">
                {settingsButton}
            </div>
            { map(displayedOfferings, (o, i) =>
                <OfferingBlock
                  key={o.id}
                  offering={o}
                  courses={filter(courses, c => c.offering_id === o.id && String(c.term) !== 'preview')} 
                  isFirstBlock={i === 0} />) 
            }
            { isEditMode && 
                <>
                    <AddSubjectsDropdown
                      allOfferings={offerings}
                      displayedOfferings={displayedOfferings}
                      setDisplayedOfferings={setDisplayedOfferings} /> 
                    <div className="controls bottom-controls">
                        {settingsButton}
                    </div>
                </>
            }
        </StyledMyCoursesDashboard>
    )
}

export default MyCoursesDashboard
