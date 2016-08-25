React = require 'react'
BS = require 'react-bootstrap'

Practice = require '../performance-forecast/practice'

PracticeButton = React.createClass
  displayName: 'PracticeButton'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    pageIds:  React.PropTypes.arrayOf(React.PropTypes.string)
    showAll:  React.PropTypes.bool.isRequired

  render: ->
    text = 'Practice this '
    text += if @props.showAll then 'chapter' else 'section'

    <Practice courseId={courseId} page_ids={pageIds}>
      <BS.Button bsStyle='primary' className='-practice'>
        {text}
      </BS.Button>
    </Practice>


module.exports = PracticeButton
