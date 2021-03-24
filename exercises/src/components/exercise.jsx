import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import ExercisePreview from './exercise/preview';
import Exercises, { ExercisesMap } from '../models/exercises';
import { Button, Tabs, Tab, Alert } from 'react-bootstrap';
import Question from './exercise/question';
import ExerciseTags from './exercise/tags';
import Attachments from './exercise/attachments';
import Controls from './exercise/controls';
import { idType } from 'shared';
import { Loading, NotFound } from './exercise-state';

const DEFAULT_TAB = 'question-0';

@observer
export default
class Exercise extends React.Component {

    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                uid: idType,
            }),
        }),
        exercises: PropTypes.instanceOf(ExercisesMap),
    };

    static defaultProps = {
        exercises: Exercises,
    }

    static Controls = Controls;

    @observable activeTabKey = DEFAULT_TAB;

    @computed get exercise() {
        return this.props.exercises.get(this.props.match.params.uid);
    }

    UNSAFE_componentWillMount() {
        const { uid } = this.props.match.params;
        this.props.exercises.ensureLoaded(uid);
    }

    @action.bound updateStimulus(ev) {
        this.exercise.stimulus_html = ev.target.value;
    }

    renderStimulusTab = () => {
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
            <Tab key={0} eventKey={DEFAULT_TAB} title="Question">
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
                // toggle MPQ if it's the next-to-last question
                // this allows the exercise to do cleanup
                if (exercise.questions.length == 2) {
                    exercise.toggleMultiPart();
                } else {
                    exercise.questions.remove(question);
                }
                this.activeTabKey = DEFAULT_TAB;
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
            <Button onClick={this.addQuestion} className="add-mpq" variant="primary">
        Add Question
            </Button>
        );
    }

    render() {
        if (this.props.exercises.api.isPending) { return <Loading />; }
        const { exercise } = this;
        if (!exercise) { return <NotFound />; }
        const { hasStimulus, isMultiPart } = exercise;

        return (
            <div className="exercise-editor">
                <div className="editing-controls">
                    {exercise.error && <Alert variant="danger">{exercise.errorMessage}</Alert>}
                    {isMultiPart && this.renderMPQ()}

                    <Tabs
                        id="exercise-parts"
                        activeKey={this.activeTabKey}
                        onSelect={this.selectTab}
                        defaultActiveKey={DEFAULT_TAB}
                    >
                        {(hasStimulus || isMultiPart) && this.renderStimulusTab()}
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
