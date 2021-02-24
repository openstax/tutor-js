import PropTypes from 'prop-types';
import React from 'react';
import { map, omit, partial } from 'lodash';
import classnames from 'classnames';

class Breadcrumb extends React.Component {
  static defaultProps = {
      canReview: true,
      step: {},
  };

  static displayName = 'Breadcrumb';

  static propTypes = {
      className: PropTypes.string,
      crumb: PropTypes.object.isRequired,
      children: PropTypes.node,
      stepIndex: PropTypes.oneOfType([
          PropTypes.number, PropTypes.string,
      ]).isRequired,
      goToStep: PropTypes.func.isRequired,
      step: PropTypes.object.isRequired,
      canReview: PropTypes.bool,
      currentStep: PropTypes.number,
      onMouseEnter: PropTypes.func,
      onMouseLeave: PropTypes.func,
  };


  getState = ({ crumb, stepIndex, currentStep, step, canReview }) => {
      let isCorrect = false;
      let isIncorrect = false;
      const isCurrent = stepIndex === currentStep;
      const isCompleted = step != null ? step.is_completed : undefined;
      const isEnd = crumb.type === 'end';

      const { type } = crumb;
      const crumbType = type;

      if (isCompleted) {
          if (canReview && (step.correct_answer_id != null)) {
              if (step.is_correct) {
                  isCorrect = true;
              } else if (step.answer_id) {
                  isIncorrect = true;
              }
          }
      }

      return { isCorrect, isIncorrect, isCurrent, isCompleted, isEnd, crumbType };
  };

  state = this.getState(this.props);

  UNSAFE_componentWillReceiveProps(nextProps) {
      const nextState = this.getState(nextProps);
      return this.setState(nextState);
  }

  render() {
      let crumbClasses, status, title;
      const { step, crumb, goToStep, className, stepIndex } = this.props;
      const { isCorrect, isIncorrect, isCurrent, isCompleted, isEnd, crumbType } = this.state;

      const propsToPassOn = omit(this.props,
          'onClick', 'title', 'className', 'data-chapter', 'key', 'step',
          'goToStep', 'canReview', 'currentStep', 'stepIndex', 'crumb'
      );

      if (isCurrent) {
          title = `Current Step (${crumbType})`;
      }

      if (isCompleted) {
          if (title == null) { title = `Step Completed (${crumbType}). Click to review`; }
      }

      if (isCorrect) {
          status = <i className="icon-lg icon-correct" />;
      }

      if (isIncorrect) {
          status = <i className="icon-lg icon-incorrect" />;
      }

      if (isEnd) {
          title = `${(step.task != null ? step.task.title : undefined)} Completion`;
      }

      const classes = classnames(
          'openstax-breadcrumbs-step',
          'icon-stack',
          'icon-lg',
          step.group,
          `breadcrumb-${crumbType}`,
          className,
          {
              current: isCurrent,
              active: isCurrent,
              completed: isCompleted,
              'status-correct': isCorrect,
              'status-incorrect': isIncorrect,
          },
      );

      // build list of icon classes from the crumb type and the step labels
      if (crumb.labels != null) { crumbClasses = map(crumb.labels, label => `icon-${label}`); }
      const iconClasses = classnames(`icon-${crumbType}`, crumbClasses);

      return (
          <span
              {...propsToPassOn}
              className={classes}
              title={title}
              aria-label={title}
              onClick={partial(goToStep, stepIndex)}
              data-chapter={crumb.sectionLabel}
              key={`step-${crumb.key}`}>
              <i className={`icon-lg ${iconClasses}`} />
              {status}
          </span>
      );
  }
}

export default Breadcrumb;
