{Testing, expect, sinon, _, ReactTestUtils} = require 'openstax-react-components/test/helpers'

{ExerciseProgress} = require 'progress/exercise'

describe 'ExerciseProgress Component', ->

  beforeEach ->
    @props =
      className: 'a-test'
      exercise:
        is_correct: true
        is_completed: true

  it 'renders with classnames to match props', ->
    Testing.renderComponent( ExerciseProgress, props: @props ).then ({dom}) ->
      expect(dom.classList.contains('a-test')).to.be.true
      expect(dom.classList.contains('is-correct')).to.be.true
      expect(dom.classList.contains('is-completed')).to.be.true

  it 'renders if props are empty', ->
    Testing.renderComponent( ExerciseProgress ).then ({dom}) ->
      expect(dom.classList.contains('is-correct')).to.be.false
      expect(dom.classList.contains('is-completed')).to.be.false
