import PropTypes from 'prop-types';
import React from 'react';
import { computed, action, modelize, runInAction } from 'shared/model'
import { observer } from 'mobx-react';
import Exercises, { ExercisesMap } from '../../models/exercises';
import { ButtonToolbar } from 'react-bootstrap';
import AsyncButton from 'shared/components/buttons/async-button';
import MPQToggle from 'components/exercise/mpq-toggle';
import { SuretyGuard, idType } from 'shared';
import Toasts from '../../models/toasts';

@observer
class ExerciseControls extends React.Component {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                uid: idType,
            }),
        }),
        history: PropTypes.shape({
            push: PropTypes.func,
        }).isRequired,
        exercises: PropTypes.instanceOf(ExercisesMap),
    };

    static defaultProps = {
        exercises: Exercises,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    @computed get exercise() {
        return this.props.exercises.get(this.props.match.params.uid);
    }

    @action.bound async saveExerciseDraft() {
        const { exercise } = this;
        await this.props.exercises.saveDraft(exercise)
        runInAction(() => {
            Toasts.push({
                handler: 'published',
                status: 'ok',
                info: { isDraft: true, exercise },
            });
            this.props.history.push(`/exercise/${exercise.uid}`);
        })
    }

    @action.bound async publishExercise() {
        const { exercise } = this;
        await this.props.exercises.publish(exercise)
        runInAction(() => {
            this.props.exercises.createNewRecord();
            Toasts.push({ handler: 'published', status: 'ok', info: { exercise } });
            this.props.history.push('/search');
        });
    }

    render() {
        const { exercise } = this;
        if (!exercise) { return null; }

        return (
            <li className="exercise-navbar-controls">
                <ButtonToolbar className="navbar-btn">
                    <AsyncButton
                        variant="info"
                        className="draft"
                        onClick={this.saveExerciseDraft}
                        disabled={!exercise.validity.valid}
                        isWaiting={exercise.api.isPending}
                        waitingText="Saving..."
                    >
                        Save Draft
                    </AsyncButton>
                    {!exercise.isNew && (
                        <SuretyGuard
                            onConfirm={this.publishExercise}
                            okButtonLabel="Publish"
                            placement="right"
                            message="Once an exercise is published, it is available for use.">
                            <AsyncButton
                                variant="primary"
                                className="publish"
                                disabled={!exercise.isPublishable}
                                isWaiting={exercise.api.isPending}
                                waitingText="Publishing..."
                            >
                                Publish
                            </AsyncButton>
                        </SuretyGuard>)}
                </ButtonToolbar>
                <div className="right-side">
                    <MPQToggle exercise={exercise} />
                </div>
            </li>
        );
    }
}

export default ExerciseControls;
