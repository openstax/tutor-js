{React, sinon, shallow} = require '../helpers/component-testing'

SelectDates = require '../../../src/components/new-course/select-dates'

{NewCourseStore} = require '../../../src/flux/new-course'

describe 'CreateCourse: Selecting course dates', ->

  it 'it sets state when date row is clicked', ->
    wrapper = shallow(<SelectDates />)
    expect(NewCourseStore.get('period')).not.to.exist
    wrapper.find('tr').at(0).simulate('click')
    expect(NewCourseStore.get('period')).to.exist
    undefined
