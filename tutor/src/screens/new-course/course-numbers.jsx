import { React, action, observer } from 'vendor';
import pluralize from 'pluralize';
import S from '../../helpers/string';
import PropTypes from 'prop-types';
import { Alert, FormControl, InputGroup, Form } from 'react-bootstrap';
import UserMenu from '../../models/user/menu';
import BuilderUX from './ux';
import BestPracticesTip from '../../components/best-practices-tip';

@observer
export default
class CourseNumbers extends React.Component {

  static title = 'Estimate your course size';
  static propTypes = {
    ux: PropTypes.instanceOf(BuilderUX).isRequired,
  }

  @action.bound
  updateStudentCount({ target: { value } }) {
    this.props.ux.newCourse.setValue('estimated_student_count', value);
  }

  @action.bound
  updateSectionCount({ target: { value } }) {
    this.props.ux.newCourse.setValue('num_sections', value);
  }

  renderErrors() {
    const { error } = this.props.ux.newCourse;
    if (!error) { return null; }
    let contact = '';
    if (error.direction == 'more') {
      contact = (
        <span>
          Need more? <a href={`mailto:${UserMenu.supportEmail}`}>Contact
          Support</a> for help
        </span>
      );

    }
    return (
      <Alert variant="danger">
        <p>
          {S.capitalize(error.direction)} than {pluralize(error.attribute, error.value, true)} is
          not supported. {contact}
        </p>
      </Alert>
    );
  }

  render() {
    const { ux: { newCourse, onKeyPress } } = this.props;

    return (
      <Form>
        <BestPracticesTip>
          If you teach multiple sections of the same course, include all sections below.
          You can add or remove sections later.
        </BestPracticesTip>
        <Form.Group className="course-details-sections">
          <Form.Label htmlFor="number-sections">
            <InputGroup>
              <InputGroup.Prepend>
                Number of sections
                in this course
              </InputGroup.Prepend>
              <FormControl
                id="number-sections"
                type="number"
                min="1"
                onKeyPress={onKeyPress}
                defaultValue={newCourse.num_sections}
                onChange={this.updateSectionCount} />
            </InputGroup>
          </Form.Label>
        </Form.Group>

        <Form.Group className="course-details-numbers">
          <Form.Label htmlFor="number-students">
            <InputGroup>
              <InputGroup.Prepend>
                Estimated number of students
                in this course.
              </InputGroup.Prepend>
              <FormControl
                id="number-students"
                type="number"
                min="1"
                onKeyPress={onKeyPress}
                defaultValue={newCourse.estimated_student_count || ''}
                onChange={this.updateStudentCount} />
            </InputGroup>
          </Form.Label>
        </Form.Group>

        {this.renderErrors()}
      </Form>
    );
  }
}
