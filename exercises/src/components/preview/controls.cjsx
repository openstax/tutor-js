React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
keymaster = require 'keymaster'

{ExerciseActions, ExerciseStore} = require 'stores/exercise'

KEYBINDING_SCOPE = 'ex-preview'

PreviewControls = React.createClass
  propTypes:
    id:   React.PropTypes.string
    location: React.PropTypes.object

  componentDidMount: ->
    # left/right to go between exercises, and up/down to go between versions.
    keymaster('up',    KEYBINDING_SCOPE, @goNextVersion)
    keymaster('down',  KEYBINDING_SCOPE, @goPrevVersion)
    keymaster('left',  KEYBINDING_SCOPE, @goPrevExercise)
    keymaster('right', KEYBINDING_SCOPE, @goNextExercise)
    keymaster.setScope(KEYBINDING_SCOPE)

  disableKeys: ->
    keymaster.deleteScope(KEYBINDING_SCOPE)

  goNextExercise: ->
    exercise = ExerciseStore.get(@props.id)
    @props.location.visitPreview("#{exercise.number+1}")

  goPrevExercise: ->
    exercise = ExerciseStore.get(@props.id)
    @props.location.visitPreview("#{exercise.number-1}")

  goNextVersion: ->
    exercise = ExerciseStore.get(@props.id)
    version = @findNextVersion()
    @props.location.visitPreview("#{exercise.number}@#{version}") if version?

  goPrevVersion: ->
    exercise = ExerciseStore.get(@props.id)
    version = @findPrevVersion()
    @props.location.visitPreview("#{exercise.number}@#{version}") if version?

  findNextVersion: ->
    exercise = ExerciseStore.get(@props.id)
    return null unless exercise
    versions = _.sortBy(exercise.versions, _.partial(parseInt, _, 10))
    _.find(versions, (version) -> version > exercise.version)

  findPrevVersion: ->
    exercise = ExerciseStore.get(@props.id)
    return null unless exercise
    versions = _.sortBy(exercise.versions, _.partial(parseInt, _, 10)).reverse()
    _.find(versions, (version) -> version < exercise.version)

  render: ->
    exercise = ExerciseStore.get(@props.id)
    return null unless exercise?

    nextVersion = @findNextVersion()
    prevVersion = @findPrevVersion()

    # left/right to go between exercises, and up/down to go between versions.

    <div className="preview-navbar-controls">

      <BS.ButtonGroup className="paging-controls">

        <BS.Button href="#"
          onClick={@goPrevExercise}
          title="Go to previous exercise"
          disabled={exercise.number is 1}
        >{if exercise.number is 1 then '◅' else '◀' }</BS.Button>

        <BS.Button href="#"
          onClick={@goPrevVersion}
          disabled={not prevVersion}
          title="Go down a version"
        >
          {if prevVersion then '▼' else '▽' }
        </BS.Button>

        <span>Viewing exercise {exercise?.uid}</span>

        <BS.Button href="#"
          onClick={@goNextVersion}
          disabled={not nextVersion}
          title="Go up a version"
        >{if nextVersion then '▲' else '△'}</BS.Button>

        <BS.Button href="#"
          onClick={@goNextExercise}
          title="Go to next exercise"
        >►</BS.Button>

      </BS.ButtonGroup>

    </div>

module.exports = PreviewControls
