{expect} = require 'chai'

{CrudConfig, makeSimpleStore, extendConfig} = require '../src/flux/helpers'

CrudConfig = CrudConfig()

{actions:CrudActions, store:CrudStore} = makeSimpleStore(CrudConfig)


describe 'CRUD Store', ->
  afterEach ->
    CrudActions.reset()

  it 'should clear the store', ->
    id = 0
    expect(CrudStore.isUnknown(id)).to.be.true
    CrudActions.loaded({hello:'foo', steps:[]}, id)
    expect(CrudStore.isUnknown(id)).to.be.false
    CrudActions.reset()
    expect(CrudStore.isUnknown(id)).to.be.true


  it 'should load a task and notify', (done)->
    calledSynchronously = false
    CrudStore.addChangeListener ->
      calledSynchronously = true
      calledSynchronously and done()
    CrudActions.loaded({hello:'world', steps:[]}, 123)
    expect(CrudStore.get(123).hello).to.equal('world')


  it 'should load a task through the happy path', ->
    id = 0
    expect(CrudStore.isUnknown(id)).to.be.true
    expect(CrudStore.isLoaded(id)).to.be.false
    expect(CrudStore.isLoading(id)).to.be.false
    expect(CrudStore.isFailed(id)).to.be.false

    CrudActions.load(id)

    expect(CrudStore.isUnknown(id)).to.be.false
    expect(CrudStore.isLoaded(id)).to.be.false
    expect(CrudStore.isLoading(id)).to.be.true
    expect(CrudStore.isFailed(id)).to.be.false

    CrudActions.loaded({hello:'bar', steps:[]}, id)

    expect(CrudStore.isUnknown(id)).to.be.false
    expect(CrudStore.isLoaded(id)).to.be.true
    expect(CrudStore.isLoading(id)).to.be.false
    expect(CrudStore.isFailed(id)).to.be.false

    expect(CrudStore.get(id).hello).to.equal('bar')


  it 'should note when a load failed', ->
    id = 0
    expect(CrudStore.isUnknown(id)).to.be.true
    expect(CrudStore.isLoaded(id)).to.be.false
    expect(CrudStore.isLoading(id)).to.be.false
    expect(CrudStore.isFailed(id)).to.be.false

    CrudActions.load(id)

    expect(CrudStore.isUnknown(id)).to.be.false
    expect(CrudStore.isLoaded(id)).to.be.false
    expect(CrudStore.isLoading(id)).to.be.true
    expect(CrudStore.isFailed(id)).to.be.false

    CrudActions.FAILED(404, {err:'message'}, id)

    expect(CrudStore.isUnknown(id)).to.be.false
    expect(CrudStore.isLoaded(id)).to.be.false
    expect(CrudStore.isLoading(id)).to.be.false
    expect(CrudStore.isFailed(id)).to.be.true


  it 'should store changed attributes locally', ->
    id = 0
    CrudActions.loaded({hello:'bar'}, id)
    expect(CrudStore.isChanged(id)).to.be.false

    CrudActions._change(id, {foo: 'baz'})
    expect(CrudStore.isChanged(id)).to.be.true
    expect(CrudStore.get(id)).to.deep.equal({hello:'bar', foo:'baz'})
    expect(CrudStore.getChanged(id)).to.deep.equal({foo:'baz'})

    CrudActions._change(id, {hello: 'bam'})
    expect(CrudStore.get(id)).to.deep.equal({hello:'bam', foo:'baz'})
    expect(CrudStore.getChanged(id)).to.deep.equal({foo:'baz', hello:'bam'})


  it 'should clear changed attributes when saved', ->
    id = 0
    CrudActions.loaded({hello:'bar'}, id)
    CrudActions._change(id, {foo: 'baz'})
    CrudActions.saved({afterSave:true}, id)
    expect(CrudStore.isChanged(id)).to.be.false
    expect(CrudStore.get(id)).to.deep.equal({afterSave:true})


  it 'should clear changed attributes locally when clearChanged()', ->
    id = 0
    CrudActions.loaded({hello:'bar'}, id)
    CrudActions._change(id, {foo: 'baz'})
    CrudActions.clearChanged(id)
    expect(CrudStore.get(id)).to.deep.equal({hello:'bar'})
    expect(CrudStore.getChanged(id)).to.deep.equal({})

  it 'should be loaded when a new item is created', ->
    id = CrudStore.freshLocalId()
    CrudActions.create(id, {hello:'bar'})
    expect(CrudStore.isLoaded(id)).to.be.true
