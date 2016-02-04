{Testing, expect, sinon, _, ReactTestUtils} = require 'openstax-react-components/test/helpers'

Course = require 'course/model'

UpdateStudentIdentifier = require 'course/update-student-identifier'

describe 'UpdateStudentIdentifier Component', ->

  beforeEach ->
    @props =
      course: new Course(ecosystem_book_uuid: 'test-collection-uuid')

  it 'submits a request when form is filled out', ->
    sinon.stub(@props.course, 'updateStudent')
    Testing.renderComponent( UpdateStudentIdentifier, props: @props ).then ({dom}) =>
      dom.querySelector('input').value = 'test value'
      Testing.actions.click(dom.querySelector('.btn-default'))
      expect(@props.course.updateStudent).to.have.been.calledWith(student_identifier: 'test value')

  it 'updates when a successful response is recieved',  (done) ->
    sinon.stub(@props.course, 'updateStudent', (id) ->
      @_onStudentUpdated({data: {student_identifier: id}})
    )
    Testing.renderComponent( UpdateStudentIdentifier, props: @props ).then ({element, dom}) ->
      dom.querySelector('input').value = 'new id'
      Testing.actions.click(dom.querySelector('.btn-default'))
      _.defer ->
        expect(element.getDOMNode().textContent).to.match(/You have successfully updated your student identifier/)
        done()
