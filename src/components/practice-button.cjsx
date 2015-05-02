React = require 'react'
BS = require 'react-bootstrap'

PracticeButton = React.createClass
  displayName: 'PracticeButton'

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.number.isRequired
    pageIds: React.PropTypes.arrayOf(React.PropTypes.number)

  goToPractice: ->
    {courseId, pageIds} = @props

    query = {}
    query.page_ids = pageIds if pageIds

    @context.router.transitionTo('viewPractice', {courseId}, query)

  render: ->
    <BS.Button bsStyle='primary' className='-practice' onClick={@goToPractice}>
      {@props.children}
    </BS.Button>


module.exports = PracticeButton
