{expect} = require 'chai'
_ = require 'underscore'

React = require 'react'
ReactAddons    = require('react/addons')
ReactTestUtils = React.addons.TestUtils

{LearningGuideStore, LearningGuideActions} = require '../../src/flux/learning-guide'
{LearningGuide} = require '../../src/components/learning-guide'

GUIDE_DATA = require '../../api/courses/1/guide.json'
COURSE_ID = '1' # needs to be a string, that's what LoadableItem expects


describe 'Learning Guide', ->
  beforeEach ->
    LearningGuideActions.reset()
    LearningGuideActions.loaded(GUIDE_DATA, COURSE_ID)
    component = React.createElement(LearningGuide, {courseId: COURSE_ID})
    @html = ReactTestUtils.renderIntoDocument(component)
    @dom   = @html.getDOMNode()


  it 'renders panel for each chapter', ->
    panels = @dom.querySelectorAll('.chapter-panel')
    expect(panels.length).to.equal(GUIDE_DATA.children.length)


  it 'renders all sections', ->
    sections = @dom.querySelectorAll('.section')
    items = GUIDE_DATA.children
    count = 0
    for item in items
      count += item.children.length
    expect(sections.length).to.equal(count)





