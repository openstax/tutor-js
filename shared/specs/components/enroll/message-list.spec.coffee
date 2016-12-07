{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'

{MessageList} = require 'shared'
Course = require '../../../../coach/src/course/model'
STATUS = require '../../../../coach/auth/status/GET'
COURSE = STATUS.courses[0]

describe 'MessageList Component', ->

  it 'displays errors from course', ->
    course = new Course(COURSE)
    course.errors = [
      {code: 'already_enrolled'}, {code: 'already_processed'}
    ]
    messages = course.errorMessages()
    Testing.renderComponent( MessageList, props: {messages} ).then ({dom}) ->
      expect(_.pluck(dom.querySelectorAll('li'), 'textContent')).to.deep.equal(
        ['You are already enrolled in this course.  Please verify the enrollment code and try again.',
         'Your enrollment in this course has been processed. Please reload the page.']
      )
