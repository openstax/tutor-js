import React        from 'react';
import ReactDOM     from 'react-dom';
import { Tooltip }  from 'react-joyride';

import classnames   from 'classnames';

export default class ViewedOnBlur extends React.PureComponent {
  className = 'viewed-on-blur-tooltip'

  constructor(props) {
    super(props)

    this.checkIsBlur = this.checkIsBlur.bind(this);
  }

  componentDidMount() {
    this.tooltipEl = ReactDOM.findDOMNode(this.tooltip);

    document.addEventListener('click', this.checkIsBlur);
    document.addEventListener('focus', this.checkIsBlur);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.checkIsBlur);
    document.removeEventListener('focus', this.checkIsBlur);
  }

  checkIsBlur (focusEvent) {
    if(focusEvent.target !== this.tooltipEl && !this.tooltipEl.contains(focusEvent.target)) {
      this.props.step.joyrideRef.next();
    }
  }

  render () {
    const className = classnames(this.className,  this.props.className);

    return (
      <Tooltip
        {...this.props}
        className={className}
        ref={tooltip => this.tooltip = tooltip}/>
    );
  }
}
