import { get, first, map } from 'lodash';
import moment from 'moment';
import Time from 'shared/model/time';

export default {

    calendarParams(course) {
        let date;
        const dueAtRange = course
            .teacherTaskPlans.array
            .map(plan => plan.dateRanges.due.start)
            .sort();

        if (dueAtRange.length) {
            date = dueAtRange[0];
        } else {
            date = Time.now;
        }
        return {
            to: 'calendarByDate',
            params: {
                courseId: course.id,
                date: moment(date).format('YYYY-MM-DD'),
            },
        };
    },

    earliestDueDate(plan) {
        const dates = map(get(plan, 'tasking_plans'), 'due_at');
        return first(dates.sort()) || '';
    },

};
