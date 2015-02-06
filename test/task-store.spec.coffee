{expect} = require 'chai'

{TaskActions, TaskStore} = require '../src/flux/task'

describe 'Task Store', ->
  afterEach ->
    TaskActions.reset()

  it 'should clear the store', ->
    id = 0
    expect(TaskStore.isUnknown(id)).to.be.true
    TaskActions.loaded(id, {hello:'foo'})
    expect(TaskStore.isUnknown(id)).to.be.false
    TaskActions.reset()
    expect(TaskStore.isUnknown(id)).to.be.true


  it 'should load a task and notify', (done)->
    calledSynchronously = false
    TaskStore.addChangeListener ->
      calledSynchronously = true
      calledSynchronously && done()
    TaskActions.loaded(123, {hello:'world'})
    expect(TaskStore.get(123).hello).to.equal('world')


  it 'should load a task through the happy path', ->
    id = 0
    expect(TaskStore.isUnknown(id)).to.be.true
    expect(TaskStore.isLoaded(id)).to.be.false
    expect(TaskStore.isLoading(id)).to.be.false
    expect(TaskStore.isFailed(id)).to.be.false

    TaskActions.load(id)

    expect(TaskStore.isUnknown(id)).to.be.false
    expect(TaskStore.isLoaded(id)).to.be.false
    expect(TaskStore.isLoading(id)).to.be.true
    expect(TaskStore.isFailed(id)).to.be.false

    TaskActions.loaded(id, {hello:'bar'})

    expect(TaskStore.isUnknown(id)).to.be.false
    expect(TaskStore.isLoaded(id)).to.be.true
    expect(TaskStore.isLoading(id)).to.be.false
    expect(TaskStore.isFailed(id)).to.be.false

    expect(TaskStore.get(id).hello).to.equal('bar')


  it 'should note when a load failed', ->
    id = 0
    expect(TaskStore.isUnknown(id)).to.be.true
    expect(TaskStore.isLoaded(id)).to.be.false
    expect(TaskStore.isLoading(id)).to.be.false
    expect(TaskStore.isFailed(id)).to.be.false

    TaskActions.load(id)

    expect(TaskStore.isUnknown(id)).to.be.false
    expect(TaskStore.isLoaded(id)).to.be.false
    expect(TaskStore.isLoading(id)).to.be.true
    expect(TaskStore.isFailed(id)).to.be.false

    TaskActions.FAILED(id, {err:'message'})

    expect(TaskStore.isUnknown(id)).to.be.false
    expect(TaskStore.isLoaded(id)).to.be.false
    expect(TaskStore.isLoading(id)).to.be.false
    expect(TaskStore.isFailed(id)).to.be.true


  it 'should remember what was changed', (done) ->
    id = 0
    calledSynchronously = 0
    TaskStore.addChangeListener ->
      calledSynchronously += 1
      calledSynchronously == 3 && done()

    TaskActions.loaded(id, {hello:'world'})
    expect(TaskStore.get(id).hello).to.equal('world')

    # Add a new attribute
    TaskActions.edit(id, {bar:'baz'})
    expect(TaskStore.get(id)).to.deep.equal({hello:'world', bar:'baz'})
    expect(TaskStore.getUnsaved(id)).to.deep.equal({bar:'baz'})

    TaskActions.edit(id, {hello:'foo'})
    expect(TaskStore.get(id)).to.deep.equal({hello:'foo', bar:'baz'})
    expect(TaskStore.getUnsaved(id)).to.deep.equal({hello:'foo', bar:'baz'})



  it 'should reset the unsaved set when save completes', (done) ->
    id = 0
    calledSynchronously = 0
    TaskStore.addChangeListener ->
      calledSynchronously += 1
      calledSynchronously == 3 && done()

    TaskActions.loaded(id, {hello:'world'})

    # Add a new attribute
    TaskActions.edit(id, {hello:'foo'})
    TaskActions.saved(id, {hello:'baz'})

    expect(TaskStore.get(id)).to.deep.equal({hello:'baz'})
    expect(TaskStore.getUnsaved(id)).to.be.undefined



  it 'should mark the task as complete', (done) ->
    id = 0
    calledSynchronously = 0
    TaskStore.addChangeListener ->
      calledSynchronously += 1
      calledSynchronously == 2 && done()

    TaskActions.loaded(id, {hello:'world'})

    # Add a new attribute
    TaskActions.complete(id)

    expect(TaskStore.get(id).complete).to.be.true
    expect(TaskStore.getUnsaved(id).complete).to.be.true
