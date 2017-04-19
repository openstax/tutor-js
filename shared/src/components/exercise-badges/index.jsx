React = require 'react'
_ = require 'underscore'
Exercise = require '../../model/exercise'
Interactive = require './interactive-icon'
MultiPart   = require './multipart-icon'
classnames = require 'classnames'

ExerciseBadges = React.createClass

  propTypes:
    isMultipart:   React.PropTypes.bool
    hasInteractive:   React.PropTypes.bool
    hasVideo:   React.PropTypes.bool
    exercise: React.PropTypes.object

  getDefaultProps: ->
    isMultipart: false
    hasInteractive: false
    hasVideo: false
    exercise: {}

  render: ->
    classes = classnames 'openstax-exercise-badges', @props.className

    badges = []
    if @props.isMultipart or Exercise.isMultipart(@props.exercise)
      badges.push <span key='mpq' className="mpq">
          <MultiPart />Multi-part question
        </span>

    if @props.hasInteractive or Exercise.hasInteractive(@props.exercise)
      badges.push <span key='interactive' className="interactive">
          <Interactive />Interactive
        </span>

    if @props.hasVideo or Exercise.hasVideo(@props.exercise)
      badges.push <span key='video' className="video">
          <Interactive />Video
        </span>

    if badges.length
      <div className={classes}>
        {badges}
      </div>
    else
      null



module.exports = ExerciseBadges
