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
    this.props.ux.newCourse.num_students = ev.target.value;
  }

  @action.bound
  updateSectionCount(ev) {
    this.props.ux.newCourse.num_sections = ev.target.value;
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
              Number of sections in your course
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
              Number of students in your course
            </InputGroup.Addon>
            <FormControl
              type="number"
              min="1"
              value={newCourse.num_students || ''}
              onChange={this.updateStudentCount} />
          </InputGroup>
        </FormGroup>

      </Form>
    );
  }
}
