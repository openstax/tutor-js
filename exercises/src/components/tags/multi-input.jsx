import React from 'react';
import classnames from 'classnames';
import Exercise from '../../models/exercises/exercise';

import Wrapper from './wrapper';
import Error from './error';

class Input extends React.Component {
  static defaultProps = { inputType: 'text' };

  static propTypes = {
    tag: React.PropTypes.string.isRequired,
  };

  state = { value: this.props.tag };

  componentWillReceiveProps(nextProps) {
    return (
      this.setState({ value: nextProps.tag })
    );
  }

  onChange = (ev) => {
    return (
      this.setState({ errorMsg: null, value: this.props.cleanInput(ev.target.value) })
    );
  };

  validateAndSave = (ev) => {
    const { value } = this.state;
    const error = this.props.validateInput(value);
    if (error) {
      return (
        this.setState({ errorMsg: error })
      );
    } else {
      return (
        this.props.actions.setPrefixedTag(this.props.id,
          { prefix: this.props.prefix, tag: value, previous: this.props.tag }
        )
      );
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
      (
        <div className={classnames('tag', { 'has-error': this.state.errorMsg })}>
          <input
            className="form-control"
            type={this.props.inputType}
            onChange={this.onChange}
            onBlur={this.validateAndSave}
            value={this.state.value}
            placeholder={this.props.placeholder} />
          <Error error={this.state.errorMsg} />
          <span className="controls">
            <i onClick={this.onDelete} className="fa fa-trash" />
          </span>
        </div>
      )
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
