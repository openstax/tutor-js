import React from 'react';
import { map } from 'lodash';
import { observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';

import { BreadcrumbStatic } from '../breadcrumb';

import BackButton from '../buttons/back-button';
import { Stats } from '../../models/task-plan/stats';
import TeacherTaskPlan from '../../models/task-plan/teacher';

@observer
export default class Breadcrumbs extends React.PureComponent {

  static propTypes = {
    taskPlan: React.PropTypes.instanceOf(TeacherTaskPlan).isRequired,
    stats: React.PropTypes.instanceOf(Stats),
    courseId: React.PropTypes.string.isRequired,
    currentStep: React.PropTypes.number,
    scrollToStep: React.PropTypes.func.isRequired,
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
      <BreadcrumbStatic
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

}
