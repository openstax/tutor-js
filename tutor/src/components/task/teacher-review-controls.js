import React from 'react';
import TutorLink from '../link';

import { ViewingAsStudentName } from './viewing-as-student-name';


class TeacherReviewControls extends React.Component {
  static displayName = 'TeacherReviewControls';

  render() {
    const { courseId, taskId } = this.props;

    return (
      <div className="task-teacher-review-controls">
        <ViewingAsStudentName key="viewing-as" courseId={courseId} taskId={taskId} />
        <TutorLink
          to="viewScores"
          key="step-back"
          params={{ courseId }}
          className="btn btn-default">
          {'\
    Back to Scores\
    '}
        </TutorLink>
      </div>
    );
  }
}

export default TeacherReviewControls;
