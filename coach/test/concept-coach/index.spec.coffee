{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

API = require 'concept-coach'

describe 'ConceptCoach API', ->

  beforeEach ->
    @api = new API

  it 'renders views', ->
    sinon.spy @api, 'updateToView'
    @api.emit('show.view', view: 'test')
    expect(@api.updateToView).to.have.been.calledWith('test')

  it 'sets only allowed props on component when updated', ->
    @api.initialize document.createElement('div')
    sinon.spy @api.component, 'setProps'
    newProps = evilProp: true, moduleUUID: 'test'
    @api.update(newProps)
    expect(@api.component.setProps).to.have.been.calledWith(moduleUUID: 'test')
