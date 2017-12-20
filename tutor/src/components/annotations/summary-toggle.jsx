import React from 'react';
import { get } from 'lodash';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import cn from 'classnames';
import Icon from '../icon';
import User from '../../models/user';
import Courses from '../../models/courses-map';
import { TaskPanelStore } from '../../flux/task-panel';

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
      <svg
        version="1.1"
        role="button"
        viewBox="0 0 26 26"
        onClick={User.annotations.ux.toggleSummary}
        className={cn('annotation-summary-toggle', {
          active: User.annotations.ux.isSummaryVisible,
        })}
      >
        <rect x="3.6" y="21" className="i" width="7" height="1"/>
        <g>
          <path d="M23,21c0,2.8-2.2,5-5,5H5c-2.8,0-5-2.3-5-5v0c0,2.8,2.2,5,5,5h13C20.8,26,23,23.7,23,21l0-8l0,0V21z" />
          <path className="i" d="M5,26h13c2.8,0,5-2.3,5-5v-8l-1.5,1.5v6c0,2.2-1.8,4-4,4h-12c-2.2,0-4-1.8-4-4v-11c0-2.2,1.8-4,4-4h8.7L15.6,4 H5C2.2,4,0,6.3,0,9v12C0,23.7,2.2,26,5,26z"/>
        </g>
        <path className="i" d="M11.3,11.5c-0.9,0.9,0.3,1.8-0.4,2.5c-0.2,0.2-0.5,0.5-0.6,0.6c-0.4,0.4-0.4,0.7,0,1.1l1.6,1.6 c0.4,0.4,0.7,0.4,1.1,0c0.1-0.1,0.4-0.4,0.6-0.6c0.7-0.7,1.6,0.5,2.5-0.4c0.4-0.4,1.4-1.4,1.4-1.4l-4.9-4.9 C12.7,10.1,11.7,11.2,11.3,11.5z"/>
        <path className="i" d="M8.1,18c-0.4,0.4-0.2,1,0.3,1s2,0,2.2,0c0.1,0,0.3,0,0.4-0.1c0.2-0.2,0.6-0.6,0.6-0.6l-1.9-1.9 C9.8,16.4,8.5,17.6,8.1,18z"/>
        <path className="i" d="M25.6,7.1c0.4-0.5,0.4-0.8,0-1.2l-3.8-3.8c-0.4-0.4-0.7-0.4-1.2,0l-7.4,7.4l4.9,4.9L25.6,7.1z"/>
      </svg>
    );
  }

}
