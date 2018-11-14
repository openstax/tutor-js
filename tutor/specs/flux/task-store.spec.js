import moment from 'moment';
import ld from 'lodash';

import { TaskActions, TaskStore } from '../../src/flux/task';
import { TimeActions, TimeStore } from '../../src/flux/time';

import VALID_MODEL from '../../api/tasks/5.json';

describe('Task Store', function() {
  afterEach(() => TaskActions.reset());

  it('should clear the store', function() {
    const id = '0';
    expect(TaskStore.isUnknown(id)).toBe(true);
    TaskActions.loaded({ hello: 'foo', steps: [] }, id);
    expect(TaskStore.isUnknown(id)).toBe(false);
    TaskActions.reset();
    expect(TaskStore.isUnknown(id)).toBe(true);
    return undefined;
  });

  it('should load a task and notify', function(done) {
    let calledSynchronously = false;
    TaskStore.addChangeListener(function() {
      calledSynchronously = true;
      return calledSynchronously && done();
    });
    TaskActions.loaded({ hello: 'world', steps: [] }, 123);
    expect(TaskStore.get(123).hello).toEqual('world');
    return undefined;
  });

  it('should load a task through the happy path', function() {
    const id = '0';
    expect(TaskStore.isUnknown(id)).toBe(true);
    expect(TaskStore.isLoaded(id)).toBe(false);
    expect(TaskStore.isLoading(id)).toBe(false);
    expect(TaskStore.isFailed(id)).toBe(false);

    TaskActions.load(id);

    expect(TaskStore.isUnknown(id)).toBe(false);
    expect(TaskStore.isLoaded(id)).toBe(false);
    expect(TaskStore.isLoading(id)).toBe(true);
    expect(TaskStore.isFailed(id)).toBe(false);

    TaskActions.loaded({ hello: 'bar', steps: [] }, id);

    expect(TaskStore.isUnknown(id)).toBe(false);
    expect(TaskStore.isLoaded(id)).toBe(true);
    expect(TaskStore.isLoading(id)).toBe(false);
    expect(TaskStore.isFailed(id)).toBe(false);

    expect(TaskStore.get(id).hello).toEqual('bar');
    return undefined;
  });


  it('should note when a load failed', function() {
    const id = '0';
    expect(TaskStore.isUnknown(id)).toBe(true);
    expect(TaskStore.isLoaded(id)).toBe(false);
    expect(TaskStore.isLoading(id)).toBe(false);
    expect(TaskStore.isFailed(id)).toBe(false);

    TaskActions.load(id);

    expect(TaskStore.isUnknown(id)).toBe(false);
    expect(TaskStore.isLoaded(id)).toBe(false);
    expect(TaskStore.isLoading(id)).toBe(true);
    expect(TaskStore.isFailed(id)).toBe(false);

    TaskActions.FAILED(404, { err: 'message' }, id);

    expect(TaskStore.isUnknown(id)).toBe(false);
    expect(TaskStore.isLoaded(id)).toBe(false);
    expect(TaskStore.isLoading(id)).toBe(false);
    expect(TaskStore.isFailed(id)).toBe(true);
    return undefined;
  });


  return it('should be able to tell us if something is past due', function() {
    const timeNow = TimeStore.getNow();
    const pastDue = ld.clone(VALID_MODEL);
    const beforeDue = ld.clone(VALID_MODEL);
    pastDue.due_at = moment(timeNow).subtract(1, 'minute').format();
    beforeDue.due_at = moment(timeNow).add(1, 'hour').format();

    TaskActions.loaded(pastDue, 'past');
    TaskActions.loaded(beforeDue, 'before');

    expect(TaskStore.isTaskPastDue('past')).toBe(true);
    expect(TaskStore.isTaskPastDue('before')).toBe(false);
    return undefined;
  });
});
