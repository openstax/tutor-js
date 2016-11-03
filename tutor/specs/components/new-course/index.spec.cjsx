{React, _, sinon, shallow} = require '../helpers/component-testing'

NewCourse = require '../../../src/components/new-course'

describe 'NewCourse wrapper', ->

  beforeEach ->
    @props = {}

  it 'renders with loadable', ->
    wrapper = shallow(<NewCourse {...@props} />)
    expect(wrapper.find('LoadableItem')).length.to.be(1)
    undefined
