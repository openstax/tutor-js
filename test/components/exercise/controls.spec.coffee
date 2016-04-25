{Testing, expect, sinon, _, ReactTestUtils} = require 'openstax-react-components/test/helpers'
{ExercisePreview} = require 'openstax-react-components'

ExerciseControls = require 'components/exercise/controls'
Exercise = require 'components/exercise'
{ExerciseActions} = require 'stores/exercise'
Location = require 'stores/location'
EXERCISE = require 'exercises/1.json'


describe 'Exercise controls component', ->

  beforeEach (done) ->
    @props =
      id: '1'
      location: new Location
    ExerciseActions.loaded(EXERCISE, @props.id)
    Testing.renderComponent( Exercise, props: @props).then ({dom}) =>
      @exercise = dom
      done()


  it 'does not enable the save draft until savable', (done) ->
    Testing.renderComponent( ExerciseControls, props: @props ).then ({dom}) =>

      draftBtn = dom.querySelector('.btn.draft')
      expect( draftBtn.hasAttribute('disabled') ).to.be.true

      for input in @exercise.querySelectorAll('.question textarea')
        ReactTestUtils.Simulate.change(input,
           target: {value: 'Something, something, something'})

      _.defer ->
        expect(draftBtn.hasAttribute('disabled')).to.be.false
        done()
