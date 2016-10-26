{Testing, expect, sinon, _, ReactTestUtils, ReactDOM} = require 'shared/specs/helpers'

Course = require 'course/model'

UpdateStudentIdentifier = require 'course/update-student-identifier'

describe 'UpdateStudentIdentifier Component', ->

  beforeEach ->
    @props =
      course: new Course(ecosystem_book_uuid: 'test-collection-uuid')

  xit 'submits a request when form is filled out', ->
    sinon.stub(@props.course, 'updateStudent')
    Testing.renderComponent( UpdateStudentIdentifier, props: @props ).then ({dom}) =>
      dom.querySelector('input').value = 'test value'
      Testing.actions.click(dom.querySelector('.btn'))
      expect(@props.course.updateStudent).to.have.been.calledWith(student_identifier: 'test value')

  xit 'updates when a successful response is recieved', ->
    sinon.stub(@props.course, 'updateStudent', (id) ->
      @_onStudentUpdated({data: {student_identifier: id}})
    )
    new Promise (resolve) ->
      Testing.renderComponent( UpdateStudentIdentifier, props: @props ).then (result) ->
        result.dom.querySelector('input').value = 'new id'
        Testing.actions.click(result.dom.querySelector('.btn'))
        _.defer ->
          # expect( result.dom.textContent).to.match(/You have successfully updated your student identifier/)
          resolve(@)
