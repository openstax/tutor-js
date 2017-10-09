import React from 'react';
import { observer } from 'mobx-react';
import { computed, action } from 'mobx';
import { without, find } from 'lodash';

import { Nav, NavItem, Popover, OverlayTrigger } from 'react-bootstrap';
import Icon from '../icon';
import CGL from '../course-grouping-label';

import Student from '../../models/course/student';
import Period from '../../models/course/period';
import { autobind } from 'core-decorators';

@observer
export default class ChangePeriodLink extends React.PureComponent {

  static propTypes = {
    period: React.PropTypes.instanceOf(Period).isRequired,
    student: React.PropTypes.instanceOf(Student).isRequired,
  }

  @action.bound
  updatePeriod(periodId) {
    const period = find(this.props.period.course.periods, { id: periodId });
    this.props.student.changePeriod(period);
  }

  @autobind
  renderPeriod(period) {
    return (
      <NavItem key={period.id} eventKey={period.id}>
        {period.name}
      </NavItem>
    );
  }

  popOverTitle() {
    if (this.props.student.api.isPending) {
      return (
        <span><Icon type="spinner" spin /> Saving…</span>
      );
    }
    return (
      <span>
        Move to <CGL courseId={this.props.period.course.id} lowercase={true} />:
      </span>
    );
  }

  @computed get course() {
    return this.props.period.course;
  }

  @computed get otherPeriods() {
    return without(this.course.activePeriods, this.props.period);
  }

  selectNewPeriod() {
    return (
      <Popover id="change-period" className="change-period" title={this.popOverTitle()}>
        <Nav stacked={true} bsStyle="pills" onSelect={this.updatePeriod}>
          {this.otherPeriods.map(this.renderPeriod)}
        </Nav>
      </Popover>
    );
  }

  render() {
    // if we have only 1 period, it's imposible to move a student
    if (!this.otherPeriods.length) { return null; }

    return (
      <OverlayTrigger
        rootClose={true}
        trigger="click"
        placement="left"
        overlay={this.selectNewPeriod()}
      >
        <a>
          <Icon type="clock-o" /> Change <CGL courseId={this.course.id} />
        </a>
      </OverlayTrigger>
    );
  }
}
