import { React, action, observer } from '../../helpers/react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Alert, Form, FormControl, FormGroup, InputGroup, ControlLabel } from 'react-bootstrap';
import UserMenu from '../../models/user/menu';
import BuilderUX from './ux';
import BestPracticesIcon from '../../components/icons/best-practices';

export default
@observer
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
    return (
      <Alert bsStyle="danger">
        <p>
          More than {error.value} {error.attribute} is not supported. Need
          more? <a href={`mailto:${UserMenu.supportEmail}`}>Contact
          Support</a> for help.
        </p>
      </Alert>
    );
  }

  render() {
    const { ux: { newCourse } } = this.props;

    return (
      <Form>
        <BestPracticesIcon />
        <p className="explain">
          If you teach multiple sections of the same course, include all sections below.
          You can add or remove sections later.
        </p>

        <FormGroup className="course-details-sections">
          <ControlLabel>
            <InputGroup>
              <InputGroup.Addon>
                Number of sections
                <p className="course-details-explain">in this course</p>

              </InputGroup.Addon>
              <FormControl
                type="number"
                min="1"
                defaultValue={newCourse.num_sections}
                onChange={this.updateSectionCount} />
            </InputGroup>
          </ControlLabel>
        </FormGroup>

        <FormGroup className="course-details-numbers">
          <ControlLabel>
            <InputGroup>
              <InputGroup.Addon>
                Estimated number of students
                <p className="course-details-explain">in this course</p>
              </InputGroup.Addon>
              <FormControl
                type="number"
                min="1"
                defaultValue={newCourse.estimated_student_count || ''}
                onChange={this.updateStudentCount} />
            </InputGroup>
          </ControlLabel>
        </FormGroup>

        {this.renderErrors()}
      </Form>
    );
  }
};
