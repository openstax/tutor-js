import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import { isEmpty, map, pick, find } from 'lodash';
import { Panel } from 'react-bootstrap';
import classnames from 'classnames';
import Exercise from '../../models/exercises/exercise';
import { QuestionStats } from '../../models/task-plan/stats';

import Icon from '../icon';
import {
  ArbitraryHtmlAndMath, Question, CardBody, FreeResponse,
  ExerciseGroup, ExerciseIdentifierLink,
} from 'shared';
import TourAnchor from '../tours/anchor';

const TOGGLE_FREE_RESPONSE_LIMIT = 3;

@observer
class TaskTeacherReviewQuestion extends React.Component {

  static propTypes = {
    question: PropTypes.instanceOf(QuestionStats).isRequired,
  };

  @observable showNamesAndFreeResponse = false;

  @computed get isExpandable() {
    return this.props.question.answers.withFreeResponse().length > TOGGLE_FREE_RESPONSE_LIMIT;
  }

  @action.bound onChangeAnswerAttempt() {
    // TODO show cannot change answer message here
    return null;
  }

  toggleFreeResponse = () => {
    this.showNamesAndFreeResponse = !this.showNamesAndFreeResponse;
  };

  renderNoFreeResponse = () => {
    const freeResponsesClasses = 'teacher-review-answers has-no-answers';
    const header = <i>
      No student text responses
    </i>;

    return (
      <Panel header={header} className={freeResponsesClasses} />
    );
  };

  @computed get toggleFreeResponseControls() {
    const numAnswers = this.props.question.answers.withFreeResponse().length;
    let msg, icon;

    if (this.isExpandable) {
      if (this.showNamesAndFreeResponse) {
        msg = 'Hide student text responses';
        icon = 'chevron-down';
      } else {
        msg = `View student text responses (${numAnswers})`;
        icon = 'chevron-right';
      }
    } else {
      if (this.showNamesAndFreeResponse) {
        msg = 'Hide student names';
        icon = 'eye-slash';
      } else {
        msg = 'Show student names';
        icon = 'eye';
      }
    }
    return <a onClick={this.toggleFreeResponse}><Icon type={icon} /> {msg}</a>;
  }

  renderFreeResponse = () => {
    const { showNamesAndFreeResponse, toggleFreeResponseControls, props: { question } } = this;

    let freeResponsesClasses = classnames('teacher-review-answers', {
      active: showNamesAndFreeResponse,
      'is-expandable': this.isExpandable,
    });


    const freeResponses = map(question.answers.withFreeResponse(), (answer, index) => (
      <FreeResponse {...answer} key={`free-response-${question.id}-${index}`} />
    ));

    return (
      <TourAnchor id="student-responses">
        <Panel
          header={toggleFreeResponseControls}
          eventKey={question.id}
          className={freeResponsesClasses}
        >
          {freeResponses}
        </Panel>
      </TourAnchor>

    );
  };

  render() {
    let studentResponses;
    const { question } = this.props;

    studentResponses = question.hasFreeResponse ? this.renderFreeResponse() : this.renderNoFreeResponse();

    return (
      <Question
        question={question.forReview}
        answered_count={question.answered_count}
        type="teacher-review"
        onChangeAttempt={this.onChangeAnswerAttempt}>
        {studentResponses}
      </Question>
    );
  }
}

function TaskTeacherReviewQuestionTracker(props) {
  const { sectionKey } = props;
  const questionProps = pick(props, 'question', 'questionStats');
  return (
    <div data-section={sectionKey}>
      <TaskTeacherReviewQuestion {...questionProps} />
    </div>
  );
}

TaskTeacherReviewQuestionTracker.displayName = 'TaskTeacherReviewQuestionTracker';

export default class TaskTeacherReviewExercise extends React.Component {
  static displayName = 'TaskTeacherReviewExercise';

  static propTypes = {
    exercise: PropTypes.instanceOf(Exercise).isRequired,
    question_stats: PropTypes.object,
    sectionKey: PropTypes.string,
  };

  getQuestionStatsById = (questionId) => {
    const { question_stats } = this.props;
    questionId = questionId.toString();
    return (
      find(question_stats, { question_id: questionId })
    );
  };

  renderQuestion = (question, index) => {
    return (
      <TaskTeacherReviewQuestionTracker
        key={`task-review-question-${question.question_id}`}
        question={question}
        sectionKey={`${this.props.exercise.content.uid}-${index}`} />
    );
  };

  @computed get stimulusHTML() {
    const { stimulus_html } = this.props.exercise.content;
    if (isEmpty(stimulus_html)) { return null; }
    return (
      <ArbitraryHtmlAndMath
        className="exercise-stimulus"
        block={true}
        html={stimulus_html}
      />
    );
  }

  render() {
    const { exercise } = this.props;

    return (
      <div
        className="task-step openstax-exercise openstax-exercise-card">
        <CardBody pinned={false}>
          {this.stimulusHTML}
          {map(exercise.question_stats, this.renderQuestion)}
          <ExerciseGroup
            project="tutor" key="step-exercise-group"
            exercise_uid={exercise.uid}
          />
          <TourAnchor id="errata-link">
            <ExerciseIdentifierLink exerciseId={exercise.content.uid} project="tutor" />
          </TourAnchor>
        </CardBody>
      </div>
    );
  }
}
