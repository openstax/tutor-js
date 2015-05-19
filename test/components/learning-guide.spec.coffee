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
    @chart = ReactTestUtils.renderIntoDocument(component)
    @dom   = @chart.getDOMNode()

  it 'renders chart svg and footer', ->
    svg = @dom.querySelectorAll('svg')
    footer = @dom.querySelectorAll('.footer')
    expect(svg.length).to.equal(1)
    expect(footer.length).to.equal(1)


  it 'renders circles for each unit', ->
    circles = @dom.querySelectorAll('.circles g')
    expect(circles.length).to.equal(GUIDE_DATA.children.length)

  it 'renders corresponding x-axis for each unit', ->
    axisPoints = @dom.querySelectorAll('.x-axis .point')
    expect(axisPoints.length).to.equal(GUIDE_DATA.children.length)

    if GUIDE_DATA.children[0].chapter_section instanceof Array
      for point, i in axisPoints
        expect(point.querySelector('.x-axis-label').textContent).to
          .equal("#{GUIDE_DATA.children[i].chapter_section[0]}")
    else
      for point, i in axisPoints
        expect(point.querySelector('.x-axis-label').textContent).to
          .equal("#{GUIDE_DATA.children[i].chapter_section}")

  it 'all image tags have defined path', ->
    images = @dom.querySelectorAll('image')
    for image, i in images
      expect(image.href.baseVal.length > 0)


  it 'renders circles for each chapter', ->
    chapterButton = React.addons.TestUtils.findRenderedDOMComponentWithClass(@chart, 'chapter-button')
    React.addons.TestUtils.Simulate.click(chapterButton)
    if @chart.state.showAll is false
      circles = @dom.querySelectorAll('.circles g')
      expect(circles.length).to.equal(GUIDE_DATA.children[0].children.length)

  it 'renders corresponding x-axis for each chapter', ->
    chapterButton = React.addons.TestUtils.findRenderedDOMComponentWithClass(@chart, 'chapter-button')
    React.addons.TestUtils.Simulate.click(chapterButton)
    if @chart.state.showAll is false
      axisPoints = @dom.querySelectorAll('.x-axis .point')
      expect(axisPoints.length).to.equal(GUIDE_DATA.children[0].children.length)
      sectionType = GUIDE_DATA.children[0].children[0].chapter_section

      if sectionType instanceof Array
        for point, i in axisPoints
          unit = GUIDE_DATA.children[0].children[i].chapter_section[0]
          chapter = GUIDE_DATA.children[0].children[i].chapter_section[1]
          expect(point.querySelector('.x-axis-label').textContent).to
            .equal("#{unit + '.' + chapter}")
      else
        for point, i in axisPoints
          expect(point.querySelector('.x-axis-label').textContent).to
            .equal("#{GUIDE_DATA.children[0].children[i].chapter_section}")



