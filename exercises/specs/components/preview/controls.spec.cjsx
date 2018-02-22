{React, _} = require 'shared/specs/helpers'
Location = require '../../../src/stores/location'


EXERCISE = require '../../../api/exercises/1.json'
{ExerciseActions} = require 'stores/exercise'

PreviewControls = require '../../../src/components/preview/controls'

describe 'Exercises component', ->
  props = null
  beforeEach ->
    props =
      id: '1'
      location: new Location
    sinon.stub(props.location, 'visitPreview')
    ExerciseActions.loaded(EXERCISE, props.id)

  it 'renders', ->
    wrapper = shallow(<PreviewControls {...props} />)
    expect(wrapper.find('span').text()).to.include('Viewing exercise 2@2')
    undefined

  it 'can move to next exercise', ->
    wrapper = shallow(<PreviewControls {...props} />)
    next = wrapper.find('Button[title="Go to next exercise"]')
    next.simulate('click')
    expect(next).to.have.length(1)
    expect(props.location.visitPreview).to.have.been.calledWith('3')
    undefined

  it 'can move to prev exercise', ->
    wrapper = shallow(<PreviewControls {...props} />)
    prev = wrapper.find('Button[title="Go to previous exercise"]')
    expect(prev).to.have.length(1)
    prev.simulate('click')
    expect(props.location.visitPreview).to.have.been.calledWith('1')
    undefined

  it 'can move to next version', ->
    wrapper = shallow(<PreviewControls {...props} />)
    up = wrapper.find('Button[title="Go up a version"]')
    expect(up).to.have.length(1)
    up.simulate('click')
    expect(props.location.visitPreview).to.have.been.calledWith('2@3')
    undefined

  it 'can move to prev version', ->
    wrapper = shallow(<PreviewControls {...props} />)
    down = wrapper.find('Button[title="Go down a version"]')
    expect(down).to.have.length(1)
    down.simulate('click')
    expect(props.location.visitPreview).to.have.been.calledWith('2@1')
    undefined
