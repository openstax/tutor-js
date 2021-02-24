import moment from 'moment';
import Time from '../models/time';

export default {
    create(startTime, endTime) {
        return moment(startTime).twix(endTime);
    },

    isPastDue({ due_at }) {
        return moment(Time.now).isAfter(due_at);
    },
};
