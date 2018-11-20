import moment from 'moment';
import _ from 'underscore';
import { TimeStore } from '../flux/time';

export default {
  create(startTime, endTime) {
    return moment(startTime).twix(endTime);
  },

  isPastDue({ due_at }) {
    return moment(TimeStore.getNow()).isAfter(due_at);
  },
};
