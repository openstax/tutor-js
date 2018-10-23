import { expect } from 'chai';
import moment from 'moment';
import _ from 'underscore';

import { TaskActions, TaskStore } from '../src/flux/task';
import { TimeActions, TimeStore } from '../src/flux/time';

import VALID_MODEL from '../api/tasks/5.json';

describe('Task Store', function() {
  afterEach(() => TaskActions.reset());

  it('should clear the store', function() {
    const id = '0';
    expect(TaskStore.isUnknown(id)).to.be.true;
    TaskActions.loaded({ hello: 'foo', steps: [] }, id);
    expect(TaskStore.isUnknown(id)).to.be.false;
    TaskActions.reset();
    expect(TaskStore.isUnknown(id)).to.be.true;
    return undefined;
  });

  it('should load a task and notify', function(done) {
    let calledSynchronously = false;
    TaskStore.addChangeListener(function() {
      calledSynchronously = true;
      return calledSynchronously && done();
    });
    TaskActions.loaded({ hello: 'world', steps: [] }, 123);
    expect(TaskStore.get(123).hello).to.equal('world');
    return undefined;
  });

  it('should load a task through the happy path', function() {
    const id = '0';
    expect(TaskStore.isUnknown(id)).to.be.true;
    expect(TaskStore.isLoaded(id)).to.be.false;
    expect(TaskStore.isLoading(id)).to.be.false;
    expect(TaskStore.isFailed(id)).to.be.false;

    TaskActions.load(id);

    expect(TaskStore.isUnknown(id)).to.be.false;
    expect(TaskStore.isLoaded(id)).to.be.false;
    expect(TaskStore.isLoading(id)).to.be.true;
    expect(TaskStore.isFailed(id)).to.be.false;

    TaskActions.loaded({ hello: 'bar', steps: [] }, id);

    expect(TaskStore.isUnknown(id)).to.be.false;
    expect(TaskStore.isLoaded(id)).to.be.true;
    expect(TaskStore.isLoading(id)).to.be.false;
    expect(TaskStore.isFailed(id)).to.be.false;

    expect(TaskStore.get(id).hello).to.equal('bar');
    return undefined;
  });


  it('should note when a load failed', function() {
    const id = '0';
    expect(TaskStore.isUnknown(id)).to.be.true;
    expect(TaskStore.isLoaded(id)).to.be.false;
    expect(TaskStore.isLoading(id)).to.be.false;
    expect(TaskStore.isFailed(id)).to.be.false;

    TaskActions.load(id);

    expect(TaskStore.isUnknown(id)).to.be.false;
    expect(TaskStore.isLoaded(id)).to.be.false;
    expect(TaskStore.isLoading(id)).to.be.true;
    expect(TaskStore.isFailed(id)).to.be.false;

    TaskActions.FAILED(404, { err: 'message' }, id);

    expect(TaskStore.isUnknown(id)).to.be.false;
    expect(TaskStore.isLoaded(id)).to.be.false;
    expect(TaskStore.isLoading(id)).to.be.false;
    expect(TaskStore.isFailed(id)).to.be.true;
    return undefined;
  });


  return it('should be able to tell us if something is past due', function() {
    const timeNow = TimeStore.getNow();
    const pastDue = _.clone(VALID_MODEL);
    const beforeDue = _.clone(VALID_MODEL);
    pastDue.due_at = moment(timeNow).subtract(1, 'minute').format();
    beforeDue.due_at = moment(timeNow).add(1, 'hour').format();

    TaskActions.loaded(pastDue, 'past');
    TaskActions.loaded(beforeDue, 'before');

    expect(TaskStore.isTaskPastDue('past')).to.be.true;
    expect(TaskStore.isTaskPastDue('before')).to.be.false;
    return undefined;
  });
});
