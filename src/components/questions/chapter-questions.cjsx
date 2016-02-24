React = require 'react'
BS = require 'react-bootstrap'


ChapterQuestions = React.createClass

  propTypes:
    chapterId: React.PropTypes.string.isRequired
    sectionIds: React.PropTypes.array.isRequired

  render: ->
    <h1>Chapter ID {@props.chapterId} {@props.sectionIds}</h1>


module.exports = ChapterQuestions
