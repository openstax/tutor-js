import PropTypes from 'prop-types';
import React from 'react';
import TutorLink from '../link';
import { PRACTICE } from '../../models/student-tasks';

export default
class PracticeWeakestButton extends React.Component { // eslint-disable-line

  static defaultProps = {
      title: 'Practice my weakest topics',
  }

  static propTypes = {
      courseId: PropTypes.string.isRequired,
      title:    PropTypes.string,
  }

  render() {
      const { courseId } = this.props;

      return (
          <TutorLink
              className="weakest btn btn-outline-secondary view-performance-forecast"
              params={{ courseId }} to="practiceTopics" query={{ type: PRACTICE.WORST }}
          >
              {this.props.title}
          </TutorLink>
      );
  }
}
