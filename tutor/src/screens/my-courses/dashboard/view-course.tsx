import { React, cn, styled } from 'vendor';
import { Button } from 'react-bootstrap'
import TutorLink from '../../../components/link';
import { useNameCleaned, useBookName, useTermFull, useCurrentRole } from '../../../store/courses'
import { Course } from '../../../store/types'
import { colors } from 'theme'

const StyledViewCourse = styled.div`
  &&& {
    .my-courses-item {
      .my-courses-item-details {
        padding: 15px 20px;
        a {padding: 0}
        .my-courses-item-term {
          font-size: 1.4rem;
          line-height: 2rem;
          font-weight: bold;
        }
        .student-info-link {
          font-size: 1.2rem;
          line-height: 2rem;
          text-decoration: underline;
          color: ${colors.link};
          padding: 0;
        }
      }
    }
  }
`

const ViewCourse = ({ course, className } : {course: Course, className : string }) => {
  // TODO: add API to get number of students in myCourses screen
  const courseHasStudents = false;
  return (
    <StyledViewCourse className="my-courses-item-wrapper">
      <div
        data-test-id="course-card"
        data-title={useNameCleaned(course.id)}
        data-book-title={useBookName(course.id)}
        data-appearance={course.appearance_code}
        data-is-preview={course.is_preview}
        data-term={useTermFull(course.id)}
        data-is-teacher={useCurrentRole(course.id) === 'teacher'}
        data-course-id={course.id}
        className={cn('my-courses-item', className)}
      >
        <div className="my-courses-item-title">
          <TutorLink to="dashboard" params={{ courseId: course.id }}>
            {course.name}
          </TutorLink>
        </div>
        <div className="my-courses-item-details">
            <p className="my-courses-item-term">{useTermFull(course.id, false)}</p>
            <TutorLink to={courseHasStudents ? 'courseRoster' : 'courseSettings'} params={{ courseId: course.id }}>
            <Button variant="link" className="student-info-link">{courseHasStudents ? '24 students enrolled' : 'Invite students'}</Button>
            </TutorLink>
        </div>
      </div>
    </StyledViewCourse>
  );    
}
  
export default ViewCourse;
