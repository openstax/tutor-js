{expect} = require 'chai'
_ = require 'underscore'

React = require 'react'
ReactAddons    = require('react/addons')
ReactTestUtils = React.addons.TestUtils

{LearningGuideStore, LearningGuideActions} = require '../../src/flux/learning-guide'
{LearningGuide} = require '../../src/components/learning-guide'

GUIDE_DATA = require '../../api/courses/1/guide.json'
COURSE_ID = '1' # needs to be a string, that's what LoadableItem expects

describe 'Learning Guide Chart Widget', ->
  beforeEach ->
    LearningGuideActions.reset()
    LearningGuideActions.loaded(GUIDE_DATA, COURSE_ID)
    component = React.createElement(LearningGuide, {courseId: COURSE_ID})
    @chart = ReactTestUtils.renderIntoDocument(component)
    @dom   = @chart.getDOMNode()

  it 'renders circles for each unit', ->
    circles = @dom.querySelectorAll('.circles g')
    expect(circles.length).to.equal(GUIDE_DATA.fields.length)
    for circle,i in circles
      expect(circle.querySelector('text').textContent).to
        .equal("#{GUIDE_DATA.fields[i].questions_answered_count}")
