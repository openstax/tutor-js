import { React, PropTypes, cn, observer } from 'vendor';
import Name from '../../components/name';
import UX from './ux';
import TutorLink from '../../components/link';

@observer
export default
class NameCell extends React.Component {

  static propTypes = {
      ux: PropTypes.instanceOf(UX).isRequired,
      className: PropTypes.string,
      rowIndex: PropTypes.number,
  }

  name(student) {
      return (
          <React.Fragment>
              <div className="student-name">
                  <Name {...student} />
                  {student.is_dropped && ' *'}
              </div>
              <span key="id" className="student-id">
                  {student.student_identifier}
              </span>
          </React.Fragment>
      );
  }


  renderLinkedName(student) {
      const { ux } = this.props;
      return (
          <TutorLink
              to="viewPerformanceGuide"
              className="name-cell"
              params={{ roleId: student.role, courseId: ux.course.id }}
          >
              {this.name(student)}
          </TutorLink>
      );
  }

  renderName(student) {
      return (
          <div className="name-cell">
              {this.name(student)}
          </div>
      );
  }

  render() {
      const { ux, rowIndex } = this.props;
      const student = ux.students[rowIndex || 0];

      return (
          <div className={cn('name-cell-wrapper', { 'is-dropped': student.is_dropped })}>
              {student.is_dropped ?
                  this.renderName(student) : this.renderLinkedName(student)}
              <div className="name-cell">
                  {student.average_score && `${(student.average_score * 100).toFixed(0)}%`}
              </div>
          </div>
      );
  }
}
