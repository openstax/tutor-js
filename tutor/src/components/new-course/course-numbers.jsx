import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { isEmpty } from 'lodash';
import { Alert, Form, FormControl, FormGroup, InputGroup } from 'react-bootstrap';
import UserMenu from '../../models/user/menu';
import BuilderUX from '../../models/course/builder-ux';
import BestPracticesIcon from '../icons/best-practices';

@observer
export default class CourseNumbers extends React.PureComponent {

  static title = 'Estimate your course size';
  static propTypes = {
    ux: React.PropTypes.instanceOf(BuilderUX).isRequired,
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
        More than {error.value} {error.attribute} is not supported. Need
        more? <a href={`mailto:${UserMenu.supportEmail}`}>Contact
        Support</a> for help.
      </Alert>
    );
  }

  render() {
    const { ux: { newCourse } } = this.props;

    return (
      <Form>
        <BestPracticesIcon />
        <p>
          If you teach multiple sections of the same course, include all sections below.
          You can add or remove sections later.
        </p>

        <FormGroup className="course-details-sections">
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
        </FormGroup>

        <FormGroup className="course-details-numbers">
          <InputGroup>
            <InputGroup.Addon>
              Estimated number of students
              <p className="course-details-explain">in this course</p>
            </InputGroup.Addon>
            <FormControl
              type="number"
              min="1"
              value={newCourse.estimated_student_count || ''}
              onChange={this.updateStudentCount} />
          </InputGroup>
        </FormGroup>

        {this.renderErrors()}
      </Form>
    );
  }
}
