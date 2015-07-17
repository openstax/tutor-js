React = require 'react'
BS = require 'react-bootstrap'

ChapterSectionType = require './chapter-section-type'

module.exports = React.createClass
  displayName: 'LearningGuideProgressBar'

  propTypes:
    section:  ChapterSectionType
    chapter:  ChapterSectionType
    onPractice: React.PropTypes.func

  render: ->
    {section, chapter, onPractice} = @props
    level = (section or chapter).current_level
    percent = Math.round((level / 1) * 100)
    color = switch
      when percent >  75 then 'high'
      when percent >= 50 then 'medium'
      else 'low'


    bar = <BS.ProgressBar className={color} now={percent} />
    if onPractice
      <BS.Button onClick={-> onPractice(section or chapter)} block>{bar}</BS.Button>
    else
      bar
