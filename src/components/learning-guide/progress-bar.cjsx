React = require 'react'
BS = require 'react-bootstrap'

ChapterSectionType = require './chapter-section-type'

module.exports = React.createClass
  displayName: 'LearningGuideProgressBar'

  propTypes:
    section:  ChapterSectionType.isRequired
    onPractice: React.PropTypes.func

  percentToRGB: (percent) ->
    if percent < 50
      # green to yellow
      r = 255
      g = Math.floor(255 * (percent / 50))
    else
      # yellow to red
      r = Math.floor(255 * ((50 - percent % 50) / 50))
      g = 255
    # rgb value: blue is always 0
    return "rgb(#{r},#{g},0)"

  render: ->
    {section, chapter, onPractice} = @props
    level = section.current_level
    percent = Math.round((level / 1) * 100)
    color = switch
      when percent >  75 then 'high'
      when percent >= 50 then 'medium'
      else 'low'
    bar = <div className='progress'>
      <div className='progress-bar'
        ariaValuenow={percent} ariaValuemin=0 ariaValuemax=100
        style={width: "#{percent}%", backgroundColor: @percentToRGB(percent)} />
    </div>
    if onPractice
      <BS.Button onClick={-> onPractice(section)} block>{bar}</BS.Button>
    else
      bar
