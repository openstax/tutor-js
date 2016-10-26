{React, sinon, shallow} = require '../helpers/component-testing'

SelectCourse = require '../../../src/components/new-course/select-course'

{NewCourseStore} = require '../../../src/flux/new-course'

describe 'CreateCourse: Selecting course subject', ->

  it 'it sets code when clicked', ->
    wrapper = shallow(<SelectCourse />)
    expect(NewCourseStore.get('course_code')).not.to.exist
    wrapper.find('tr').at(0).simulate('click')
    expect(NewCourseStore.get('course_code')).to.exist
    undefined
