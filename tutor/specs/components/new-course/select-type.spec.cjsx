{React, spyOnComponentMethod, SnapShot} = require '../helpers/component-testing'

SelectType = require '../../../src/components/new-course/select-type'
{NewCourseStore} = require '../../../src/flux/new-course'

describe 'CreateCourse: Selecting type of course', ->

  it 'it sets state when type is clicked', ->
    spy = spyOnComponentMethod(SelectType, 'onSelectType')
    wrapper = mount(<SelectType />)
    expect(NewCourseStore.get('course_type')).to.exist
    wrapper.find('[data-brand="coach"]').simulate('click')
    expect(spy.calledOnce).to.be.true
    undefined

  it 'matches snapshot', ->
    component = SnapShot.create(
      <SelectType />
    )
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
