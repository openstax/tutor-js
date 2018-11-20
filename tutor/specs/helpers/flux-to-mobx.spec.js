import { autorun } from 'mobx';
import fluxToMobx from '../../src/helpers/flux-to-mobx';
import { TaskPlanStore, TaskPlanActions } from '../../src/flux/task-plan';
jest.mock('../../src/flux/task-plan');

const ID = '_CREATING_F2MBX';

describe('FluxToMobx', () => {

  const exCount = fluxToMobx(
    TaskPlanStore,
    () => TaskPlanStore.exerciseCount(ID)
  );

  beforeEach(() => {
    TaskPlanActions.create(ID);
  });

  afterEach(() => {
    //    TaskPlanActions.removeUnsavedDraftPlan(ID);
  });

  it('doesnt update until observed', () => {
    expect(TaskPlanStore.on).not.toHaveBeenCalled();

    const updateSpy = jest.fn(() => {
      // called everytime the database updates its records
      exCount.current()
      // console.log();
    });
    const unListen = autorun(updateSpy);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(TaskPlanStore.on).toHaveBeenCalledTimes(1);
    expect(TaskPlanStore.off).not.toHaveBeenCalled();
    unListen();
    expect(TaskPlanStore.off).toHaveBeenCalled();
  });

});
