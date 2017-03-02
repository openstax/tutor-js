{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'

React = require 'react'

{MessageList} = require 'shared'

describe 'MessageList Component', ->

  it 'displays error messages from a course', ->
    messages = [
      'You are already enrolled in this course.  Please verify the enrollment code and try again.',
      'Your enrollment in this course has been processed. Please reload the page.'
    ]
    wrapper = shallow(<MessageList messages={messages} />)
    expect(wrapper.find('li').map((node) -> node.text())).to.deep.equal(
      ['You are already enrolled in this course.  Please verify the enrollment code and try again.',
       'Your enrollment in this course has been processed. Please reload the page.']
    )
    undefined
