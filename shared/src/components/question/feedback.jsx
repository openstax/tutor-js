import React from 'react';
import classnames from 'classnames';
import { pick } from 'lodash';
import { observer } from 'mobx-react';

import ArbitraryHtmlAndMath from '../html';

const SimpleFeedback = observer((props, context) => {
  const htmlAndMathProps = pick(context, 'processHtmlAndMath');
  return (
    <aside>
      <ArbitraryHtmlAndMath
        {...htmlAndMathProps}
        className={classnames('question-feedback-content', 'has-html', props.className)}
        html={props.children}
        block={true} />
    </aside>
  );
});
SimpleFeedback.propTypes = {
  children: React.PropTypes.string.isRequired,
};
SimpleFeedback.contextTypes = {
  processHtmlAndMath: React.PropTypes.func,
};


const Feedback = observer((props, context) => {
  const wrapperClasses = classnames('question-feedback', props.position);
  const htmlAndMathProps = pick(context, 'processHtmlAndMath');
  return (
    <aside className={wrapperClasses}>
      <div className="arrow" aria-label="Answer Feedback" />
      <SimpleFeedback {...htmlAndMathProps}>
        {props.children}
      </SimpleFeedback>
    </aside>
  );
});
Feedback.propTypes = {
  children: React.PropTypes.string.isRequired,
  position: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
};
Feedback.defaultProps = { position: 'bottom' };
Feedback.contextTypes = {
  processHtmlAndMath: React.PropTypes.func,
};

export { Feedback, SimpleFeedback };
