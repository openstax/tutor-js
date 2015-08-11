React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

WeakerSections = React.createClass

  propTypes:
    courseId:  React.PropTypes.string.isRequired
    allSections:  React.PropTypes.array.isRequired
    onPractice: React.PropTypes.func
    weakerTitle: React.PropTypes.string.isRequired
    weakerExplanation: React.PropTypes.element


  render: ->
    # Do not render if we have no sections
    return null if @props.allSections.length is 0

    # Find sections that have enough data to make predictions based on
    validSections = _.filter(@props.allSections, (s) -> s.clue.sample_size_interpretation isnt 'below')

    displayCount = Math.min(Math.floor(validSections.length / 2), 4)

    if displayCount <= 1
      render
    # Sort by their value
    sortedSections = _.sortBy(validSections, (s) -> s.clue.value )


    <div className="chapter-panel weaker">
      <div className='chapter metric'>
        <span className='title'>{@props.weakerTitle}</span>
        {@props.weakerExplanation}
        {if @props.onPractice
          <PracticeButton title='Practice All' courseId={@props.courseId} /> }
      </div>
      <div className='sections'>
        {for section, i in _.first(sortedSections, weakStrongCount)
          <Section key={i} section={section} {...@props} />}
      </div>

    </div>




module.exports = WeakerSections
