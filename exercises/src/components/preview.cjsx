React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'

ExercisePreview = require 'components/exercise/preview'
{ExerciseActions, ExerciseStore} = require 'stores/exercise'


Preview = React.createClass
  propTypes:
    id:   React.PropTypes.string
    location: React.PropTypes.object

  render: ->
    exercise = ExerciseStore.get(@props.id)

    <div className="preview-screen">

      <ExercisePreview exerciseId={@props.id} />
    </div>


module.exports = Preview
