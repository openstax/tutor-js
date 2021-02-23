import PropTypes from 'prop-types';
import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import Clipboard from '../helpers/clipboard';

@observer
export default
class CopyOnFocusInput extends React.Component {

  static propTypes = {
    value: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    focusOnMount: PropTypes.bool,
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
    const cn = classnames('copy-on-focus', className);
    const input = (
      <input
        className={label ? null : cn}
        ref={this.setInput}
        readOnly={true}
        onFocus={this.copy}
        {...inputProps} />
    );

    if (label) {
      return (
        <label className={cn}>
          {label}
          {input}
        </label>
      );
    }

    return input;
  }
}
