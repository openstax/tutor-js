// coffeelint: disable=max_line_length
import React from 'react';
import { get, uniqueId } from 'lodash';

import { Course } from '../../models/courses';
import { OverlayTrigger, Popover } from 'react-bootstrap';

// Approx how wide each char is in the text input
// it's width will be set to this * link's character count
const CHAR_WIDTH = 7;

export default class StudentEnrollmentLink extends React.PureComponent {

  static propTypes = {
    period: React.PropTypes.shape({
      enrollment_url: React.PropTypes.string,
    }).isRequired,
    course: React.PropTypes.instanceOf(Course).isRequired,
  }

  selectText() {
    this.input.select();
  }

  renderInput() {
    return (
      <input
        type="text"
        ref={ref => (this.input = ref)}
        style={{ width: get(this.props.period.enrollment_url, 'length', 20) * CHAR_WIDTH }}
        value={this.props.period.enrollment_url}
        readOnly={true}
      />
    );
  }

  renderPopover() {
    return (
      <Popover id={uniqueId('disabled-enrollment')}>
        A full course will include a student enrollment URL here.
        You can use this link to enroll as a student too.
      </Popover>
    );
  }

  renderPreview() {
    return (
      <OverlayTrigger
        trigger="click"
        placement="top"
        ref="overlay"
        overlay={this.renderPopover()}
      >
        <span className="disabled-for-preview" >No enrollment URL in preview.</span>
      </OverlayTrigger>
    );
  }

  render() {
    return (
      <span className="enrollment-code-link" onClick={this.selectText}>
        <span className="title">
          Student Enrollment URL:
        </span>
        {this.props.course.is_preview ? this.renderPreview() : this.renderInput()}
      </span>
    );
  }
}
