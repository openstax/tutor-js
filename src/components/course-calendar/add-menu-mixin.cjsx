moment = require 'moment'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'

CourseAddMenuMixin =
  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    addDate: null

  renderAddActions: ->
    {courseId} = @context.router.getCurrentParams()

    links = [
      {
        text: 'Add iReading'
        to: 'createPlan'
        params:
          courseId: courseId
          type: 'reading'
        query:
          date: @state.addDate?.format('MM-DD-YYYY')
      }, {
        text: 'Add Homework'
        to: 'createPlan'
        params:
          courseId: courseId
          type: 'homework'
        query:
          date: @state.addDate?.format('MM-DD-YYYY')
      }
    ]

    _.map(links, (link) ->
        href = @context.router.makeHref(link.to, link.params, link.query)
        <BS.MenuItem href = {href}>{link.text}</BS.MenuItem>
    , @)

module.exports = CourseAddMenuMixin
