import React        from 'react';
import ReactDOM     from 'react-dom';
import { Tooltip }  from 'react-joyride';

import kebabCase    from 'lodash/kebabCase';
import first        from 'lodash/first';
import classnames   from 'classnames';

export default class CenteredWheel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.className = kebabCase(this.constructor.name);
    this.wrapperClassName = this.props.className? `${first(this.props.className.split(' '))}-wrapper` : 'training-wheel-wrapper';
  }

  setupWrapperClasses() {
    this.joyrideEl = ReactDOM.findDOMNode(this.props.step.ride.joyrideRef);
    if (this.joyrideEl) {
      this.joyrideEl.classList.add(`${this.className}-wrapper`, this.wrapperClassName);
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
      this.joyrideEl.classList.remove(`${this.className}-wrapper`, this.wrapperClassName);
    }
  }

  render () {
    const className = classnames(this.className,  this.props.className);

    return (
      <Tooltip {...this.props} className={className}/>
    );
  }
}
