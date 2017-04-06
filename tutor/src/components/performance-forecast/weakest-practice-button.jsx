import React from 'react';
import TutorLink from '../link';

export default class PracticeWeakestButton extends React.PureComponent {

  static defaultProps = {
    title: 'Practice my weakest topics',
  }

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    title:    React.PropTypes.string,
  }

  render() {
    const { courseId } = this.props;

    return (
      <TutorLink
        className="weakest btn btn-default view-performance-forecast"
        params={{ courseId }} to="practiceTopics" query={{ worst: true }}
      >
        {this.props.title}
      </TutorLink>
    );
  }
}
