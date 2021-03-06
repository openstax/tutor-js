import React from 'react'
import cn from 'classnames'
import styled from 'styled-components'
import { Button, Dropdown } from 'react-bootstrap'
import TutorLink from '../../../components/link'
import type { Course } from '../../../models'
import { colors } from '../../../theme'
import { Icon } from 'shared'

const StyledViewCourse = styled.div`
    &&& {
    .my-courses-item {
    &.is-past {
    opacity: 0.6;
    }
    .my-courses-item-title {
    a {
    padding: 1.2rem;
    }
    }
    .my-courses-item-details {
    padding: 1.5rem 1rem;
    a {padding: 0; }
    svg[data-icon="ellipsis-v"] {
    float: right;
    margin-top: 0.5rem;
    }
    .my-courses-item-term {
    font-size: 1.6rem;
    line-height: 2rem;
    font-weight: bold;
    color: ${colors.neutral.thin};
    }
    .student-info-link {
    font-size: 1.4rem;
    line-height: 2rem;
    text-decoration: underline;
    color: ${colors.link};
    padding: 0;
    }
    .course-ended-info {
    color: ${colors.neutral.thin};
    font-size: 1.4rem;
    }
    }
    }
    .my-courses-item-actions {
    position: absolute;
    right: 10px;
    bottom: 28px;
    .dropdown-toggle {
    padding: 0;
    &:after {
    display: none;
    }
    }
    .dropdown-menu {
    border: 1px solid #d5d5d5;
    box-shadow: 0px 2px 4px rgb(0 0 0 / 20%);
    border-radius: 0;
    a {
    padding: 1rem 1.5rem;
    color: #5e6062;
    font-size: 1.6rem;
    &:hover {
    background: #f1f1f1;
    color: #424242;
    font-weight: 500;
    }
    }
    }
    }
    }
`

interface ViewCourseProps {
    course: Course
    className?: string
    isPast?: boolean
}

const ViewCourseStudentInfo: React.FC<ViewCourseProps> = ({ isPast, course }) => {
    const numberOfStudents = course.num_enrolled_students
    if (!isPast) {
        return (
            <TutorLink to={numberOfStudents ? 'courseRoster' : 'courseSettings'} params={{ courseId: course.id }}>
                <Button variant="link" className="student-info-link">{numberOfStudents ? `${numberOfStudents} students enrolled` : 'Invite students'}</Button>
            </TutorLink>
        )
    }

    return <p className="course-ended-info">Course ended</p>
}

const ViewCourse: React.FC<ViewCourseProps> = ({ course, className, isPast }) => {

    return (
        <StyledViewCourse className='my-courses-item-wrapper' data-test-id='course-card'>
            <div
                data-test-id={`course-card-${course.id}`}
                data-title={course.nameCleaned}
                data-book-title={course.bookName}
                data-appearance={course.appearance_code}
                data-is-preview={course.is_preview}
                data-term={course.termFull}
                data-is-teacher={course.currentRole.isTeacher}
                data-course-id={course.id}
                className={cn('my-courses-item', className, { 'is-past': isPast })}
            >
                <div className="my-courses-item-title">
                    <h4>
                        <TutorLink to="dashboard" params={{ courseId: course.id }}>
                            {course.name}
                        </TutorLink>
                    </h4>
                </div>
                <div className="my-courses-item-details">
                    <p className="my-courses-item-term">{course.termFull}</p>
                    <ViewCourseStudentInfo isPast={isPast} course={course} />
                </div>
            </div>
            <Dropdown className="my-courses-item-actions">
                <Dropdown.Toggle
                    id="my-course-action"
                    variant={'ox' as any}
                    data-test-id={`course-card-item-actions-${course.id}`}
                >
                    <Icon type="ellipsis-v" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <TutorLink
                        data-test-id={`course-card-item-actions-course-settings-${course.id}`}
                        to='courseSettings'
                        params={{ courseId: course.id }}
                        // tab 1 goes to the course details tab
                        query={{ tab: 1 }}
                        role="button"
                        className="dropdown-item">
                        Course Settings
                    </TutorLink>
                    <TutorLink
                        data-test-id={`course-card-item-actions-create-course-${course.id}`}
                        to="createNewCourse"
                        params={{ sourceId: course.id }}
                        role="button"
                        className="dropdown-item">
                        Copy this course
                    </TutorLink>
                </Dropdown.Menu>
            </Dropdown>
        </StyledViewCourse>
    );
}

export default ViewCourse;
