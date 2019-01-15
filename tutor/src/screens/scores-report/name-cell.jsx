import { React, PropTypes, cn, observer } from '../../helpers/react';
import Name from '../../components/name';
import UX from './ux';
import TutorLink from '../../components/link';

export default
@observer
class NameCell extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    className: PropTypes.string,
    rowIndex: PropTypes.number,
  }

  render() {
    const { ux, rowIndex } = this.props;
    const student = ux.students[rowIndex || 0];

    return (
      <div className={cn('name-cell-wrapper', { 'is-dropped': student.is_dropped })}>
        <TutorLink
          to="viewPerformanceGuide"
          className="name-cell"
          params={{ roleId: student.role, courseId: ux.course.id }}
        >
          <div className="student-name">
            <Name {...student} />
            {student.is_dropped && ' *'}
          </div>
          <span key="id" className="student-id">
            {student.student_identifier}
          </span>
        </TutorLink>
        <div className="name-cell">
          {(student.average_score != null) ? `${(student.average_score * 100).toFixed(0)}%` : undefined}
        </div>
      </div>
    );
  }
};
