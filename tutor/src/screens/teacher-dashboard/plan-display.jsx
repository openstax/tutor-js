import PropTypes from 'prop-types';
import { React, ReactDOM, observable, observer, action, styled } from '../../helpers/react';
import { partial, camelCase } from 'lodash';
import TaskPlan from '../../models/task-plans/teacher/plan';
import Course from '../../models/course';
import TutorLink from '../../components/link';
import TaskPlanMiniEditor from '../../screens/assignment-builder/mini-editor';

const Ribbon = styled.div`
  display: flex;
  align-items: center;
`;

class CoursePlanDisplay extends React.Component {

  static propTypes = {
    plan: PropTypes.instanceOf(TaskPlan).isRequired,
    label: PropTypes.node.isRequired,
    course: PropTypes.instanceOf(Course).isRequired,
    className: PropTypes.string.isRequired,
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


}

@observer
class CoursePlanDisplayEdit extends CoursePlanDisplay {

  render() {
    const { course, plan, className, label } = this.props;

    const linkTo = camelCase(`edit-${plan.type}`);
    const params = { id: plan.id, courseId: course.id };

    return (
      <Ribbon
        className={className}
        data-plan-id={`${plan.id}`}
        data-assignment-type={plan.type}
        ref="plan"
      >
        <TutorLink to={linkTo} params={params}>
          {label}
        </TutorLink>
      </Ribbon>
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
    const { course, plan, className, label } = this.props;

    const linkTo = camelCase(`edit-${plan.type}`);
    const params = { id: plan.id, courseId: course.id };

    return (
      <Ribbon
        className={className}
        data-plan-id={`${plan.id}`}
        data-assignment-type={plan.type}
        ref="plan"
      >
        {this.isShowingEditor &&
          <TaskPlanMiniEditor
            planId={plan.id}
            courseId={course.id}
            onHide={this.onEditorHide}
            findPopOverTarget={this.getElement}
          />}
        <div onClick={this.showEditor}>
          {label}
        </div>
      </Ribbon>
    );
  }

}


@observer
class CoursePlanDisplayQuickLook extends CoursePlanDisplay {

  render() {
    const { className, label, setIsViewing, plan, hasReview } = this.props;

    return (
      <Ribbon
        className={className}
        data-plan-id={`${plan.id}`}
        data-assignment-type={plan.type}
        data-has-review={hasReview}
        onClick={partial(setIsViewing, true)}
        ref="plan"
      >
        {label}
      </Ribbon>
    );
  }
}

export { CoursePlanDisplayQuickLook, CoursePlanDisplayMiniEditor, CoursePlanDisplayEdit };
