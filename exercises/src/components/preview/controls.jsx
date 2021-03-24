import PropTypes from 'prop-types';
import React from 'react';
import { partial, find } from 'lodash';
import Exercises, { ExercisesMap } from '../../models/exercises';
import { idType } from 'shared';
import { observer } from 'mobx-react';
import { computed, action } from 'mobx';
import { Button, ButtonGroup } from 'react-bootstrap';
import keymaster from 'keymaster';

const KEYBINDING_SCOPE = 'ex-preview';

@observer
class PreviewControls extends React.Component {
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

    componentDidMount() {
        // left/right to go between exercises, and up/down to go between versions.
        keymaster('up', KEYBINDING_SCOPE, this.goNextVersion);
        keymaster('down', KEYBINDING_SCOPE, this.goPrevVersion);
        keymaster('left', KEYBINDING_SCOPE, this.goPrevExercise);
        keymaster('right', KEYBINDING_SCOPE, this.goNextExercise);
        return (
            keymaster.setScope(KEYBINDING_SCOPE)
        );
    }

    @computed get exercise() {
        return this.props.exercises.get(this.props.match.params.uid);
    }

    disableKeys = () => {
        return (
            keymaster.deleteScope(KEYBINDING_SCOPE)
        );
    };

    @action.bound moveExercise(offset) {
        const { exercise } = this;
        const vers = exercise.number+offset;
        this.props.exercises.ensureLoaded(vers);
        this.props.history.push(`/preview/${vers}`);
    }

    @action.bound goPrevVersion() {
        const { exercise } = this;
        const uid = `${exercise.number}@${this.prevVersion}`;
        this.props.exercises.ensureLoaded(uid);
        this.props.history.push(`/preview/${uid}`);
    }

    @action.bound goNextVersion() {
        const { exercise } = this;
        const uid = `${exercise.number}@${this.nextVersion}`;
        this.props.exercises.ensureLoaded(uid);
        this.props.history.push(`/preview/${uid}`);
    }

    @computed get nextVersion() {
        const { exercise } = this;
        const versions = exercise.versions.slice().sort();
        return find(versions, (v) => v > exercise.version);
    }

    @computed get prevVersion() {
        const { exercise } = this;
        const versions = exercise.versions.slice().sort();
        return find(versions, (v) => v < exercise.version);
    }

    render() {
        const { exercise } = this;
        if (!exercise) { return null; }

        const { nextVersion, prevVersion } = this;
        // left/right to go between exercises, and up/down to go between versions.

        return (
            <li className="preview-navbar-controls">
                <ButtonGroup className="paging-controls">
                    <Button
                        href="#"
                        onClick={partial(this.moveExercise, -1)}
                        title="Go to previous exercise"
                        disabled={exercise.number === 1}>
                        {exercise.number === 1 ? '◅' : '◀'}
                    </Button>
                    <Button
                        href="#"
                        onClick={this.goPrevVersion}
                        disabled={!prevVersion}
                        title="Go down a version">
                        {prevVersion ? '▼' : '▽'}
                    </Button>
                    <span className="ex-info">
            Viewing exercise {exercise.uid}
                    </span>
                    <Button
                        href="#"
                        onClick={this.goNextVersion}
                        disabled={!nextVersion}
                        title="Go up a version">
                        {nextVersion ? '▲' : '△'}
                    </Button>
                    <Button href="#" onClick={partial(this.moveExercise, 1)} title="Go to next exercise">
            ►
                    </Button>
                </ButtonGroup>
            </li>
        );
    }
}

export default PreviewControls;
