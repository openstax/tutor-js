{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'

{ErrorList} = require 'shared'
Course = require '../../../../coach/src/course/model'
STATUS = require '../../../../coach/auth/status/GET'
COURSE = STATUS.courses[0]

describe 'ErrorList Component', ->

  it 'displays errors from course', ->
    course = new Course(COURSE)
    course.errors = [
      {code: 'already_enrolled'}, {code: 'already_processed'}
    ]
    errorMessages = course.errorMessages()
    Testing.renderComponent( ErrorList, props: {errorMessages} ).then ({dom}) ->
      expect(_.pluck(dom.querySelectorAll('li'), 'textContent')).to.deep.equal(
        ['You are already enrolled in this course.  Please verify the enrollment code and try again.',
         'Your enrollment in this course has been processed. Please reload the page.']
      )
