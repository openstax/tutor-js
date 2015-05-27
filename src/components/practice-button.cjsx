React = require 'react'
BS = require 'react-bootstrap'

PracticeButton = React.createClass
  displayName: 'PracticeButton'

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string.isRequired
    pageIds:  React.PropTypes.arrayOf(React.PropTypes.string)
    showAll:  React.PropTypes.bool.isRequired

  goToPractice: ->
    {courseId, pageIds} = @props

    query = {}
    query.page_ids = pageIds if pageIds

    @context.router.transitionTo('viewPractice', {courseId}, query)

  render: ->
    text = 'Practice this '
    text += if @props.showAll then 'chapter' else 'section'
    <BS.Button bsStyle='primary' className='-practice' onClick={@goToPractice}>
      {text}
    </BS.Button>


module.exports = PracticeButton
