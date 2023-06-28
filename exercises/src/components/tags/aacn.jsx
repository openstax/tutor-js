import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import Exercise from '../../models/exercises/exercise';
import { observer } from 'mobx-react';
import { action, computed, observable, modelize } from 'shared/model';
import TagModel from 'shared/model/exercise/tag';
import { Icon } from 'shared';
import Error from './error';
import { nursingBooks } from './nursingBooks';
import Wrapper from './wrapper';

const pattern = '##.#[a-z]';

@observer
class Input extends React.Component {
    static propTypes = {
        exercise: PropTypes.instanceOf(Exercise).isRequired,
        tag: PropTypes.instanceOf(TagModel).isRequired,
    };

    @observable aacn = this.props.tag.value;

    isValid(aacn) {
        return aacn && aacn.match(/^\d{1,2}\.\d[a-z]$/);
    }

    @computed get errorMsg() {
        if (this.isValid(this.aacn)) {
            return null;
        } else {
            return `Must be present and match AACN pattern of ${pattern}`;
        }
    }

    constructor(props) {
        super(props)
        modelize(this);
    }

    @action.bound onTextChange(ev) {
        this.aacn = ev.target.value.toLowerCase().replace(/[^0-9a-z.]+/, '');
    }

    @action.bound onTextBlur() {
        this.props.tag.value = this.isValid(this.aacn) ? this.aacn : '';
    }

    @action.bound onDelete() {
        this.props.exercise.tags.remove(this.props.tag);
    }

    render() {
        return (
            <div className={classnames('tag', { 'has-error': this.errorMsg })}>
                <input
                    className="form-control"
                    type="text"
                    onChange={this.onTextChange}
                    onBlur={this.onTextBlur}
                    value={this.aacn}
                    placeholder={pattern}
                />
                <Error error={this.errorMsg} />
                <span className="controls">
                    <Icon type="trash" onClick={this.onDelete} />
                </span>
            </div>
        );
    }
}

@observer
class AACNTags extends React.Component {
    static propTypes = {
        exercise: PropTypes.instanceOf(Exercise).isRequired,
    };

    constructor(props) {
        super(props)
        modelize(this);
    }

    @action.bound onAdd() {
        this.props.exercise.tags.push({ type: 'nursing', specifier: 'aacn', value: '' });
    }

    render() {
        const { exercise } = this.props;

        const bookTags = exercise.tags.withType('book', { multiple: true });
        if (!bookTags.find(tag => nursingBooks.includes(tag.value))) {
            return null;
        }

        const nursingTags = exercise.tags.withType('nursing', { multiple: true });
        const aacnTags = nursingTags.filter(tag => tag.specifier === 'aacn');

        return (
            <Wrapper label="AACN" onAdd={this.onAdd}>
                {aacnTags.map((tag, i) => <Input key={i} {...this.props} tag={tag} />)}
            </Wrapper>
        );
    }
}

export default AACNTags;
