React = require 'react'
_ = require 'underscore'
Exercise = require 'model/exercise'

ExerciseBadges = React.createClass

  propTypes:
    isInteractive:   React.PropTypes.bool
    exercise: React.PropTypes.object.isRequired

  # getStimulus: ->
  #   @props.exercise.content?.stimulus_html or ''

  # hasInteractive: ->
  #   !!@getStimulus().match(/iframe.*(cnx.org|phet.colorado.edu)/)

  # hasVideo: ->
  #   !!@getStimulus().match(/(youtube.com\/(v|embed)\/|khanacademy.org)/)

  render: ->
    badges = []
    if @props.exercise.content.questions.length > 1
      badges.push <span key='mpq' className="mpq">
          <i className='fa fa-pie-chart' /> Multi-part question
        </span>

    if Exercise.hasInteractive(@props.exercise)
      badges.push <span key='interactive' className="interactive">
          <i className='fa fa-object-group' /> Interactive
        </span>

    if Exercise.hasVideo(@props.exercise)
      badges.push <span key='video' className="video">
          <i className='fa fa-television' /> Video
        </span>

    if badges.length
      <div className="badges">
        {badges}
      </div>
    else
      null



module.exports = ExerciseBadges
