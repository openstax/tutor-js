import React        from 'react';
import ReactDOM     from 'react-dom';
import { Tooltip }  from 'react-joyride';

import defaultsDeep from 'lodash/defaultsDeep';
import omit         from 'lodash/omit';
import kebabCase    from 'lodash/kebabCase';
import classnames   from 'classnames';

export default class SuperTrainingWheel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.className = kebabCase(this.constructor.name);
  }

  componentDidMount() {
    this.joyrideEl = ReactDOM.findDOMNode(this.props.step.ride.joyrideRef);
    this.joyrideEl.classList.add(`${this.className}-wrapper`);
  }

  componentWillUnmount() {
    this.joyrideEl = ReactDOM.findDOMNode(this.props.step.ride.joyrideRef);
    this.joyrideEl.classList.remove(`${this.className}-wrapper`);
  }

  render () {
    const step = this.props.step;
    const buttons = (
      this.props.step.ride.joyrideRef &&
      this.props.step.ride.joyrideRef.props.steps.length < 3
    )? { primary: 'Continue' } : {};
    const className = classnames(this.className,  this.props.className);

    step.text = this.props.children;
    step.isFixed = true;

    // close hole
    step.style.hole = {
      maxWidth: 0,
      maxHeight: 0
    };

    defaultsDeep(step.style, this.props.style);
    defaultsDeep(buttons, this.props.buttons);

    return (
      <Tooltip
        {...omit(this.props, 'style', 'buttons')}
        showOverlay={true}
        className={className}
        step={step}
        buttons={buttons}
      />
    );
  }
}
