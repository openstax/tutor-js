{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/test/helpers'

App = require 'components/app'
Location = require 'stores/location'
{ExerciseActions, ExerciseStore} = require 'stores/exercise'
Exercise = require 'components/exercise'
ExerciseControls = require 'components/exercise/controls'

describe 'App component', ->
  beforeEach ->
    @props =
      location: new Location
      data:
        user:
          full_name: 'Bob'

  it 'renders a blank exercise when btn is clicked', ->
    sinon.stub(@props.location, 'partsForView', ->
      Body: Exercise, Controls: ExerciseControls, store: ExerciseStore, actions: ExerciseActions
    )
    Testing.renderComponent( App, props: @props ).then ({dom}) ->
      expect( dom.querySelector('.exercise-editor') ).not.to.exist
      ReactTestUtils.Simulate.click dom.querySelector('.btn.exercises.blank')
      expect( dom.querySelector('.exercise-editor') ).to.exist
