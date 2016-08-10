_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'

CourseGroupingLabel = require '../course-grouping-label'

CourseAddMenuMixin =
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    dateFormat: React.PropTypes.string
    hasPeriods: React.PropTypes.bool.isRequired

  getInitialState: ->
    addDate: null

  getDefaultProps: ->
    dateFormat: 'YYYY-MM-DD'

  goToBuilder: (link) ->
    (clickEvent) =>
      clickEvent.preventDefault()
      @context.router.transitionTo(link.to, link.params, link.query)

  renderAddActions: ->
    {courseId} = @context.router.getCurrentParams()
    {dateFormat, hasPeriods} = @props

    if hasPeriods
      links = [
        {
          text: 'Add Reading'
          to: 'createReading'
          params:
            courseId: courseId
          type: 'reading'
          query:
            due_at: @state.addDate?.format(dateFormat)
        }, {
          text: 'Add Homework'
          to: 'createHomework'
          params:
            courseId: courseId
          type: 'homework'
          query:
            due_at: @state.addDate?.format(dateFormat)
        }, {
          text: 'Add External Assignment'
          to: 'createExternal'
          params:
            courseId: courseId
          type: 'external'
          query:
            due_at: @state.addDate?.format(dateFormat)
        }, {
          text: 'Add Event'
          to: 'createEvent'
          params:
            courseId: courseId
          type: 'event'
          query:
            due_at: @state.addDate?.format(dateFormat)
        }
      ]

    else
      linkText = [
        <span key='no-periods-link-1'>Please add a </span>
        <CourseGroupingLabel
          key='no-periods-link-2'
          lowercase
          courseId={@props.courseId}/>
        <span key='no-periods-link-3'> in </span>
        <br key='no-periods-link-4'/>
        <span
          className='no-periods-course-settings-link'
          key='no-periods-link-5'>Course Settings</span>
        <span key='no-periods-link-6'> before</span>
        <br key='no-periods-link-7'/>
        <span key='no-periods-link-8'>adding assignments.</span>
      ]

      links = [{
        text: linkText
        to: 'courseSettings'
        params:
          courseId: courseId
        type: 'none'
      }]

    _.map(links, (link) =>
      href = @context.router.makeHref(link.to, link.params, link.query)
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
