{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'

ExercisePreview = require 'components/exercise/preview'
Exercise = require 'components/exercise'
{ExerciseActions} = require 'stores/exercise'
EXERCISE = require '../../api/exercises/1.json'
Location = require '../../src/stores/location'

xdescribe 'Exercises component', ->
  props = history = null
  beforeEach ->
    sinon.stub( Location.prototype, '_createHistory', ->
      history = {
        push: -> 0
      }
    )
    props =
      id: '1'
      location: new Location
    ExerciseActions.loaded(EXERCISE, props.id)

  afterEach ->
    Location::_createHistory.restore()

  it 'renders', ->
    Testing.renderComponent( Exercise, props: props ).then ({dom}) ->
      expect(dom.classList.contains('.exercise-editor')).not.to.true

  it 'renders a preview of the exercise', ->
    Testing.renderComponent( Exercise, props: props ).then ({element}) =>

      preview = ReactTestUtils.findRenderedComponentWithType(element, ExercisePreview)
      expect(preview.props.exerciseId).to.equal(props.id)

  it 'renders with intro and a multiple questions when exercise is MC', ->
    Testing.renderComponent( Exercise, props: props ).then ({dom}) ->
      tabs = _.pluck dom.querySelectorAll('.nav-tabs li'), 'textContent'
      expect(tabs).to.deep.equal(['Intro', 'Question 1', 'Question 2', 'Tags', 'Assets'])

  it 'renders with out intro and a single question when exercise is MC', ->
    ExerciseActions.toggleMultiPart(props.id)
    Testing.renderComponent( Exercise, props: props ).then ({dom}) ->
      tabs = _.pluck dom.querySelectorAll('.nav-tabs li'), 'textContent'
      expect(tabs).to.deep.equal(['Question', 'Tags', 'Assets'])

  it 'displays question formats on preview', ->
    Testing.renderComponent( Exercise, props: props ).then ({dom}) ->
      expect(dom.querySelector('.openstax-exercise-preview .formats-listing')).to.exist
