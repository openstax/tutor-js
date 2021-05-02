import PropTypes from 'prop-types';
import React from 'react';
import { idType } from 'shared';
import { observer } from 'mobx-react';
import { observable, computed, action, modelize } from 'shared/model'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { isNil, map } from 'lodash';
import classnames from 'classnames';
import { Course, currentCourses } from '../models';
import Tabs from './tabs';

@observer
export default
class CoursePeriodsNav extends React.Component {
    static propTypes = {
        courseId: idType,
        course: PropTypes.instanceOf(Course),
        handleSelect: PropTypes.func,
        selectedIndex: PropTypes.number.isRequired,
        afterTabsItem: PropTypes.element,
        className: PropTypes.string,
    }

    static defaultProps = {
        selectedIndex: 0,
        sortedPeriods: [],
    }

    @observable tabIndex = this.props.selectedIndex;

    constructor(props) {
        super(props);
        modelize(this);
    }

    @computed get course() {
        return this.props.course || currentCourses.get(this.props.courseId);
    }

    @computed get sortedPeriods() {
        return this.course.periods.sorted;
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
            <div className={className} data-test-id="period-tab">
                <OverlayTrigger placement="top" delayShow={1000} delayHide={0} overlay={tooltip}>
                    <span className="tab-item-period-name">
                        {period.name}
                    </span>
                </OverlayTrigger>
            </div>
        );
    }

    render() {
        const { className } = this.props;
        return (
            <Tabs
                tabs={map(this.sortedPeriods, this.renderPeriod)}
                onSelect={this.onTabSelection}
                className={className}
            >
                {this.props.afterTabsItem}
            </Tabs>
        );
    }
}
