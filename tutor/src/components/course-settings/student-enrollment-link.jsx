// coffeelint: disable=max_line_length
import React from 'react';
import { action } from 'mobx';
import { get }    from 'lodash';
import { Course } from '../../models/courses';
import TourAnchor from '../tours/anchor';

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

  @action.bound
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

  renderPreview() {
    return (
      <span className="disabled-for-preview">No enrollment URL in preview.</span>
    );
  }

  render() {
    return (
      <TourAnchor
        id="enrollment-code-link"
        tag="span"
        className="enrollment-code-link"
        onClick={this.selectText}
      >
        <span className="title">
          Student Enrollment URL:
        </span>
        {this.props.course.is_preview ? this.renderPreview() : this.renderInput()}
      </TourAnchor>
    );
  }
}
