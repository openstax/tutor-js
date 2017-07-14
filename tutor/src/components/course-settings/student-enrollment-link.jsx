// coffeelint: disable=max_line_length
import React from 'react';
import { action } from 'mobx';
import { get }    from 'lodash';
import Course from '../../models/course';
import TourAnchor from '../tours/anchor';
import CopyOnFocusInput from '../copy-on-focus-input';

// Approx how wide each char is in the text input
// it's width will be set to this * link's character count
const CHAR_WIDTH = 7;

const Input = ({ period }) =>
  <CopyOnFocusInput value={period.enrollment_url} readOnly />;

const Preview = () =>
  <span className="faux-disabled-input">No enrollment URL in preview.</span>;

const NotYet = () =>
  <span className="faux-disabled-input">Available August 1</span>;


const EnrollmentLink = ({ course, period }) => {
  if (course.is_preview) return <Preview />;
  if (course.term == 'fall' && course.year == 2017 && !course.is_concept_coach) {
    return <NotYet />;
  }
  return <Input period={period} />;
};

export default class StudentEnrollmentLink extends React.PureComponent {

  static propTypes = {
    period: React.PropTypes.shape({
      enrollment_url: React.PropTypes.string,
    }).isRequired,
    course: React.PropTypes.instanceOf(Course).isRequired,
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
        <EnrollmentLink period={this.props.period} course={this.props.course} />
      </TourAnchor>
    );
  }
}
