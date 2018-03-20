import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { computed, action, observable } from 'mobx';
import Exercise from '../../models/exercises/exercise';
import TagModel from 'shared/model/exercise/tag';
import Wrapper from './wrapper';
import Error from './error';


@observer
class Input extends React.Component {
  static defaultProps = { inputType: 'text' };

  static propTypes = {
    tag:           React.PropTypes.instanceOf(TagModel).isRequired,
    type:          React.PropTypes.string.isRequired,
    exercise:      React.PropTypes.instanceOf(Exercise).isRequired,
    cleanInput:    React.PropTypes.func.isRequired,
    validateInput: React.PropTypes.func.isRequired,
  };

  @observable errorMsg = '';
  @observable value = '';

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
          <i onClick={this.onDelete} className="fa fa-trash" />
        </span>
      </div>
    );
  }
}

@observer
class MultiInput extends React.Component {
  static propTypes = {
    exercise:      React.PropTypes.instanceOf(Exercise).isRequired,
    label:         React.PropTypes.string.isRequired,
    type:          React.PropTypes.string.isRequired,
    cleanInput:    React.PropTypes.func.isRequired,
    validateInput: React.PropTypes.func.isRequired,
  };

  @action.bound add() {
    this.props.exercise.tags.push({ type: this.props.type });
  }

  render() {
    const tags = this.props.exercise.tags.withType(this.props.type, { multiple: true });

    return (
      <Wrapper label={this.props.label} onAdd={this.add} singleTag={tags.length === 1}>
        {tags.map((tag, index) =>
          <Input {...this.props} key={index} tag={tag} />)}
      </Wrapper>
    );
  }
}

export default MultiInput;
