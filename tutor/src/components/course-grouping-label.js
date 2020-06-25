import { React, PropTypes, idType, cn } from 'vendor';
import { capitalize } from 'lodash';
import Courses from '../models/courses-map';

const CourseGroupingLabel = ({ course, courseId, plural, lowercase, className }) => {

  if (!course) {
    course = Courses.get(courseId);
  }
  if (!course) { return null; }

  let name = course.is_college ? 'section' : 'period';
  if (plural) { name += 's'; }
  if (!lowercase) { name = capitalize(name); }

  return (
    <span className={cn(className, 'cgl')}>
      {name}
    </span>
  );
};

CourseGroupingLabel.displayName = 'CourseGroupingLabel';
CourseGroupingLabel.propTypes = {
  courseId: idType,
  course: PropTypes.object,
  plural: PropTypes.bool,
  lowercase: PropTypes.bool,
  className: PropTypes.string,
};

export default CourseGroupingLabel;
