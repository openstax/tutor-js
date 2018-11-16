import moment from 'moment-timezone';
import { TaskPlanStore } from '../../flux/task-plan';
import TimeHelper from '../../helpers/time';
import { TimeStore } from '../../flux/time';
import { TaskingStore, TaskingActions } from '../../flux/tasking';
import { get } from 'lodash';
import Router from '../../helpers/router';

const getOpensAtDefault = function(termStart) {
  const now = TimeStore.getNow();
  if (termStart.isAfter(now)) {
    return termStart.format(TimeHelper.ISO_DATE_FORMAT);
  } else {
    return moment(now).add(1, 'day').format(TimeHelper.ISO_DATE_FORMAT);
  }
};

const getQueriedOpensAt = function(planId, dueAt, termStart) {
  const { opens_at } = Router.currentQuery(); // attempt to read the open date from query params
  const isNewPlan = TaskPlanStore.isNew(planId);
  let opensAt = opens_at && isNewPlan ? TimeHelper.getMomentPreserveDate(opens_at) : undefined;
  const defaultsOpenAt = getOpensAtDefault(termStart);

  if (!opensAt) {
    // default open date is tomorrow
    opensAt = defaultsOpenAt;
  }

  // if there is a current due date, make sure it's not the same as the open date
  if (dueAt != null) {
    const dueAtMoment = TimeHelper.getMomentPreserveDate(dueAt);
    // there's a corner case is certain timezones where isAfter doesn't quite cut it
    // and we need to check that the ISO strings don't match
    if (!dueAtMoment.isSameOrAfter(opensAt, 'day') || (dueAtMoment.format(TimeHelper.ISO_DATE_FORMAT) === opensAt)) {
      // move open date to the earliest it can be that's not dueAt
      const latestAllowed = moment.max(TimeStore.getNow(), moment(defaultsOpenAt));
      opensAt = moment.min(latestAllowed, dueAtMoment).format(TimeHelper.ISO_DATE_FORMAT);
    }
  }


  return opensAt;
};

const getCurrentDueAt = function(planId) {
  const { due_at } = Router.currentQuery(); // attempt to read the due date from query params
  if (due_at != null) {
    return TimeHelper.getMomentPreserveDate(due_at).format(TimeHelper.ISO_DATE_FORMAT);
  } else if (TaskingStore.hasTasking(planId)) {
    return TaskingStore.getFirstDueDate(planId);
  }
};

const getTaskPlanOpensAt = function(planId) {
  const firstDueAt = get(TaskPlanStore.get(planId), 'tasking_plans[0].due_at');
  return firstDueAt ?
      TimeHelper.getMomentPreserveDate(firstDueAt).format(TimeHelper.ISO_DATE_FORMAT) : null;
};


const setPeriodDefaults = function(course, planId, term) {
  if (!TaskingStore.hasTasking(planId)) {
    if (TaskPlanStore.isNew(planId)) {
      const due_date = getCurrentDueAt(planId) || getTaskPlanOpensAt(planId);
      TaskingActions.create(planId, { open_date: getQueriedOpensAt(planId, due_date, term.start), due_date });
    } else {
      const { tasking_plans } = TaskPlanStore.get(planId);
      TaskingActions.loadTaskings(planId, tasking_plans);
    }
  }

  const nextState = {};
  nextState.showingPeriods = !TaskingStore.getTaskingsIsAll(planId);
  return nextState;
};


const loadCourseDefaults = function(course) {
  const periods = course.periods.sorted.map(p => p.serialize());
  return TaskingActions.loadDefaults(course.id, course.defaultTimes, periods);
};


export default function(planId, course, term) {
  TaskingActions.loadTaskToCourse(planId, course.id);
  loadCourseDefaults(course);

  //set the periods defaults only after the timezone has been synced
  return setPeriodDefaults(course, planId, term);
}
