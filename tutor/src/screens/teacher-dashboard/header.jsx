import { React, PropTypes, observer } from 'vendor';
import Course from '../../models/course';
import TourAnchor from '../../components/tours/anchor';
import TutorLink from '../../components/link';
import BrowseTheBook from '../../components/buttons/browse-the-book';
import NoPeriods from '../../components/no-periods';
import SidebarToggle from './sidebar-toggle';

const CourseCalendarHeader = observer((props) => {
  const { course, hasPeriods, defaultOpen } = props;
  return (
    <div className="calendar-header">
      {!hasPeriods ? <NoPeriods courseId={course.id} noCard={true} /> : undefined}
      <SidebarToggle
        course={props.course}
        defaultOpen={defaultOpen}
        onToggle={props.onSidebarToggle} />
      <div className="calendar-header-actions-buttons">
        <BrowseTheBook course={course} />
        <TourAnchor id="question-library-button">
          <TutorLink className="btn btn-default" to="viewQuestionsLibrary" params={{ courseId: course.id }}>
            Question Library
          </TutorLink>
        </TourAnchor>
        <TourAnchor id="student-scores-button">
          <TutorLink className="btn btn-default" to="viewScores" params={{ courseId: course.id }}>
            Student Scores
          </TutorLink>
        </TourAnchor>
        <TourAnchor id="performance-forecast-button">
          <TutorLink className="btn btn-default" to="viewPerformanceGuide" params={{ courseId: course.id }}>
            Performance Forecast
          </TutorLink>
        </TourAnchor>
      </div>
    </div>
  );
});

CourseCalendarHeader.displayName = 'CourseCalendarHeader';

CourseCalendarHeader.propTypes = {
  hasPeriods: PropTypes.bool.isRequired,
  course: PropTypes.instanceOf(Course).isRequired,
  onSidebarToggle: PropTypes.func.isRequired,
  defaultOpen: PropTypes.bool,
};


export default CourseCalendarHeader;
