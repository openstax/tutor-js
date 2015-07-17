React = require 'react'
BS = require 'react-bootstrap'

module.exports = React.createClass
  displayName: 'LearningGuideProgressBar'

  propTypes:
    level: React.PropTypes.number.isRequired

  render: ->
    percent = Math.round((@props.level / 1) * 100)
    color = switch
      when percent >  75 then 'high'
      when percent >= 50 then 'medium'
      else 'low'

    <BS.ProgressBar className={color} now={percent} />
