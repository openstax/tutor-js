import PropTypes from 'prop-types';
import { React, ReactDOM, observable, observer, action } from '../../helpers/react';
import { partial, camelCase } from 'lodash';
import TaskPlan from '../../models/task-plan/teacher';
import Course from '../../models/course';
import TutorLink from '../../components/link';
import TaskPlanMiniEditor from '../../components/task-plan/mini-editor';

class CoursePlanDisplay extends React.Component {

  static propTypes = {
    plan: PropTypes.instanceOf(TaskPlan).isRequired,
    display: PropTypes.shape({
      offset: PropTypes.number.isRequired,
      order: PropTypes.number.isRequired,
      weekTopOffset: PropTypes.number.isRequired,
    }).isRequired,
    label: PropTypes.node.isRequired,
    course: PropTypes.instanceOf(Course).isRequired,
    planClasses: PropTypes.string.isRequired,
    setHover: PropTypes.func.isRequired,
    hasReview: PropTypes.bool,
    isFirst: PropTypes.bool,
    isLast: PropTypes.bool,
    setIsViewing: PropTypes.func,
    spacingMargin: PropTypes.number,
  };

  static defaultProps = {
    hasReview: false,
    isFirst: false,
    isLast: false,
    spacingMargin: 2,
    rangeLength: 7,
    defaultPlansCount: 3,
  };

  calcPercentOfRangeLength(partLength) {
    return (
      ((partLength / this.props.rangeLength) * 100) + '%'
    );
  }

  adjustPlanSpacing(planStyle) {
    const { isFirst, isLast, spacingMargin } = this.props;

    if (isFirst || isLast) {
      planStyle.width = `calc(${planStyle.width} - ${spacingMargin * 3}px)`;
    }

    if (isFirst) {
      planStyle.marginLeft = spacingMargin + 'px';
    }

    if (!isFirst && !isLast) {
      planStyle.marginLeft = (-1 * spacingMargin) + 'px';
    }

    return (

      planStyle

    );
  }

  buildPlanStyles() {
    const { display, plan, spacingMargin, defaultPlansCount } = this.props;
    const { offset, weekTopOffset, order } = display;
    const { durationLength } = plan;

    // Adjust width based on plan duration and left position based on offset of plan from start of week
    // CALENDAR_EVENT_DYNAMIC_WIDTH and CALENDAR_EVENT_DYNAMIC_POSITION
    // top is calculated by using:
    //   weekTopOffset -- the distance from the top of the calendar for plans in the same week
    //   order -- the order the plan should be from the bottom, is an int more than 1 when a plan needs to
    //       stack on top of other plans that overlap in duration.
    const planStyle = {
      width: this.calcPercentOfRangeLength(durationLength),
      left: this.calcPercentOfRangeLength(offset),
      top: ((weekTopOffset + (spacingMargin * 2)) - (order * defaultPlansCount)) + 'rem',
    };

    return (

      this.adjustPlanSpacing(planStyle)

    );
  }

}

@observer
class CoursePlanDisplayEdit extends CoursePlanDisplay {

  render() {
    const { course, plan, planClasses, label, setHover } = this.props;

    const linkTo = camelCase(`edit-${plan.type}`);
    const params = { id: plan.id, courseId: course.id };

    const planStyle = this.buildPlanStyles();

    return (
      <div
        style={planStyle}
        className={planClasses}
        data-plan-id={`${plan.id}`}
        data-assignment-type={plan.type}
        onMouseEnter={partial(setHover, true)}
        onMouseLeave={partial(setHover, false)}
        ref="plan">
        <TutorLink to={linkTo} params={params}>
          {label}
        </TutorLink>
      </div>
    );
  }

}


@observer
class CoursePlanDisplayMiniEditor extends CoursePlanDisplay {

  @observable isShowingEditor = false;

  getElement() {
    return (
      ReactDOM.findDOMNode(this)
    );
  }

  @action.bound showEditor() {
    this.isShowingEditor = true;
  }

  @action.bound onEditorHide() {
    this.isShowingEditor = false;
  }

  render() {
    const { course, plan, planClasses, label, setHover } = this.props;

    const linkTo = camelCase(`edit-${plan.type}`);
    const params = { id: plan.id, courseId: course.id };

    const planStyle = this.buildPlanStyles();

    return (
      <div
        style={planStyle}
        className={planClasses}
        data-plan-id={`${plan.id}`}
        data-assignment-type={plan.type}
        onMouseEnter={partial(setHover, true)}
        onMouseLeave={partial(setHover, false)}
        ref="plan"
      >
        {this.isShowingEditor && (
           <TaskPlanMiniEditor
             planId={plan.id}
             courseId={course.id}
             onHide={this.onEditorHide}
             findPopOverTarget={this.getElement}
           />)}
        <div onClick={this.showEditor}>
          {label}
        </div>
      </div>
    );
  }

}


@observer
class CoursePlanDisplayQuickLook extends CoursePlanDisplay {

  render() {
    const { planClasses, planModal, label, setHover, setIsViewing, plan, hasReview } = this.props;

    const planStyle = this.buildPlanStyles();

    return (
      <div
        style={planStyle}
        className={planClasses}
        data-plan-id={`${plan.id}`}
        data-assignment-type={plan.type}
        data-has-review={hasReview}
        onMouseEnter={partial(setHover, true)}
        onMouseLeave={partial(setHover, false)}
        onClick={partial(setIsViewing, true)}
        ref="plan"
      >
        {label}
      </div>
    );
  }
}

export { CoursePlanDisplayQuickLook, CoursePlanDisplayMiniEditor, CoursePlanDisplayEdit };
