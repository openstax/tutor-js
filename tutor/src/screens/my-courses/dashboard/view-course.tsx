import { React, cn } from 'vendor';
import TutorLink from '../../../components/link';
import CourseBranding from '../../../components/branding/course';
import { useNameCleaned, useBookName, useTermFull, useCurrentRole } from '../../../store/courses'
import { Course } from '../../../store/types'

const ViewCourse = ({ course, className } : {course: Course, className : string }) => {
  return (
    <div className="my-courses-item-wrapper">
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
          <TutorLink to="dashboard" params={{ courseId: course.id }}>
            <CourseBranding
              tag="p"
              className="my-courses-item-brand"
              isConceptCoach={!!course.is_concept_coach}
            />
            <p className="my-courses-item-term">
              {course.term}
              {' '}
              {course.year}
            </p>
          </TutorLink>
        </div>
      </div>
    </div>
  );    
}
  
export default ViewCourse;
