import PropTypes from 'prop-types';
import React from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';

import TutorLink from '../../components/link';
import Time from '../../components/time';
import PieProgress from './pie-progress';


export default class ConceptCoachCell extends React.Component {

  static propTypes = {
    courseId: PropTypes.string.isRequired,
    displayAs: PropTypes.oneOf(['number', 'percent']),
    isConceptCoach: PropTypes.bool,
    rowIndex: PropTypes.number.isRequired,
    task: PropTypes.shape({
      status:          PropTypes.string,
      due_at:          PropTypes.string,
      last_worked_at:  PropTypes.string,
      type:            PropTypes.string,
    }).isRequired,
  }

  render() {
    const { task, courseId, displayAs, isConceptCoach } = this.props;

    const scorePercent =
      Math.round((task.correct_exercise_count / task.exercise_count) * 100);
    const pieValue =
      Math.round((task.completed_exercise_count / task.exercise_count) * 100);
    const lastWorked =
      <div className="row">
        <div>
          <span>
            Last Worked:
          </span>
          {' '}
          <Time format="M/M" date={task.last_worked_at} />
        </div>
      </div>;
    const tooltip =
      <Popover
        id={`scores-cell-info-popover-${task.id}`}
        className="scores-scores-tooltip-completed-info">
        <div className="info">
          <div className="row">
            <div>
              {'Completed '}
              {pieValue}
              %
            </div>
          </div>
          <div className="row">
            <div>
              {task.completed_exercise_count} of {task.exercise_count} questions
            </div>
          </div>
          {task.completed_exercise_count === task.exercise_count ? lastWorked : undefined}
        </div>
      </Popover>;

    const completed = task.completed_exercise_count === task.exercise_count;

    const score =
      displayAs === 'number' ?
        `${task.correct_exercise_count} of ${task.exercise_count}`
        :
        `${scorePercent}%`;


    const scoreNotComplete = <div className="score not-complete">
      ---
    </div>;


    return (
      <div className="scores-cell">
        <div className="score">
          <TutorLink
            to="viewTaskStep"
            className={`${!completed ? 'not-complete' : undefined}`}
            data-assignment-type={`${task.type}`}
            params={{ courseId, id: task.id, stepIndex: 1 }}>
            {completed ? score : scoreNotComplete}
          </TutorLink>
        </div>
        <div className="worked">
          <OverlayTrigger placement="left" delayShow={1000} delayHide={0} overlay={tooltip}>
            <span className="trigger-wrap">
              <PieProgress isConceptCoach={isConceptCoach} size={20} value={pieValue} />
            </span>
          </OverlayTrigger>
        </div>
      </div>
    );
  }
}
