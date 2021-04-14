import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';
import { Course } from '../../models';
import EmptyCard from './empty-panel';
import EventsCard from './events-panel';
import { map } from 'lodash';
import StatusLegend from './status-legend';

@observer
export default
class AllEventsByWeek extends React.Component {

    static propTypes = {
        course: PropTypes.instanceOf(Course).isRequired,
    }

    @autobind
    renderWeek(tasks, week) {
        const startAt = moment(week, 'YYYYww');
        return (
            <EventsCard
                key={week}
                className="-weeks-events"
                course={this.props.course}
                events={tasks}
                startAt={startAt}
                endAt={startAt.clone().add(1, 'week')} />
        );
    }

    render() {
        const { course, course: { studentTaskPlans } } = this.props;
        const weeks = studentTaskPlans.pastTasksByWeek;

        return (
            <div>
                <EmptyCard course={course} message="No past assignments" tasks={weeks} />
                {map(weeks, this.renderWeek)}
                <StatusLegend tasks={weeks} />
            </div>
        );
    }
}
