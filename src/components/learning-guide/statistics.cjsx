React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

ChapterSectionType = require './chapter-section-type'

Statistics = React.createClass

  propTypes:
    section:  ChapterSectionType.isRequired
    displaying: React.PropTypes.string.isRequired

  render: ->
    <div className='statistics'>
      <ul className='clue visible-when-debugging'>
        { for key, value of @props.section.clue
          value = value.join(' ') if _.isArray(value)
          <li key={key}>{key}: {value}</li>}
      </ul>
      <div className='amount-worked'>
        <span className='count'>
          {@props.section.questions_answered_count} problems worked in this {@props.displaying}
        </span>
      </div>
    </div>


module.exports = Statistics
