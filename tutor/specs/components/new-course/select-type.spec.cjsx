{React, spyOnComponentMethod, pause} = require '../helpers/component-testing'
{mount} = require 'enzyme'

SelectType = require '../../../src/components/new-course/select-type'
{NewCourseStore} = require '../../../src/flux/new-course'

describe 'CreateCourse: Selecting type of course', ->

  it 'it sets state when type is clicked', ->
    spy = spyOnComponentMethod(SelectType, 'onSelectType')
    wrapper = mount(<SelectType />)
    expect(NewCourseStore.get('course_type')).not.to.exist
    wrapper.find('[data-brand="coach"]').simulate('click')
    expect(spy.calledOnce).to.be.true
    undefined
