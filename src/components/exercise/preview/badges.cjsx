React = require 'react'
_ = require 'underscore'
Exercise = require '../../../model/exercise'
Interactive = require './interactive-badge'
MultiPart   = require './multipart-badge'

ExerciseBadges = React.createClass

  propTypes:
    isInteractive:   React.PropTypes.bool
    exercise: React.PropTypes.object.isRequired

  render: ->
    badges = []
    if @props.exercise.content.questions.length > 1
      badges.push <span key='mpq' className="mpq">
          <MultiPart />Multi-part question
        </span>

    if Exercise.hasInteractive(@props.exercise)
      badges.push <span key='interactive' className="interactive">
          <Interactive />Interactive
        </span>

    if Exercise.hasVideo(@props.exercise)
      badges.push <span key='video' className="video">
          <Interactive />Video
        </span>

    if badges.length
      <div className="badges">
        {badges}
      </div>
    else
      null



module.exports = ExerciseBadges
