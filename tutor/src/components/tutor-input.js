/* eslint-disable */  // sorry future dev, hopefully you can whip this into shape :(
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { isEmpty, isEqual, map, omit, extend, defer, pick } from 'lodash';
import classnames from 'classnames';
import * as TutorErrors from './tutor-errors';
import { Time } from '../models';
const TutorDateFormat = Time.DATE_FORMAT;

class TutorInput extends React.Component {
  static defaultProps = {
    validate(inputValue) {
      if (isEmpty(inputValue)) { return ['required']; }
    },
    type: 'text',
  };

  static propTypes = {
    label: PropTypes.node.isRequired,
    id: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
    validate: PropTypes.func,
    onUpdated: PropTypes.func,
    autoFocus: PropTypes.bool,
    hasValue: PropTypes.bool,
    defaultValue: PropTypes.string,
    default: PropTypes.string,
  };

  state = { errors: [] };

  componentDidMount() {
    const errors = this.props.validate(this.props.value || this.props.default);
    if (!isEmpty(errors)) { this.setState({ errors }); }
    if (this.props.autoFocus) { return defer(() => this.focus().cursorToEnd()); }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState, this.state)) { return (typeof this.props.onUpdated === 'function' ? this.props.onUpdated(this.state) : undefined); }
  }

  onChange = (event) => {
    // TODO make this more intuitive to parent elements
    this.props.onChange(event.target != null ? event.target.value : undefined, event.target, event);
    return this.validate(event.target != null ? event.target.value : undefined);
  };

  cursorToEnd = () => {
    const input = ReactDOM.findDOMNode(this.refs.input);
    input.selectionStart = (input.selectionEnd = input.value.length);
    return this;
  }; // support chaining

  focus = () => {
    __guard__(ReactDOM.findDOMNode(this.refs.input), x => x.focus());
    return this;
  }; // support chaining

  // The label has style "pointer-events: none" set.  Unfortunantly IE 10
  // doesn't support that and refuses to pass the click through the label into the input
  // We help it out here by manually focusing when then label is clicked
  // (which should only happen on IE 10)
  forwardLabelClick = () => { return this.focus(); };


  validate = (inputValue) => {
    let errors = this.props.validate(inputValue);
    if (errors == null) { errors = []; }
    return this.setState({ errors });
  };

  render() {
    let inputBox, props;
    const { children } = this.props;

    const classes = classnames('form-control', this.props.class,
      { empty: !(this.props.hasValue || this.props.default || this.props.defaultValue || this.props.value) });

    const wrapperClasses = classnames(
      'form-control-wrapper',
      'tutor-input',
      this.props.className,
      {
        'is-required': this.props.required,
        'is-disabled': this.props.disabled,
        'has-error': (this.state.errors != null ? this.state.errors.length : undefined),
      },
    );

    const errors = map(this.state.errors, function(error) {
      if (TutorErrors[error] == null) { return; }
      const ErrorWarning = TutorErrors[error];
      return <ErrorWarning key={error} />;
    });

    let inputProps = {
      ref: 'input',
      className: classes,
      onChange: this.onChange,
    };

    // Please do not set value={@props.value} on input.
    //
    // Because we are updating the store in some cases on change, and
    // the store is providing the @props.value being passed in here,
    // the cursor for typing in this input could be forced to move to the
    // right when the input re-renders since the props have changed.
    //
    // Instead, use @props.default to set an initial default value.
    if (this.props.default != null) {
      inputProps.defaultValue = this.props.default;
    }

    if (children != null) {
      inputBox = React.cloneElement(children, inputProps);
    } else {
      props = omit(this.props, 'autoFocus', 'label', 'className', 'onChange', 'validate', 'default', 'children', 'ref', 'hasValue');
      inputProps = extend({}, inputProps, props);

      inputBox = <input {...inputProps} />;
    }

    return (
      <label className={wrapperClasses}>
        {inputBox}
        <div className="floating-label" onClick={this.forwardLabelClick}>
          {this.props.label}
        </div>
        {errors}
      </label>
    );
  }
}

class TutorTextArea extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
  };

  componentDidMount() {
    if ((this.props.default != null ? this.props.default.length : undefined) > 0) { return this.resize(); }
  }

  onChange = (event) => {
    return this.props.onChange(event.target != null ? event.target.value : undefined, event.target);
  };

  focus = () => {
    return __guard__(ReactDOM.findDOMNode(this.refs.textarea), x => x.focus());
  };

  // Forward clicks on for IE10.  see comments on TutorInput
  forwardLabelClick = () => { return this.focus(); };

  resize = (event) => {
    return this.refs.textarea.style.height = `${Math.max(this.refs.textarea.scrollHeight, 45)}px`;
  };

  render() {

    const classes = classnames('form-control', this.props.inputClass,
      { empty: !this.props.value && !this.props.default });

    const wrapperClasses = classnames('form-control-wrapper', 'tutor-input', this.props.className,
      { 'is-required': this.props.required });

    const textAreaProps = pick(this.props, 'value', 'disabled', 'maxLength');

    return (
      <div className={wrapperClasses}>
        <textarea
          id={this.props.inputId}
          ref="textarea"
          type="text"
          onKeyUp={this.resize}
          onPaste={this.resize}
          className={classes}
          defaultValue={this.props.default}
          onChange={this.onChange}
          {...textAreaProps}
        />
        <div className="floating-label" onClick={this.forwardLabelClick}>
          {this.props.label}
        </div>
        <div className="hint required-hint">
          Required field
        </div>
      </div>
    );
  }
}

// TODO: replace with new and improved BS.Radio when we update
class TutorRadio extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
  };

  handleChange = (changeEvent) => {
    const { value } = this.props;

    return (typeof this.props.onChange === 'function' ? this.props.onChange(changeEvent, { value }) : undefined);
  };

  isChecked = () => {
    return this.refs.radio.checked;
  };

  render() {
    let { label, className, value, id, checked } = this.props;
    const inputProps = pick(this.props, 'value', 'id', 'name', 'checked', 'disabled');

    if (label == null) { label = value; }
    const classes = classnames('tutor-radio', className, {
      active: checked, disabled: this.props.disabled
    });

    return (
      <div className={classes}>
        <input ref="radio" {...inputProps} type="radio" onChange={this.handleChange} />
        {' '}
        <label htmlFor={id}>
          {label}
        </label>
      </div>
    );
  }
}

export { TutorInput, TutorDateFormat, TutorTextArea, TutorRadio };

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
