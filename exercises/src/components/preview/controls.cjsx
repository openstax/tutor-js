React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'

{ExerciseActions, ExerciseStore} = require 'stores/exercise'

PreviewControls = React.createClass
  propTypes:
    id:   React.PropTypes.string
    location: React.PropTypes.object

  goToVersion: (version, ev) ->
    ev.preventDefault()
    exercise = ExerciseStore.get(@props.id)
    @props.location.visitPreview("#{exercise.number}@#{version}")


  render: ->
    exercise = ExerciseStore.get(@props.id)
    return null unless exercise?

    versions = _.sortBy(exercise.versions, parseInt)

    nextVersion = _.find(versions, (version) -> version > exercise.version)
    prevVersion = _.find(versions.reverse(), (version) -> version < exercise.version)

    <div className="preview-navbar-controls">

      <BS.ButtonGroup className="paging-controls">
        <BS.Button href="#"
          onClick={_.partial(@goToVersion, prevVersion)}
          disabled={not prevVersion}
        >{if prevVersion then '⇦' else 'X' }</BS.Button>

        <span>Viewing exercise {exercise?.uid}</span>

        <BS.Button href="#"
          onClick={_.partial(@goToVersion, nextVersion)}
          disabled={not nextVersion}
        >{if nextVersion then '⇨' else 'X'}</BS.Button>
      </BS.ButtonGroup>

    </div>

module.exports = PreviewControls
