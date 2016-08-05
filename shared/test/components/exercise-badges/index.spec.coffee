{Testing, expect, sinon, _, ReactTestUtils} = require 'test/helpers'
ld = require 'lodash'
Badges = require 'components/exercise-badges'

EXERCISE = require '../../../api/exercise-preview/data'

describe 'Exercise Preview Component', ->

  beforeEach ->
    @props = {
      exercise: ld.cloneDeep(EXERCISE)
    }

  it 'doesnt render if no items were found', ->
    @props.exercise.has_interactive = false
    @props.exercise.has_video = false
    @props.exercise.content.questions = [ @props.exercise.content.questions[0] ]
    Testing.renderComponent( Badges, props: @props ).then ({dom}) ->
      expect(dom).not.to.exist

  it 'renders interactive embed', ->
    @props.exercise.has_interactive = true
    Testing.renderComponent( Badges, props: @props ).then ({dom}) ->
      expect( dom.querySelector('.interactive') ).to.exist

  it 'renders for video', ->
    @props.exercise.has_video = true
    Testing.renderComponent( Badges, props: @props ).then ({dom}) ->
      expect( dom.querySelector('.video') ).to.exist

  it 'renders for MPQs', ->
    @props.exercise.content.questions.push(ld.cloneDeep(@props.exercise.content.questions[0]))
    Testing.renderComponent( Badges, props: @props ).then ({dom}) ->
      expect( dom.querySelector('.mpq') ).to.exist
