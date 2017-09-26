import React from 'react';
import { autobind } from 'core-decorators';
import Clipboard from '../helpers/clipboard';

export default class CopyOnFocusInput extends React.PureComponent {

  static propTypes = {
    value: React.PropTypes.string.isRequired,
    label: React.PropTypes.string,
    className: React.PropTypes.string,
    focusOnMount: React.PropTypes.bool,
  }

  static defaultProps = {
    focusOnMount: false,
  }

  focus() {
    this.refs.input.focus();
  }

  @autobind
  copy() {
    this.refs.input.select();
    Clipboard.copy();
  }

  componentDidMount() {
    if (this.props.focusOnMount) {
      this.focus();
      this.copy();
    }
  }

  render() {
    const { label, className, focusOnMount: _, ...inputProps } = this.props;

    const input = (
      <input
        className={label ? null : className}
        ref="input"
        className="copy-on-focus"
        readOnly={true}
        onFocus={this.copy}
        {...inputProps} />
    );

    if (label) {
      return (
        <label className={className}>
          {label}
          {input}
        </label>
      );
    }

    return input;
  }
}
