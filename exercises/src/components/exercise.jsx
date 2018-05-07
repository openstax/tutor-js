import React from 'react';
import { withRouter } from 'react-router';
import { observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import { ExercisePreview } from 'shared';
import Exercises, { ExercisesMap } from '../models/exercises';
import { Button, Tabs, Tab, Alert } from 'react-bootstrap';
import Question from './exercise/question';
import ExerciseTags from './exercise/tags';
import Attachments from './exercise/attachments';
import Controls from './exercise/controls';
import { idType } from 'shared';
import { Loading, NotFound } from './exercise-state';

@withRouter
@observer
export default class Exercise extends React.Component {

  static propTypes = {
    match: React.PropTypes.shape({
      params: React.PropTypes.shape({
        uid: idType,
      }),
    }),
    history: React.PropTypes.shape({
      push: React.PropTypes.func,
    }).isRequired,
    exercises: React.PropTypes.instanceOf(ExercisesMap),
  };

  static defaultProps = {
    exercises: Exercises,
  }

  static Controls = Controls;

  @observable activeTabKey = 'question-0';

  @computed get exercise() {
    return this.props.exercises.get(this.props.match.params.uid);
  }

  componentWillMount() {
    const { uid } = this.props.match.params;
    this.props.exercises.ensureLoaded(uid);
  }

  @action.bound updateStimulus(ev) {
    this.exercise.stimulus_html = ev.target.value;
  }

  renderIntroTab = () => {
    return (
      <Tab eventKey="intro" title="Intro">
        {this.renderNickname()}
        <div className="exercise-stimulus">
          <label>
            Exercise Stimulus
          </label>
          <textarea
            onChange={this.updateStimulus}
            defaultValue={this.exercise.stimulus_html} />
        </div>
      </Tab>
    );
  };

  renderMpqTabs = () => {
    return this.exercise.questions.map((question, index) =>
      <Tab key={index} eventKey={`question-${index}`} title={`Question ${index+1}`}>
        <Question {...this.questionProps} question={question} />
      </Tab>
    );
  };

  renderSingleQuestionTab() {
    const { exercise } = this;
    return (
      <Tab key={0} eventKey="question-0" title="Question">
        {this.renderNickname()}
        <Question {...this.questionProps} question={exercise.questions[0]} />
      </Tab>
    );
  }

  addQuestion = () => {
    this.exercise.questions.push({ });
  }

  @action.bound selectTab(tab) {
    this.activeTabKey = tab;
  }


  @computed get questionProps() {
    const { exercise } = this;
    return {
      onRemove: (question) => {
        exercise.questions.remove(question);
        this.activeTabKey = 'question-0';
      },
      onMove: (question, offset) => {
        exercise.moveQuestion(question, offset);
        this.activeTabKey = `question-${question.index}`;
      },
    };
  }

  @action.bound updateNickname(ev) {
    this.exercise.nickname = ev.target.value;
  }

  renderNickname() {
    return (
      <div className="nickname">
        <label>
          Exercise Nickname:
          <input onChange={this.updateNickname} value={this.exercise.nickname || ''} />
        </label>
      </div>
    );
  }

  renderMPQ() {
    return (
      <Button onClick={this.addQuestion} className="add-mpq" bsStyle="primary">
        Add Question
      </Button>
    );
  }

  render() {
    if (this.props.exercises.api.isPending) { return <Loading />; }
    const { exercise } = this;
    if (!exercise) { return <NotFound />; }
    const { isMultiPart } = exercise;

    return (
      <div className="exercise-editor">
        <div className="editing-controls">
          {exercise.error && <Alert bsStyle="danger">{String(exercise.error)}</Alert>}
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
            <Tab eventKey="assets" title="Assets">
              <Attachments exercises={this.props.exercises} exercise={exercise} />
            </Tab>
          </Tabs>
        </div>
        <ExercisePreview exercise={exercise} />
      </div>
    );
  }
}
