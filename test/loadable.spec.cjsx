{expect} = require 'chai'
React = require 'react'

LoadableItem = require '../src/components/loadable-item'
{CrudConfig, makeSimpleStore, extendConfig} = require '../src/flux/helpers'

CrudConfig = CrudConfig()
{actions:CrudActions, store:CrudStore} = makeSimpleStore(CrudConfig)


TestClass = React.createClass
  getId: -> @props.id
  getFlux: ->
    store: CrudStore
    actions: CrudActions

  render: ->
    {id} = @props
    <LoadableItem
      id={id}
      store={CrudStore}
      actions={CrudActions}
      renderItem={-> <div className='test-loaded'>Loaded</div>}
    />

DIV = document.createElement('div')

delay = (fn) ->
  setTimeout(fn, 10)

describe 'Loadable Mixin', ->
  afterEach ->
    CrudActions.reset()


  it 'should work with id=0', (done) ->
    id = '0'
    expect(CrudStore.isUnknown(id)).to.be.true
    CrudActions.load.once 'trigger', (args...) ->
      done()
    React.render(<TestClass id={id}/>, DIV)


  it 'should call load when props updated', (done) ->
    id = '123'
    expect(CrudStore.isUnknown(id)).to.be.true
    CrudActions.load.once 'trigger', (myId) ->
      expect(myId).to.equal(id)
      done()
    React.render(<TestClass id={id}/>, DIV)


  it 'should reflect the state changes from loading to loaded', (done) ->
    id = '234'
    expect(CrudStore.isUnknown(id)).to.be.true
    CrudActions.load.once 'trigger', (myId) ->
      delay ->
        # Verify 'Loading...' is in the DOM
        expect(DIV.querySelector('.loading')).to.not.be.null
        CrudActions.loaded({foo:true}, myId)

    CrudActions.loaded.once 'trigger', (obj, myId) ->
      delay ->
        # Verify 'Loaded' (from renderLoaded above) is in the DOM
        expect(DIV.querySelector('.test-loaded')).to.not.be.null
        done()

    React.render(<TestClass id={id}/>, DIV)


  it 'should show an error when loading fails', (done) ->
    id = '345'
    expect(CrudStore.isUnknown(id)).to.be.true
    CrudActions.load.once 'trigger', (myId) ->
      delay ->
        # Verify 'Loading...' is in the DOM
        expect(DIV.querySelector('.loading')).to.not.be.null
        CrudActions.FAILED(400, {msg:'Some error message'}, myId)

    CrudActions.FAILED.once 'trigger', (obj, myId) ->
      delay ->
        # Verify 'Error' is in the DOM
        expect(DIV.querySelector('.error')).to.not.be.null
        done()

    React.render(<TestClass id={id}/>, DIV)
