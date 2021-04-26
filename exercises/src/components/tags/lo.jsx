import PropTypes from 'prop-types';
import React from 'react';
import { map } from 'lodash';
import classnames from 'classnames';
import Exercise from '../../models/exercises/exercise';
import { observer } from 'mobx-react';
import { computed, action, observable } from 'mobx';
import TagModel from 'shared/model/exercise/tag';
import { Icon } from 'shared';
import { modelize } from 'shared/model'
import Error from './error';
import Wrapper from './wrapper';
import BookSelection from './book-selection';

const TYPE = 'lo';
const LO_PATTERNS = {
    default: {
        placeholder: '##-##-##',
        excluded_characters: /[^0-9.-]/g,
        match: /^\d{1,2}(-|\.)\d{1,2}(-|\.)\d{1,2}$/,
    },
    'stax-worldhist': {
        placeholder: '[AB]##-##-##',
        excluded_characters: /[^AB0-9.-]/g,
        match: /^[AB]\d{1,2}(-|\.)\d{1,2}(-|\.)\d{1,2}$/,
    },
}

@observer
class Input extends React.Component {
    static propTypes = {
        exercise: PropTypes.instanceOf(Exercise).isRequired,
        tag: PropTypes.instanceOf(TagModel).isRequired,
    };

    constructor(props) {
        super(props);
        modelize(this);
    }

    @observable value = this.props.tag.value;
    @computed get book() {
        return this.props.tag.specifier;
    }

    @computed get lo() {
        return this.props.tag.value;
    }

    @computed get lo_pattern() {
        if (this.book in LO_PATTERNS) {
            return LO_PATTERNS[this.book];
        }

        return LO_PATTERNS.default;
    }

    @computed get placeholder() {
        return this.lo_pattern.placeholder;
    }

    @computed get excluded_characters_pattern() {
        return this.lo_pattern.excluded_characters;
    }

    @computed get match_pattern() {
        return this.lo_pattern.match;
    }

    @computed get errorMsg() {
        if (!this.book) { return 'Must have book'; }

        if (this.lo != null && !this.lo.match(this.match_pattern)) {
            return 'Must match LO pattern of ' + this.placeholder;
        }

        return null;
    }

    @action.bound onTextChange(ev) {
        this.value = ev.target.value.replace(this.excluded_characters_pattern, '');
    }

    @action.bound onTextBlur() {
        this.props.tag.value = this.value;
    }

    @action.bound updateBook(ev) {
        this.props.tag.specifier = ev.target.value;
    }

    @action.bound onDelete() {
        this.props.exercise.tags.remove(this.props.tag);
    }

    render() {
        const { exercise } = this.props;

        return (
            <div className={classnames('tag', { 'has-error': this.errorMsg })}>
                <BookSelection
                    onChange={this.updateBook}
                    selected={this.book}
                    limit={map(exercise.tags.withType('book', { multiple: true }), 'value')} />
                <input
                    className="form-control"
                    type="text"
                    onChange={this.onTextChange}
                    onBlur={this.onTextBlur}
                    value={this.value}
                    placeholder={this.placeholder}
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
class LoTags extends React.Component {

    static propTypes = {
        exercise: PropTypes.instanceOf(Exercise).isRequired,
    };

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound onAdd() {
        let newTag = { type: TYPE, value: '' };
        const tags = this.props.exercise.tags;
        const bookTag = tags.withType('book');
        if (bookTag) { newTag.specifier = bookTag.value; }

        tags.push(newTag);
    }

    render() {
        const tags = this.props.exercise.tags.withType(TYPE, { multiple: true });

        return (
            <Wrapper label="LO" onAdd={this.onAdd}>
                {tags.map((tag, i) =>
                    <Input key={i} {...this.props} tag={tag} />)}
            </Wrapper>
        );
    }

}

export default LoTags;
