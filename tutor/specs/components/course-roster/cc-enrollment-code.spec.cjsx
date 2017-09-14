{React, Testing, pause, sinon, _, ReactTestUtils} = require '../helpers/component-testing'

CcEnrollment = require '../../../src/components/course-settings/cc-enrollment-code'
{CourseActions} = require '../../../src/flux/course'
COURSE = require '../../../api/user/courses/1.json'
COURSE_ID = '1'

displayModal = (props) ->
  new Promise( (resolve, reject) ->
    wrapper = mount(<CcEnrollment {...props} />)
    wrapper.simulate('click')
    resolve(_.last document.querySelectorAll('.settings-cc-enrollment-code-modal'))
  )

describe 'CC enrollment instructions modal', ->
  beforeEach ->
    @props =
      courseId: COURSE_ID
      bookUrl: 'http://test.test.com'
      bookName: 'My Test Textbook'
      period: { enrollment_code: 'TEST42' }
    CourseActions.loaded(COURSE, COURSE_ID)

  it 'displays when clicked', ->
    displayModal(@props).then (dom) =>
      expect(dom.querySelector('.modal-title').textContent)
        .to.include("Send enrollment instructions")
      instructions = dom.querySelector('textarea').value
      expect(instructions).to.include(@props.bookUrl)
      expect(instructions).to.include("course enrollment code: #{@props.period.enrollment_code}")
