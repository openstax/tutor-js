{Testing, expect, sinon, _, ReactTestUtils} = require 'test/helpers'
ld = require 'lodash'
Badges = require 'components/exercise/preview/badges'


EXERCISE = require '../../../../stubs/exercise/review'

describe 'Exercise Preview Component', ->

  beforeEach ->
    @props = {
      exercise: ld.cloneDeep(EXERCISE)
    }

  it 'doesnt render if no items were found', ->
    @props.exercise.content.stimulus_html = 'this is a prelude to the exercise without any video or such, but it has
    some words that look videoy like youtube without the .com'
    Testing.renderComponent( Badges, props: @props ).then ({dom}) ->
      expect(dom).not.to.exist

  it 'renders for youtube video embed', ->
    @props.exercise.content.stimulus_html = 'watch this: <iframe src="youtube.com/embed/u030w90rawe"></iframe>'
    Testing.renderComponent( Badges, props: @props ).then ({dom}) ->
      expect(dom).to.exist
      expect(dom.textContent).to.include('Video')

  it 'renders for khanacadamy link', ->
    @props.exercise.content.stimulus_html = 'watch this: khanacademy.org'
    Testing.renderComponent( Badges, props: @props ).then ({dom}) ->
      expect(dom).to.exist
      expect(dom.textContent).to.include('Video')

  it 'renders for MPQs', ->
    @props.exercise.content.questions.push(ld.cloneDeep(@props.exercise.content.questions[0]))
    Testing.renderComponent( Badges, props: @props ).then ({dom}) ->
      expect(dom.textContent).to.include('Multi-part question')
