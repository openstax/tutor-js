import React from 'react';
import { action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { Popover, OverlayTrigger } from 'react-bootstrap';

//import BindStoreMixin from '../bind-store-mixin';
// import { CourseStore, CourseActions } from '../../flux/course';
// import { RosterStore, RosterActions } from '../../flux/roster';
import Router from '../../helpers/router';

import Icon from '../icon';
import Name from '../name';
import { AsyncButton } from 'shared';

const WARN_REMOVE_CURRENT = 'If you remove yourself from the course you will be redirected to the dashboard.';

import Course from '../../models/course';
import Teacher from '../../models/course/teacher';

@observer
export default class RemoveTeacherLink extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course).isRequired,
    teacher: React.PropTypes.instanceOf(Teacher).isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  @computed get isSelfRemoval() {
    return this.props.course.primaryRole.id === this.props.teacher.role_id;
  }

  @action.bound goToDashboard() {
    this.context.router.history.push(Router.makePathname('myCourses'));
  }

  @action.bound performDeletion() {
    const request = this.props.teacher.drop();
    if (this.isSelfRemoval) {
      request.then(this.goToDashboard);
    }
  }

  confirmPopOver() {
    return (
      <Popover
        id={`settings-remove-popover-${this.props.teacher.id}`}
        className="settings-remove-teacher"
        title={<span>Remove <Name {...this.props.teacher} />?</span>}
      >
        <AsyncButton
          bsStyle="danger"
          onClick={this.performDeletion}
          isWaiting={this.props.teacher.hasApiRequestPending}
          waitingText="Removing..."
        >
          <Icon type="ban" /> Remove
        </AsyncButton>

        <div className="warning">
          {this.isSelfRemoval ? WARN_REMOVE_CURRENT : undefined}
        </div>
      </Popover>
    );
  }

  render() {
    return (
      <OverlayTrigger
        rootClose={true}
        trigger="click"
        placement="left"
        overlay={this.confirmPopOver()}>
        <a>
          <Icon type="ban" />
          {' Remove'}
        </a>
      </OverlayTrigger>
    );
  }

}
