import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';

import { Form, FormControl, FormGroup, InputGroup } from 'react-bootstrap';
import BuilderUX from '../../models/course/builder-ux';
import BestPracticesIcon from '../icons/best-practices';

@observer
export default class CourseNumbers extends React.PureComponent {

  static title = 'Estimate your course size';
  static propTypes = {
    ux: React.PropTypes.instanceOf(BuilderUX).isRequired,
  }

  @action.bound
  updateStudentCount(ev) {
    this.props.ux.newCourse.estimated_student_count = ev.target.value;
  }

  @action.bound
  updateSectionCount(ev) {
    this.props.ux.newCourse.num_sections = Math.min(ev.target.value, ev.target.max);
  }

  render() {
    const { ux, ux: { newCourse } } = this.props;

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
              max={ux.maximumSectionCount}
              value={newCourse.num_sections}
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

      </Form>
    );
  }
}
