{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'
{ExercisePreview} = require 'shared'

ExerciseControls = require 'components/exercise/controls'
Exercise = require 'components/exercise'
{ExerciseActions, ExerciseStore} = require 'stores/exercise'
Location = require 'stores/location'
EXERCISE = require '../../../api/exercises/1.json'


describe 'Exercise controls component', ->
  props = blankProps = null
  beforeEach ->
    props =
      id: '1'
      location: new Location
    blankProps =
      id: 'new'
      location: new Location
    ExerciseActions.loaded(EXERCISE, props.id)

  it 'does not enable the save draft on blank exercises', ->
    Testing.renderComponent( ExerciseControls, props: blankProps ).then ({dom}) ->
      draftBtn = dom.querySelector('.btn.draft')
      expect( draftBtn.hasAttribute('disabled') ).to.be.true

  it 'does enables the save draft when not blank and valid and changed', ->
    #trigger a change
    ExerciseActions.sync(1)
    Testing.renderComponent( ExerciseControls, props: props ).then ({dom}) ->
      draftBtn = dom.querySelector('.btn.draft')
      expect( draftBtn.hasAttribute('disabled') ).to.be.false
