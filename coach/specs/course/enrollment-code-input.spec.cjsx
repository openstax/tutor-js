{React, Testing, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'
SnapShot = require 'react-test-renderer'

jest.mock('navigation/model')
Navigation = require 'navigation/model'

EnrollmentCodeInput = require 'course/enrollment-code-input'
Course = require 'course/model'
STATUS = require '../../auth/status/GET'

describe 'EnrollmentCodeInput Component', ->

  beforeEach ->
    @props =
      title: 'Join my Course'
      isTeacher: false
      course: new Course(ecosystem_book_uuid: 'test-uuid')
      currentCourses: _.map STATUS.courses, (c) -> new Course(c)

  it 'displays second semester message when prop is set', ->
    @props.secondSemester = true
    wrapper = shallow(<EnrollmentCodeInput {...@props} />)
    expect(wrapper.text()).to.include('A New Semester, A New Enrollment Code')
    expect(wrapper.find('.past-course')).to.have.length(1)
    expect(SnapShot.create(<EnrollmentCodeInput {...@props} />).toJSON()).toMatchSnapshot()

    undefined

  it 'model registers when submit is clicked', ->
    sinon.stub(@props.course, 'register')
    Testing.renderComponent( EnrollmentCodeInput, props: @props ).then ({dom}) =>
      dom.querySelector('input').value = 'test'
      Testing.actions.click(dom.querySelector('.btn-default'))
      expect(@props.course.register).to.have.been.calledWith('test')

  it 'model registers when enter is pressed in input', ->
    sinon.stub(@props.course, 'register')
    Testing.renderComponent( EnrollmentCodeInput, props: @props ).then ({dom}) =>
      input = dom.querySelector('input')
      input.value = 'test'
      ReactTestUtils.Simulate.keyPress(input, {key: "Enter"})
      expect(@props.course.register).to.have.been.calledWith('test')
