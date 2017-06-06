import React        from 'react';
import { Tooltip }  from 'react-joyride';

import classnames   from 'classnames';
import defaultsDeep from 'lodash/defaultsDeep';
import omit         from 'lodash/omit';

function ValueProp({ className, children }) {
  return <div className={classnames('value-prop', className)}>{children}</div>;
}

function ColumnContent({ children }) {
  return <div className="column-content">{children}</div>;
}

function Column({ className, children }) {
  return <div className={classnames('column', className)}>{children}</div>;
}

function TutorBeta() {
  return (
    <span>OpenStax Tutor <span className="beta">beta</span></span>
  );
}

class SuperTrainingWheel extends React.PureComponent {
  render () {
    const step = this.props.step;
    const buttons = { primary: 'Continue' };

    step.text = this.props.children;
    step.isFixed = true;

    step.style.footer = {
      textAlign: 'center',
      paddingBottom: '25px'
    };

    step.style.button = {
      padding: '15px 40px',
      fontWeight: 700
    };

    step.style.main = {
      paddingBottom: 0
    };

    // close hole
    step.style.hole = {
      maxWidth: 0,
      maxHeight: 0
    };

    step.style.width = 1000;
    step.style.padding = 0;

    defaultsDeep(step.style, this.props.style);
    defaultsDeep(buttons, this.props.buttons);

    return (
      <Tooltip
        {...omit(this.props, 'style', 'buttons')}
        step={step}
        buttons={buttons}
      />
    );
  }
}

export {
  ValueProp,
  ColumnContent,
  Column,
  TutorBeta,
  SuperTrainingWheel
};
