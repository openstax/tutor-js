import React from 'react';
import { observer } from 'mobx-react';
import { computed, observable } from 'mobx';
import { ExercisePreview } from 'shared';
import Exercises, { ExercisesMap } from '../models/exercises';
import { Button, Tabs, Tab } from 'react-bootstrap';
import Question from './exercise/question';
import ExerciseTags from './exercise/tags';
import Attachments from './exercise/attachments';
import Controls from './exercise/controls';
import { idType } from 'shared';

const Loading = () => (
  <h1>Loading…</h1>
);

const NotFound = () => (
  <h1>Exercise was not found</h1>
);


// import _ from 'underscore';

// import classnames from 'classnames';
//
// import { ExerciseActions, ExerciseStore } from 'stores/exercise';
// import ExercisePreview from 'components/exercise/preview';
// import PublishedModal from './published-modal';



@observer
export default class Exercise extends React.Component {

  static propTypes = {
    match: React.PropTypes.shape({
      params: React.PropTypes.shape({
        numberWithVersion: idType,
      }),
    }),
    exercises: React.PropTypes.instanceOf(ExercisesMap),
  };

  static defaultProps = {
    exercises: Exercises,
  }

  static Controls = Controls;

  @observable tab = 'question-0';

  state = {};

  @computed get exercise() {
    return this.props.exercises.get(this.props.match.params.numberWithVersion);
  }

  componentWillMount() {
    const { numberWithVersion } = this.props.match.params;
    this.props.exercises.ensureLoaded(numberWithVersion);
  }

  moveQuestion = (questionId, direction) => {
    // return (
    //   ExerciseActions.moveQuestion(this.props.id, questionId, direction)
    // );
  };

  removeQuestion = (questionId) => {
    // return (
    //   ExerciseActions.removeQuestion(this.props.id, questionId)
    // );
  };

  updateStimulus = (event) => {
    // return (
    //   ExerciseActions.updateStimulus(this.props.id, event.target != null ? event.target.value : undefined)
    // );
  };

  renderIntroTab = () => {
    const { id } = this.props;
    return (
      <Tab eventKey="intro" title="Intro">
        <div className="exercise-stimulus">
          <label>
            Exercise Stimulus
          </label>
          <textarea
            onChange={this.updateStimulus}
            defaultValue={ExerciseStore.getStimulus(id)} />
        </div>
      </Tab>
    );
  };

  renderMpqTabs = () => {
    const { questions } = ExerciseStore.get(this.props.id);
    return (
      Array.from(questions).map((question, i) =>
        <Tab key={question.id} eventKey={`question-${i}`} title={`Question ${i+1}`}>
          <Question
            id={question.id}
            sync={this.sync}
            canMoveLeft={i !== 0}
            canMoveRight={i !== (questions.length - 1)}
            moveQuestion={this.moveQuestion}
            removeQuestion={_.partial(this.removeQuestion, question.id)} />
        </Tab>)
    );
  };

  renderSingleQuestionTab() {
    const { exercise } = this;
    return (
      <Tab key={0} eventKey="question-0" title="Question">
        <Question question={exercise.questions[0]} />
      </Tab>
    );
  }

  addQuestion = () => {
    return (
      ExerciseActions.addQuestionPart(this.props.id)
    );
  };

  selectTab = (tab) => { return this.setState({ tab }); };


  getActiveTab = (showMPQ) => {
    if (!this.state.tab || ((this.state.tab != null ? this.state.tab.indexOf('question-') : undefined) === -1)) {
      return (
        this.state.tab
      );
    }

    const question = this.state.tab.split('-')[1];
    const numQuestions = ExerciseStore.getQuestions(this.props.id).length;
    if (!showMPQ || (question >= numQuestions)) {
      return (
        'question-0'
      );
    }

    return (

      this.state.tab

    );
  };


  renderMPQ() {
    return (
      <Button onClick={this.addQuestion} className="add-mpq" bsStyle="primary">
        Add Question
      </Button>
    );
  }

  @observable activeTabKey = 'question-0';

  render() {
    if (this.props.exercises.api.isPending) { return <Loading />; }

    const { exercise } = this;
    if (!exercise) { return <NotFound />; }

    const { isMultiPart } = exercise;

    return (
      <div className="exercise-editor">
        <div className="editing-controls">
          {isMultiPart && this.renderMPQ()}
          <Tabs
            id="exercise-parts"
            activeKey={this.activeTabKey}
            onSelect={this.selectTab}
            defaultActiveKey="question-0"
            animation={false}
          >
            {isMultiPart && this.renderIntroTab()}
            {isMultiPart ? this.renderMpqTabs() : this.renderSingleQuestionTab()}
            <Tab eventKey="tags" title="Tags">
              <ExerciseTags exercise={exercise} />
            </Tab>
            {exercise.isNew && (
              <Tab eventKey="assets" title="Assets">
                <Attachments exercise={exercise} />
              </Tab>
            )}
          </Tabs>
        </div>
        <ExercisePreview exercise={exercise} />
      </div>
    );
  }
}
