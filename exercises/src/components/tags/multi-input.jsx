import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { Icon } from 'shared';
import { action, observable, modelize } from 'shared/model';
import Exercise from '../../models/exercises/exercise';
import TagModel from 'shared/model/exercise/tag';
import Wrapper from './wrapper';
import Error from './error';


@observer
class Input extends React.Component {
    static defaultProps = { inputType: 'text' };

    static propTypes = {
        tag:           PropTypes.instanceOf(TagModel).isRequired,
        type:          PropTypes.string.isRequired,
        inputType:     PropTypes.string,
        placeholder:   PropTypes.string,
        exercise:      PropTypes.instanceOf(Exercise).isRequired,
        cleanInput:    PropTypes.func.isRequired,
        validateInput: PropTypes.func.isRequired,
    };

    @observable errorMsg = '';
    @observable value = '';

    constructor(props) {
        super(props)
        modelize(this);
    }

    @action componentDidMount() {
        this.value = this.props.tag.value;
    }

    @action.bound onChange(ev) {
        this.errorMsg = '';
        this.value = this.props.cleanInput(ev.target.value);
    }

    @action.bound validateAndSave() {
        const { value } = this;
        this.errorMsg = this.props.validateInput(value);
        if (!this.errorMsg) {
            this.props.tag.value = value;
        }
    }

    @action.bound onDelete() {
        this.props.exercise.tags.remove(this.props.tag);
    }

    render() {
        return (
            <div className={classnames('tag', { 'has-error': this.errorMsg })}>
                <input
                    className="form-control"
                    type={this.props.inputType}
                    onChange={this.onChange}
                    onBlur={this.validateAndSave}
                    value={this.value}
                    placeholder={this.props.placeholder} />
                <Error error={this.errorMsg} />
                <span className="controls">
                    <Icon onClick={this.onDelete} type="trash" />
                </span>
            </div>
        );
    }
}

@observer
class MultiInput extends React.Component {
    static propTypes = {
        exercise:      PropTypes.instanceOf(Exercise).isRequired,
        label:         PropTypes.string.isRequired,
        type:          PropTypes.string.isRequired,
        cleanInput:    PropTypes.func.isRequired,
        validateInput: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound add() {
        this.props.exercise.tags.push({ type: this.props.type });
    }

    render() {
        const { exercise } = this.props;
        const tags = exercise.tags.withType(this.props.type, { multiple: true });

        return (
            <Wrapper label={this.props.label} onAdd={this.add} singleTag={tags.length === 1}>
                {tags.map((tag) =>
                    <Input key={`${exercise.id}-${tag.asString}`}
                        {...this.props}
                        tag={tag}
                    />)}
            </Wrapper>
        );
    }
}

export default MultiInput;
