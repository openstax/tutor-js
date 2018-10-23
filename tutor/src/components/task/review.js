// coffeelint: disable=no_empty_functions

import PropTypes from 'prop-types';

import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _ from 'underscore';

import TaskStep from '../task-step';


class Review extends React.Component {
  static defaultProps = {
    focus: false,
    onNextStep() {},
  };

  static displayName = 'Review';

  static propTypes = {
    taskId: PropTypes.string.isRequired,
    focus: PropTypes.bool.isRequired,
  };

  render() {
    const { taskId, steps, focus } = this.props;

    const stepProps = _.omit(this.props, 'steps', 'focus');

    const stepsList = _.chain(steps)
      .uniq(false, function(step) {
        if (step.is_in_multipart && (step.content_url != null)) {
          return step.content_url;
        } else {
          return step.id;
        }
      }).map((step, index) =>
        <TaskStep
          {...stepProps}
          id={step.id}
          key={`task-review-${step.id}`}
          focus={true}
          on={true}
          first={true}
          problem={true}
          focus={focus && (index === 0)}
          pinned={false} />).value();

    return (
      <ReactCSSTransitionGroup
        transitionName="homework-review-problem"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        {stepsList}
      </ReactCSSTransitionGroup>
    );
  }
}

export default Review;
