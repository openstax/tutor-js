import React from 'react';
import { get } from 'lodash';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import Icon from '../icon';
import User from '../../models/user';
import Courses from '../../models/courses-map';
import Router from '../../helpers/router';
import { TaskPanelStore } from '../../flux/task-panel';

@observer
export default class AnnotationSummaryToggle extends React.Component {

  static propTypes = {
    windowImpl: React.PropTypes.shape({
      location: React.PropTypes.shape({
        pathname: React.PropTypes.string,
      }),
    }),
    courseId: React.PropTypes.string,
    type: React.PropTypes.oneOf(['reading', 'refbook']),
    taskId: React.PropTypes.string,
    taskStepIndex: React.PropTypes.any,
  }

  static defaultProps = {
    windowImpl: window,
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
      <div className="annotation-summary-toggle">
        <Icon
          type="pencil-square-o"
          onClick={User.annotations.ux.toggleSummary}
        />
      </div>
    );
  }

}
