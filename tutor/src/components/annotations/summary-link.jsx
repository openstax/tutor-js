import React from 'react';
import { get } from 'lodash';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import Icon from '../icon';
import User from '../../models/user';
import Courses from '../../models/courses-map';
import Router from '../../helpers/router';
import { TaskStore } from '../../flux/task';

@observer
export default class AnnotationSummaryToggle extends React.Component {

  static propTypes = {
    windowImpl: React.PropTypes.shape({
      location: React.PropTypes.shape({
        pathname: React.PropTypes.string,
      }),
    }),
    courseId: React.PropTypes.string.isRequired,
    type: React.PropTypes.oneOf(['reading', 'refbook']),
    // params: React.PropTypes.shape({
    //   courseId: React.PropTypes.string,
    // }),
    taskId: React.PropTypes.string,
    taskStepIndex: React.PropTypes.number,
  }

  static defaultProps = {
    windowImpl: window,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  @action.bound onClick() {

    this.context.router.history.push(
      Router.makePathname('annotations', {
        courseId: this.props.courseId,
        chapter: this.chapter_section.firstjoin('.'),
      })
    );
  }

  @computed get chapter_section() {

    if (this.props.type === 'reading') {
      return get(
        TaskStore.getStepByIndex(
          this.props.taskId, this.props.taskStepIndex
        ), 'related_content[0].chapter_section');
    }
    return null;
  }

  render() {

    console.log(this.props)
    console.log(TaskStore.getStepByIndex(this.props.taskId, this.props.taskStepIndex));

    // TODO: Also check we're on hypothesis bio content?
    if (!this.chapter_section) { return null; }


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
