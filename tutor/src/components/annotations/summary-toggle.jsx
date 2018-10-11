import React from 'react';
import { get } from 'lodash';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import cn from 'classnames';
import Icon from '../icon';
import User from '../../models/user';
import Courses from '../../models/courses-map';
import { TaskPanelStore } from '../../flux/task-panel';
import TourRegion from '../tours/region';
import TourAnchor from '../tours/anchor';
import HighlightIcon from './highlight-icon';
import Overlay from '../obscured-page/overlay';

@observer
export default class AnnotationSummaryToggle extends React.Component {

  static propTypes = {
    courseId: React.PropTypes.string,
    type: React.PropTypes.oneOf(['reading', 'refbook']),
    taskId: React.PropTypes.string,
    taskStepIndex: React.PropTypes.any,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  @computed get isViewable() {
    if (!this.props.courseId || !get(Courses.get(this.props.courseId), 'canAnnotate')) {
      return false;
    }

    if (this.props.type === 'refbook') {
      return true;
    }
    const crumbs = TaskPanelStore.get(this.props.taskId);
    return 'reading' === get(crumbs, `[${this.props.taskStepIndex-1}].type`);
  }

  render() {
    if (!this.isViewable) { return null; }

    return (
      <TourRegion
        id="student-highlighting-reading"
        courseId={this.props.courseId}
      >
        <TourAnchor id="student-highlighting-button">
          <button
            onClick={User.annotations.ux.toggleSummary}
            className={cn('annotation-summary-toggle', { active: User.annotations.ux.isSummaryVisible})}
          >
            <HighlightIcon />
          </button>
        </TourAnchor>
      </TourRegion>
    );
  }

}
