import { TaskPlanStore } from '../flux/task-plan';
import { isEmpty, get, pick, first, every, reduce, map } from 'lodash';

export default {

  // returns the opens_at and due_at dates combined if they're identical,
  // separated by target_id if not
  dates(plan, options) {
    if (options == null) { options = {}; }
    if (isEmpty( get(plan, 'tasking_plans' ))) { return {}; }
    const pickFn = options.only ? tp => pick(tp, options.only) : tp => pick(tp, 'opens_at', 'due_at');

    const firstTasking = first( plan.tasking_plans );
    const isIdentical = every(plan.tasking_plans, function(tp) {
      if (options.only != null) {
        return tp[options.only] === firstTasking[options.only];
      } else {
        return (tp.opens_at === firstTasking.opens_at) && (tp.due_at === firstTasking.due_at);
      }
    });
    if (isIdentical) {
      return { all: pickFn(firstTasking) };
    } else {
      return reduce( plan.tasking_plans, function(memo, tp) {
        memo[tp.target_id] = pickFn(tp);
        return memo;
      }
      , {});
    }
  },


  earliestDueDate(plan) {
    const dates = map(get(plan, 'tasking_plans'), 'due_at');
    return first(dates.sort()) || '';
  },


  apiEndpointOptions(id, courseId) {
    const task = TaskPlanStore.get(id);
    const options = TaskPlanStore.isNew(id) ? {
      url: `courses/${courseId}/plans`,
      method: 'POST',
    } : {
      url: `plans/${id}`,
    };
    if (get(task, 'ecosystem_id')) {
      options.params = { ecosystem_id: task.ecosystem_id };
    }
    return options;
  },

};
