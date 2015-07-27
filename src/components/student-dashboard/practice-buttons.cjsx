React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

LearningGuide = require '../../flux/learning-guide'
PracticeByTypeButton = require '../learning-guide/practice-by-type-button'

module.exports = React.createClass
  displayName: 'PracticeButtonsPanel'

  propTypes:
    courseId: React.PropTypes.string.isRequired

  render: ->
    sections = LearningGuide.Student.store.getAllSections(@props.courseId)
    return null if _.isEmpty(sections)

    <div className='actions-box'>
      <h1 className='panel-title'>Practice</h1>
      <BS.ButtonGroup>
        <PracticeByTypeButton
          practiceType='stronger'
          practiceTitle='stronger'
          courseId={@props.courseId} />
        <PracticeByTypeButton
          practiceType='weaker'
          practiceTitle='weaker'
          courseId={@props.courseId} />
      </BS.ButtonGroup>
    </div>
