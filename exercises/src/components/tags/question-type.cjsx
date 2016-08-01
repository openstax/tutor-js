React = require 'react'

SingleDropdown = require './single-dropdown'

PREFIX = 'type'
TYPES =
  'conceptual-or-recall' : 'Conceptual or Recall'
  'conceptual'           : 'Conceptual'
  'recall'               : 'Recall'
  'practice'             : 'Practice'

QuestionTypeTag = React.createClass

  propTypes:
    id:      React.PropTypes.string.isRequired
    store:   React.PropTypes.object.isRequired
    actions: React.PropTypes.object.isRequired

  render: ->
    <SingleDropdown
      {...@props}
      label='Question Type'
      prefix={PREFIX}
      choices={TYPES}
    />                 #

module.exports = QuestionTypeTag
