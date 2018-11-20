import PropTypes from 'prop-types';
import React from 'react';
import TutorLink from '../link';

export default
class PracticeWeakestButton extends React.Component {

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
        params={{ courseId }} to="practiceTopics" query={{ worst: true }}
      >
        {this.props.title}
      </TutorLink>
    );
  }
}
