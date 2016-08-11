{expect} = require 'chai'
moment = require 'moment'
_ = require 'underscore'

{TaskActions, TaskStore} = require '../src/flux/task'
{TimeActions, TimeStore} = require '../src/flux/time'

VALID_MODEL = require '../api/tasks/5.json'

describe 'Task Store', ->
  afterEach ->
    TaskActions.reset()

  it 'should clear the store', ->
    id = '0'
    expect(TaskStore.isUnknown(id)).to.be.true
    TaskActions.loaded({hello:'foo', steps:[]}, id)
    expect(TaskStore.isUnknown(id)).to.be.false
    TaskActions.reset()
    expect(TaskStore.isUnknown(id)).to.be.true


  it 'should load a task and notify', (done) ->
    calledSynchronously = false
    TaskStore.addChangeListener ->
      calledSynchronously = true
      calledSynchronously and done()
    TaskActions.loaded({hello:'world', steps:[]}, 123)
    expect(TaskStore.get(123).hello).to.equal('world')


  it 'should load a task through the happy path', ->
    id = '0'
    expect(TaskStore.isUnknown(id)).to.be.true
    expect(TaskStore.isLoaded(id)).to.be.false
    expect(TaskStore.isLoading(id)).to.be.false
    expect(TaskStore.isFailed(id)).to.be.false

    TaskActions.load(id)

    expect(TaskStore.isUnknown(id)).to.be.false
    expect(TaskStore.isLoaded(id)).to.be.false
    expect(TaskStore.isLoading(id)).to.be.true
    expect(TaskStore.isFailed(id)).to.be.false

    TaskActions.loaded({hello:'bar', steps:[]}, id)

    expect(TaskStore.isUnknown(id)).to.be.false
    expect(TaskStore.isLoaded(id)).to.be.true
    expect(TaskStore.isLoading(id)).to.be.false
    expect(TaskStore.isFailed(id)).to.be.false

    expect(TaskStore.get(id).hello).to.equal('bar')


  it 'should note when a load failed', ->
    id = '0'
    expect(TaskStore.isUnknown(id)).to.be.true
    expect(TaskStore.isLoaded(id)).to.be.false
    expect(TaskStore.isLoading(id)).to.be.false
    expect(TaskStore.isFailed(id)).to.be.false

    TaskActions.load(id)

    expect(TaskStore.isUnknown(id)).to.be.false
    expect(TaskStore.isLoaded(id)).to.be.false
    expect(TaskStore.isLoading(id)).to.be.true
    expect(TaskStore.isFailed(id)).to.be.false

    TaskActions.FAILED(404, {err:'message'}, id)

    expect(TaskStore.isUnknown(id)).to.be.false
    expect(TaskStore.isLoaded(id)).to.be.false
    expect(TaskStore.isLoading(id)).to.be.false
    expect(TaskStore.isFailed(id)).to.be.true


  it 'should be able to tell us if something is past due', ->
    timeNow = TimeStore.getNow()
    pastDue = _.clone(VALID_MODEL)
    beforeDue = _.clone(VALID_MODEL)
    pastDue.due_at = moment(timeNow).subtract(1, 'minute').format()
    beforeDue.due_at = moment(timeNow).add(1, 'hour').format()

    TaskActions.loaded(pastDue, 'past')
    TaskActions.loaded(beforeDue, 'before')

    expect(TaskStore.isTaskPastDue('past')).to.be.true
    expect(TaskStore.isTaskPastDue('before')).to.be.false

