import {
  React, PropTypes, observer, computed, observable, action,
} from 'vendor';
import { isEmpty, map, pick, find } from 'lodash';
import { Card } from 'react-bootstrap';
import classnames from 'classnames';
import Exercise from '../../models/exercises/exercise';
import Course from '../../models/course';
import { QuestionStats } from '../../models/task-plans/teacher/stats';
import { Icon } from 'shared';
import {
  ArbitraryHtmlAndMath, Question, ExerciseIdentifierLink,
} from 'shared';
import TourAnchor from '../../components/tours/anchor';

const FreeResponseReview = ({ free_response, student_names }) => {
  const freeResponseProps = { className: 'free-response' };

  if (student_names != null) {
    freeResponseProps['data-student-names'] = student_names.join(', ');
  }

  if (!isEmpty(free_response)) {
    return(
      <div {...freeResponseProps}>
        {free_response}
      </div>
    );
  }

  return null;
};

FreeResponseReview.propTypes = {
  free_response: PropTypes.string,
  student_names: PropTypes.array,
};


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
      <Card header={header} className={freeResponsesClasses} />
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
      <FreeResponseReview {...answer} key={`free-response-${question.id}-${index}`} />
    ));

    return (
      <TourAnchor id="student-responses">
        <Card className={freeResponsesClasses}>
          <Card.Body>{toggleFreeResponseControls}</Card.Body>
          {freeResponses}
        </Card>
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

TaskTeacherReviewQuestionTracker.propTypes = {
  sectionKey: PropTypes.string.isRequired,
};

TaskTeacherReviewQuestionTracker.displayName = 'TaskTeacherReviewQuestionTracker';

export default
class TaskTeacherReviewExercise extends React.Component {
  static displayName = 'TaskTeacherReviewExercise';

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
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
    const { course, exercise } = this.props;

    return (
      <div className="task-step openstax-exercise openstax-exercise-card">
        {this.stimulusHTML}
        {map(exercise.question_stats, this.renderQuestion)}
        <TourAnchor id="errata-link">
          <ExerciseIdentifierLink
            bookUUID={course.ecosystem_book_uuid}
            exerciseId={exercise.content.uid}
            project="tutor"
          />
        </TourAnchor>
      </div>
    );
  }
}
