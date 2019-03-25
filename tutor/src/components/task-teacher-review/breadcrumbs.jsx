import PropTypes from 'prop-types';
import React from 'react';
import { map } from 'lodash';
import { idType } from 'shared';
import { observer } from 'mobx-react';
import { computed, action } from 'mobx';
import TutorBreadcrumb from '../breadcrumb';
import BackButton from '../buttons/back-button';
import { Stats } from '../../models/task-plans/teacher/stats';
import TeacherTaskPlan from '../../models/task-plans/teacher/plan';

export default
@observer
class Breadcrumbs extends React.Component {

  static propTypes = {
    taskPlan: PropTypes.instanceOf(TeacherTaskPlan).isRequired,
    stats: PropTypes.instanceOf(Stats),
    courseId: idType.isRequired,
    currentStep: PropTypes.number,
    scrollToStep: PropTypes.func.isRequired,
  };

  @action.bound goToStep(key) {
    this.props.scrollToStep(key);
  }

  @computed get crumbs() {
    if (!this.props.stats) { return []; }
    return map(this.props.stats.sections, s => ({
      type: this.props.taskPlan.type, sectionLabel: s, key: s,
    }));
  }

  render() {
    const { currentStep, courseId, taskPlan } = this.props;

    const stepButtons = map(this.crumbs, crumb =>
      <TutorBreadcrumb
        crumb={crumb}
        stepIndex={crumb.key}
        currentStep={currentStep}
        goToStep={this.goToStep}
        key={`breadcrumb-${crumb.type}-${crumb.key}`} />
    );

    const fallbackLink = {
      to: 'viewTeacherDashboard',
      params: { courseId: courseId },
      text: 'Back to Calendar',
    };

    return (
      <div className="task-breadcrumbs">
        {stepButtons}
        <BackButton fallbackLink={fallbackLink} />
        <div className="task-title">
          {taskPlan.title}
        </div>
      </div>
    );
  }

};
