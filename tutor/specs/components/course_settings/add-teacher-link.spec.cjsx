{React, Testing, sinon, _, ReactTestUtils} = require '../helpers/component-testing'
{Promise}      = require 'es6-promise'
ld = require 'lodash'

jest.mock('../../../src/helpers/clipboard')
Clipboard = require '../../../src/helpers/clipboard'

AddTeacher = require '../../../src/components/course-settings/add-teacher-link'
COURSE_ID = '1'
ROSTER = require '../../../api/courses/1/roster.json'


{RosterActions, RosterStore} = require '../../../src/flux/roster'

displayPopover = (props) ->
  new Promise( (resolve, reject) ->
    wrapper = mount(<AddTeacher {...props} />)
    wrapper.simulate('click')
    resolve(_.last document.querySelectorAll('.settings-add-instructor-modal'))
  )

describe 'Course Settings, undrop student', ->

  beforeEach ->
    Clipboard.copy.mockClear()
    @props =
      courseId: COURSE_ID
    RosterActions.loaded(ROSTER, COURSE_ID)

  it 'displays teacher join url when clicked', ->
    displayPopover(@props).then (dom) ->
      expect(dom.querySelector('input').value).to.equal(
        RosterStore.get(COURSE_ID).teach_url
      )
      expect(Clipboard.copy).toHaveBeenCalled()
