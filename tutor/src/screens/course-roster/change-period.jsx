import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { computed, action, modelize } from 'shared/model'
import { without, find } from 'lodash';
import { autobind } from 'core-decorators';
import { Nav, Popover, OverlayTrigger } from 'react-bootstrap';
import { Icon } from 'shared';
import CGL from '../../components/course-grouping-label';
import { CourseStudent, CoursePeriod } from '../../models'


@observer
export default
class ChangePeriodLink extends React.Component {
    static propTypes = {
        period: PropTypes.instanceOf(CoursePeriod).isRequired,
        student: PropTypes.instanceOf(CourseStudent).isRequired,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound
    updatePeriod(periodId) {
        const period = find(this.props.period.course.periods, { id: periodId });
        this.props.student.changePeriod(period);
    }

    @autobind
    renderPeriod(period) {
        return (
            <Nav.Link key={period.id} eventKey={period.id}>
                {period.name}
            </Nav.Link>
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
        return without(this.course.periods.active, this.props.period);
    }

    selectNewPeriod() {
        return (
            <Popover id="change-period" className="change-period" title={this.popOverTitle()}>
                <Popover.Content>
                    <Nav stacked={true} className="flex-column" onSelect={this.updatePeriod}>
                        {this.otherPeriods.map(this.renderPeriod)}
                    </Nav>
                </Popover.Content>
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
                    <Icon type="clock" /> Change <CGL courseId={this.course.id} />
                </a>
            </OverlayTrigger>
        );
    }
}
