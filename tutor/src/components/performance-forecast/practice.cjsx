React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{CoursePracticeStore} = require '../../flux/practice'

module.exports = React.createClass
  displayName: 'PracticeButton'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    page_ids: React.PropTypes.array.isRequired
    children: React.PropTypes.element.isRequired

  contextTypes:
    router: React.PropTypes.func

  onClick: ->
    {courseId, page_ids} = @props
    @context.router.transitionTo('viewPractice', {courseId}, {page_ids})

  isDisabled: ->
    {page_ids, courseId} = @props
    _.isEmpty(page_ids) or CoursePracticeStore.isDisabled(courseId, {page_ids})

  render: ->
    isDisabled = @isDisabled()
    props = {isDisabled, onClick: @onClick}

    React.addons.cloneWithProps(@props.children, props)
