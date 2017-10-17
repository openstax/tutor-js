import React from 'react';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { isNil, map } from 'lodash';
import classnames from 'classnames';

import Courses from '../models/courses-map';
import PeriodHelper from '../helpers/period';
import Tabs from './tabs';

@observer
export default class CoursePeriodsNav extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    handleSelect: React.PropTypes.func,
    initialActive: React.PropTypes.number.isRequired,
    afterTabsItem: React.PropTypes.element,
  }

  static defaultProps = {
    initialActive: 0,
    sortedPeriods: [],
  }

  @observable tabIndex = this.props.initialActive;

  @computed get sortedPeriods() {
    return PeriodHelper.sort(
      Courses.get(this.props.courseId).periods.active
    );
  }

  @action.bound onTabSelection(tabIndex, ev) {
    if (this.tabIndex === tabIndex) { return; }

    const { handleSelect } = this.props;
    const period = this.sortedPeriods[tabIndex];
    if (isNil(period)) {
      ev.preventDefault();
      return;
    }
    this.tabIndex = tabIndex;
    if (handleSelect) { handleSelect(period, tabIndex); }
  }

  renderPeriod(period, key) {
    const className = classnames({ 'is-trouble': period.is_trouble });
    const tooltip =
      <Tooltip id={`course-periods-nav-tab-${key}`}>
        {period.name}
      </Tooltip>;

    return (
      <div className={className}>
        <OverlayTrigger placement="top" delayShow={1000} delayHide={0} overlay={tooltip}>
          <span className="tab-item-period-name">
            {period.name}
          </span>
        </OverlayTrigger>
      </div>
    );
  }

  render() {
    return (
      <Tabs
        ref="tabs"
        tabs={map(this.sortedPeriods, this.renderPeriod)}
        onSelect={this.onTabSelection}
      >
        {this.props.afterTabsItem}
      </Tabs>
    );
  }
}
