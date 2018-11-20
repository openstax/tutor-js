import { C, ld } from '../../helpers/index';
import { TaskPlanActions, TaskPlanStore } from '../../../src/flux/task-plan';


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

  baseModel = ld.extend({}, baseModel, props);

  if ((taskingProps != null) && extendTasking) {
    baseTaskingPlan = ld.extend({}, baseTaskingPlan, taskingProps);

    baseModel.tasking_plans = [];
    baseModel.tasking_plans.push(baseTaskingPlan);
  }

  return baseModel;
};

const PlanRenderHelper = function(model, Component, moreProps = {}, routerParams, routerQuery) {
  const { id } = model;
  // Load the plan into the store
  TaskPlanActions.loaded(model, id);
  const props = ld.extend({ id }, moreProps);
  return mount(<C><Component {...props} /></C>);
};

export { ExtendBasePlan, PlanRenderHelper };
