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


  it 'should load a task and notify', ->
    calledSynchronously = false
    TaskStore.addChangeListener ->
      calledSynchronously = true
    TaskActions.loaded(123, {hello:'world'})
    expect(TaskStore.get(123).hello).to.equal('world')
    expect(calledSynchronously).to.equal(true)


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


  it 'should remember what was changed', ->
    id = 0
    calledSynchronously = 0
    TaskStore.addChangeListener ->
      calledSynchronously += 1

    TaskActions.loaded(id, {hello:'world'})
    expect(TaskStore.get(id).hello).to.equal('world')

    # Add a new attribute
    TaskActions.edit(id, {bar:'baz'})
    expect(TaskStore.get(id)).to.deep.equal({hello:'world', bar:'baz'})
    expect(TaskStore.getUnsaved(id)).to.deep.equal({bar:'baz'})

    TaskActions.edit(id, {hello:'foo'})
    expect(TaskStore.get(id)).to.deep.equal({hello:'foo', bar:'baz'})
    expect(TaskStore.getUnsaved(id)).to.deep.equal({hello:'foo', bar:'baz'})

    expect(calledSynchronously).to.equal(3)


  it 'should reset the unsaved set when save completes', ->
    id = 0
    calledSynchronously = 0
    TaskStore.addChangeListener ->
      calledSynchronously += 1

    TaskActions.loaded(id, {hello:'world'})

    # Add a new attribute
    TaskActions.edit(id, {hello:'foo'})
    TaskActions.saved(id, {hello:'baz'})

    expect(TaskStore.get(id)).to.deep.equal({hello:'baz'})
    expect(TaskStore.getUnsaved(id)).to.be.undefined

    expect(calledSynchronously).to.equal(3)


  it 'should mark the task as complete', ->
    id = 0
    calledSynchronously = 0
    TaskStore.addChangeListener ->
      calledSynchronously += 1

    TaskActions.loaded(id, {hello:'world'})

    # Add a new attribute
    TaskActions.complete(id)

    expect(TaskStore.get(id).complete).to.be.true
    expect(TaskStore.getUnsaved(id).complete).to.be.true

    expect(calledSynchronously).to.equal(2)
