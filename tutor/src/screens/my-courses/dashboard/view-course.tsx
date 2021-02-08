import { React, cn, styled } from 'vendor';
import { Button } from 'react-bootstrap'
import TutorLink from '../../../components/link';
import { useNameCleaned, useBookName, useTermFull, useCurrentRole, useNumberOfStudents } from '../../../store/courses'
import { Course } from '../../../store/types'
import { colors } from 'theme'

const StyledViewCourse = styled.div`
  &&& {
    .my-courses-item {
      &.is-past {
        opacity: 0.6;
      }
      .my-courses-item-details {
        padding: 15px 20px;
        a {padding: 0}
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
          color: ${colors.thin};
          font-size: 1.4rem;
        }
      }
    }
  }
`

interface ViewCourseProps {
  course: Course
  className: string
  isPast?: boolean
}

const ViewCourseStudentInfo = ({ isPast, course } : ViewCourseProps) => {
    // TODO: add API to get number of students in myCourses screen
    const numberOfStudents = useNumberOfStudents(course.id)
    if(!isPast) {
      return (
        <TutorLink to={numberOfStudents ? 'courseRoster' : 'courseSettings'} params={{ courseId: course.id }}>
            <Button variant="link" className="student-info-link">{numberOfStudents ? `${numberOfStudents} students enrolled` : 'Invite students'}</Button>
        </TutorLink>
      )
    }

    return <p className="course-ended-info">Course ended</p>
}

const ViewCourse = ({ course, className, isPast } : ViewCourseProps) => {
  return (
    <StyledViewCourse className='my-courses-item-wrapper'>
      <div
        data-test-id="course-card"
        data-title={useNameCleaned(course.id)}
        data-book-title={useBookName(course.id)}
        data-appearance={course.appearance_code}
        data-is-preview={course.is_preview}
        data-term={useTermFull(course.id)}
        data-is-teacher={useCurrentRole(course.id) === 'teacher'}
        data-course-id={course.id}
        className={cn('my-courses-item', className, { 'is-past': isPast })}
      >
        <div className="my-courses-item-title">
          <TutorLink to="dashboard" params={{ courseId: course.id }}>
            {course.name}
          </TutorLink>
        </div>
        <div className="my-courses-item-details">
            <p className="my-courses-item-term">{useTermFull(course.id, false)}</p>
            <ViewCourseStudentInfo isPast={isPast} course={course} />
        </div>
      </div>
    </StyledViewCourse>
  );    
}
  
export default ViewCourse;
