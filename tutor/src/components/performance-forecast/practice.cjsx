React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
Router = require '../../helpers/router'
{CoursePracticeStore} = require '../../flux/practice'

module.exports = React.createClass
  displayName: 'PracticeButton'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    page_ids: React.PropTypes.array.isRequired
    children: React.PropTypes.element.isRequired

  contextTypes:
    router: React.PropTypes.object

  onClick: ->
    {courseId, page_ids} = @props
    route = Router.makePathname('practiceTopics', {courseId}, query: {page_ids})
    @context.router.transitionTo( route )

  isDisabled: ->
    {page_ids, courseId} = @props

    # Used to disable for CoursePracticeStore.isDisabled(courseId, {page_ids}) as well
    #
    # CoursePracticeStore.isDisabled(courseId, {page_ids}) is true when practice
    # endpoint fails to return a practice.
    _.isEmpty(page_ids)

  isErrored: ->
    {page_ids, courseId} = @props

    not @isDisabled() && CoursePracticeStore.isDisabled(courseId, {page_ids})

  render: ->
    isDisabled = @isDisabled()
    className = classnames(
      'is-errored': @isErrored()
    )
    props = {isDisabled, onClick: @onClick, className}

    React.cloneElement(@props.children, props)
