import React from 'react';
import { observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import { isEmpty, map, pick, find } from 'lodash';
import { Panel } from 'react-bootstrap';
import classnames from 'classnames';
import { Exercise, Question as QuestionModel } from '../../models/task-plan/stats';
import Icon from '../icon';
import {
  ArbitraryHtmlAndMath, Question, CardBody, FreeResponse,
  ExerciseGroup, ExerciseIdentifierLink,
} from 'shared';
import TourAnchor from '../tours/anchor';


@observer
class TaskTeacherReviewQuestion extends React.PureComponent {

  static propTypes = {
    question: React.PropTypes.instanceOf(QuestionModel).isRequired,
  };

  @observable showFreeResponse = false;

  @action.bound onChangeAnswerAttempt() {
    // TODO show cannot change answer message here
    return null;
  }

  toggleFreeResponse = () => {
    this.showFreeResponse = !this.showFreeResponse;
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
    let msg, icon;
    if (this.showFreeResponse) {
      msg = 'Hide student text responses';
      icon = 'chevron-up';
    } else {
      msg = `View student text responses (${this.props.question.answers.length})`;
      icon = 'chevron-right';
    }
    return <a onClick={this.toggleFreeResponse}>{msg} <Icon type={icon} /></a>;
  }

  renderFreeResponse = () => {
    const { showFreeResponse, toggleFreeResponseControls, props: { question } } = this;

    let freeResponsesClasses = 'teacher-review-answers';
    if (showFreeResponse) { freeResponsesClasses += ' active'; }

    const freeResponses = map(question.answers, (answer, index) => (
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
        model={question.forReview}
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
    exercise: React.PropTypes.instanceOf(Exercise).isRequired,
    question_stats: React.PropTypes.object,
    sectionKey: React.PropTypes.string,
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
        sectionKey={`${question.exercise.uid}-${index}`} />
    );
  };

  @computed get stimulusHTML() {
    const { stimulus_html } = this.props.exercise.contentData;
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
            <ExerciseIdentifierLink exerciseId={exercise.uid} project="tutor" />
          </TourAnchor>
        </CardBody>
      </div>
    );
  }
}
