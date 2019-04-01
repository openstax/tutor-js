import { React, PropTypes, observer, action, cn } from '../helpers/react';
import { map } from 'lodash';

@observer
class Breadcrumb extends React.Component {

  static propTypes = {
    step: PropTypes.object.isRequired,
    stepIndex: PropTypes.oneOfType([
      PropTypes.number, PropTypes.string,
    ]).isRequired,
    className: PropTypes.string,
    goToStep: PropTypes.func.isRequired,
    isCurrent: PropTypes.bool,
    canReview: PropTypes.bool,
    currentStep: PropTypes.number,

  };

  @action.bound goToStep() {
    this.props.goToStep(this.props.stepIndex, this.props.step);
  }

  render() {
    let crumbClasses, status, title;
    let isCorrect = false;
    let isIncorrect = false;
    const { step, canReview, isCurrent, className } = this.props;
    const isCompleted = step != null ? step.is_completed : undefined;
    const { type: crumbType } = step;
    const isEnd = 'end' === crumbType;

    if (isCompleted) {
      if (canReview && (step.correct_answer_id != null)) {
        if (step.isCorrect) {
          isCorrect = true;
        } else if (step.answer_id) {
          isIncorrect = true;
        }
      }
    }

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

    const classes = cn(
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
    if (step.labels != null) { crumbClasses = map(step.labels, label => `icon-${label}`); }
    const iconClasses = cn(`icon-${crumbType}`, crumbClasses);

    return (
      <span
        className={classes}
        title={title}
        aria-label={title}
        onClick={this.goToStep}
        data-chapter={step.sectionLabel}
        key={`step-${step.id}`}
      >
        <i className={`icon-lg ${iconClasses}`} />
        {status}
      </span>
    );
  }

}

export default Breadcrumb;
