import React        from 'react';
import ReactDOM     from 'react-dom';
import { Tooltip }  from 'react-joyride';
import { computed } from 'mobx';

import { first }    from 'lodash';
import classnames   from 'classnames';

export default class CenteredWheel extends React.Component {
  className = 'centered-wheel'

  @computed get wrapperClassName() {
    return this.props.className? `${first(this.props.className.split(' '))}-wrapper` : 'training-wheel-wrapper';
  }

  setupWrapperClasses() {
    this.joyrideEl = ReactDOM.findDOMNode(this.props.step.joyrideRef);
    if (this.joyrideEl) {
      this.joyrideEl.className += ` ${this.className}-wrapper ${this.wrapperClassName}`;
    }
  }

  componentDidMount() {
    this.setupWrapperClasses();
  }

  componentDidUpdate() {
    if (!this.joyrideEl) {
      this.setupWrapperClasses();
    }
  }

  componentWillUnmount() {
    if (this.joyrideEl) {
      this.joyrideEl.classList.remove(`${this.className}-wrapper`);
      this.joyrideEl.classList.remove(this.wrapperClassName);
    }
  }

  render () {
    const className = classnames(this.className, this.props.className, this.props.step.className);

    return (
      <Tooltip {...this.props} className={className}/>
    );
  }
}
