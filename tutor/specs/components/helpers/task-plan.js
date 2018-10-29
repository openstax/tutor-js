import ld from 'underscore';
import { TaskPlanActions, TaskPlanStore } from '../../../src/flux/task-plan';
import { Testing } from 'helpers';

const tomorrow = (new Date(Date.now() + (1000 * 3600 * 24))).toISOString();
const dayAfter = (new Date(Date.now() + (1000 * 3600 * 24 * 2))).toISOString();

const ExtendBasePlan = function(props, taskingProps = {}, extendTasking = true) {
  let baseModel = {
    id: '111',
    type: 'reading',
    title: 'Test Title',

    settings: {
      page_ids: ['1'],
    },
  };

  let baseTaskingPlan = {
    opens_at: tomorrow,
    due_at: dayAfter,
    target_type: 'period',
  };

  baseModel = _.extend({}, baseModel, props);

  if ((taskingProps != null) && extendTasking) {
    baseTaskingPlan = _.extend({}, baseTaskingPlan, taskingProps);

    baseModel.tasking_plans = [];
    baseModel.tasking_plans.push(baseTaskingPlan);
  }

  return baseModel;
};

const PlanRenderHelper = function(model, component, moreProps = {}, routerParams, routerQuery) {
  const { id } = model;
  // Load the plan into the store
  TaskPlanActions.loaded(model, id);
  const props = _.extend({ id, courseId: '1' }, moreProps);
  return Testing.renderComponent( component, { props, routerParams, routerQuery });
};

export { ExtendBasePlan, PlanRenderHelper };
