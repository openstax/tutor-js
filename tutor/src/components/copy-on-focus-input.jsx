import React from 'react';
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { autobind } from 'core-decorators';

import Clipboard from '../helpers/clipboard';

@observer
export default class CopyOnFocusInput extends React.PureComponent {

  static propTypes = {
    value: React.PropTypes.string.isRequired,
    label: React.PropTypes.string,
    className: React.PropTypes.string,
    focusOnMount: React.PropTypes.bool,
  }

  @observable input;

  static defaultProps = {
    focusOnMount: false,
  }

  focus() {
    this.input.focus();
  }

  @autobind copy() {
    this.input.select();
    Clipboard.copy();
  }

  @autobind setInput(i) { this.input = i; }

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
        ref={this.setInput}
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
