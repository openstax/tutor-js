{React, sinon, shallow} = require '../helpers/component-testing'

SelectDates = require '../../../src/components/new-course/select-dates'

describe 'CreateCourse: Selecting course dates', ->

  beforeEach ->
    @props =
      onContinue: sinon.spy()
      onCancel: sinon.spy()

  it 'it sets state when date row is clicked', ->
    wrapper = shallow(<SelectDates {...@props} />)
    expect(wrapper.state('selected')).to.be.null
    wrapper.find('tr').at(0).simulate('click')
    expect(wrapper.state('selected')).to.not.be.null
