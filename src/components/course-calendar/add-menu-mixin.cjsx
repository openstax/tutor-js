_ = require 'lodash'

React = require 'react'
BS = require 'react-bootstrap'

CourseAddMenuMixin =
  contextTypes:
    router: React.PropTypes.func
    params: React.PropTypes.object

  propTypes:
    dateFormat: React.PropTypes.string

  getInitialState: ->
    addDate: null

  getDefaultProps: ->
    dateFormat: 'YYYY-MM-DD'

  goToBuilder: (link) ->
    (clickEvent) =>
      clickEvent.preventDefault()
      @context.router.push(link.to, link.query)

  renderAddActions: ->
    {courseId} = @context.params
    {dateFormat} = @props

    links = [
      {
        text: 'Add Reading'
        to: '/courses/${courseId}/t/readings/new'
        params:
          courseId: courseId
        type: 'reading'
        query:
          due_at: @state.addDate?.format(dateFormat)
      }, {
        text: 'Add Homework'
        to: '/courses/${courseId}/t/homeworks/new'
        params:
          courseId: courseId
        type: 'homework'
        query:
          due_at: @state.addDate?.format(dateFormat)
      }, {
        text: 'Add External Assignment'
        to: '/courses/${courseId}/t/externals/new'
        params:
          courseId: courseId
        type: 'external'
        query:
          due_at: @state.addDate?.format(dateFormat)
      }, {
        text: 'Add Event'
        to: '/courses/${courseId}/t/events/new'
        params:
          courseId: courseId
        type: 'event'
        query:
          due_at: @state.addDate?.format(dateFormat)
      }
    ]

    _.map(links, (link) =>
      pathTo = _.template(link.to, link.params)
      href = @context.router.createHref(pathTo(), link.query)
      <li
        key={link.type}
        data-assignment-type={link.type}
        ref="#{link.type}Link">
        <a href={href} onClick={@goToBuilder(link)} >
          {link.text}
        </a>
      </li>
    )

module.exports = CourseAddMenuMixin
