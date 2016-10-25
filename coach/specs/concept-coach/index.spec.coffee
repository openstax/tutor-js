{Testing, expect, sinon, _} = require 'shared/specs/helpers'

API = require 'concept-coach'

describe 'ConceptCoach API', ->

  beforeEach ->
    @api = new API

  it 'renders views', ->
    sinon.spy @api, 'updateToView'
    @api.emit('show.view', view: 'test')
    expect(@api.updateToView).to.have.been.calledWith('test')
    undefined

  # xited becuase setProps doesn't exist
  # https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#new-deprecations-introduced-with-a-warning
  xit 'sets only allowed props on component when updated', ->
    @api.initialize document.createElement('div')
    sinon.spy @api.component, 'setProps'
    newProps = evilProp: true, moduleUUID: 'test'
    @api.update(newProps)
    expect(@api.component.setProps).to.have.been.calledWith(moduleUUID: 'test')
