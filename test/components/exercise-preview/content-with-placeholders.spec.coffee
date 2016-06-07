{Testing, expect, sinon, _, React, ReactTestUtils} = require 'test/helpers'
ld = require 'lodash'

ContentWithPlaceholders = require 'src/components/exercise-preview/content-with-placeholders'

Video = require '../../../src/components/exercise-preview/video-placeholder'
Interactive = require '../../../src/components/exercise-preview/interactive-placeholder'

EXERCISE = require '../../../stubs/exercise-preview/data'
ANSWERS  = EXERCISE.content.questions[0].answers

describe 'Exercise Content placeholder content', ->

  beforeEach ->
    @props =
      content: _.clone(EXERCISE.preview)
      className: 'content'


  it 'renders video placeholder', ->
    Testing.renderComponent( ContentWithPlaceholders, props: @props ).then ({dom, element}) ->
      expect( ReactTestUtils.scryRenderedComponentsWithType(Interactive) ).to.be.empty
      expect( React.addons.TestUtils.findRenderedComponentWithType(element, Video) ).to.exist

  it 'renders interactive placeholder', ->
    @props.content = @props.content.replace(/preview video/, 'preview interactive')
    Testing.renderComponent( ContentWithPlaceholders, props: @props ).then ({dom, element}) ->
      expect( ReactTestUtils.scryRenderedComponentsWithType(Interactive) ).to.be.empty
      expect( ReactTestUtils.findRenderedComponentWithType(element, Interactive) ).to.exist
