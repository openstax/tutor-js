import React from 'react';
import classnames from 'classnames';
import Exercise from '../../models/exercises/exercise';
import TagModel from 'shared/model/exercise/tag';
import Wrapper from './wrapper';
import Error from './error';
import { observer } from 'mobx-react';
import { computed, action, observable } from 'mobx';

@observer
class Input extends React.Component {
  static defaultProps = { inputType: 'text' };

  static propTypes = {
    tag: React.PropTypes.instanceOf(TagModel).isRequired,
    prefix: React.PropTypes.string.isRequired,
    validateInput: React.PropTypes.func.isRequired,
  };

  @observable errorMsg = '';
  @observable value = '';

  @action.bound onChange(ev) {
    this.errorMsg = '';
    this.value = this.props.cleanInput(ev.target.value);
  }

  validateAndSave = (ev) => {
    const { value } = this.state;
    const error = this.props.validateInput(value);
    if (error) {
      this.setState({ errorMsg: error })
    } else {
      this.tag.value = value;
    }
  };

  onDelete = () => {
    return (
      this.props.actions.setPrefixedTag(this.props.id,
        { prefix: this.props.prefix, tag: false, previous: this.props.tag }
      )
    );
  };

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

class MultiInput extends React.Component {
  static propTypes = {
    exercise: React.PropTypes.instanceOf(Exercise).isRequired,
    label:         React.PropTypes.string.isRequired,
    prefix:        React.PropTypes.string.isRequired,
    cleanInput:    React.PropTypes.func.isRequired,
    validateInput: React.PropTypes.func.isRequired,
  };

  add = () => {
    return (
      this.props.actions.addBlankPrefixedTag(this.props.id, { prefix: this.props.prefix })
    );
  };

  render() {
    const tags = this.props.exercise.tagsWithPrefix(this.props.prefix);

    return (
      <Wrapper label={this.props.label} onAdd={this.add} singleTag={tags.length === 1}>
        {Array.from(tags).map((tag) =>
          <Input key={tag} {...this.props} tag={tag} />)}
      </Wrapper>
    );
  }
}

export default MultiInput;
