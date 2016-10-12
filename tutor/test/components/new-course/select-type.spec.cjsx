{React, sinon, shallow} = require '../helpers/component-testing'


SelectType = require '../../../src/components/new-course/select-type'


describe 'CreateCourse: Selecting course type', ->

  beforeEach ->
    @props =
      onContinue: sinon.spy()
      onCancel: sinon.spy()

  it 'it sets state when type is clicked', ->
    wrapper = shallow(<SelectType {...@props} />)
    expect(wrapper.state('selected')).to.be.null
    wrapper.find('[data-appearance="intro_sociology"]').simulate('click')
    expect(wrapper.state('selected')).to.equal('intro_sociology')
