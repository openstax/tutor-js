import moment from 'moment';
import Time from 'shared/model/time'

export default {
    create(startTime, endTime) {
        return moment(startTime).twix(endTime);
    },

    isPastDue({ due_at }) {
        return moment(Time.now).isAfter(due_at);
    },
};
