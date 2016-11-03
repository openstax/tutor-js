React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'

{AddAssignmentLink} = require './task-dnd'

PastAssignments = require './past-assignments'

CourseAddMenuMixin = require './add-menu-mixin'
{CourseStore} = require '../../flux/course'

AddAssignmentMenu = React.createClass

  mixins: [ CourseAddMenuMixin ]

  propTypes:
    courseId: React.PropTypes.string.isRequired
    hasPeriods: React.PropTypes.bool.isRequired
    onSidebarToggle: React.PropTypes.func.isRequired

  getInitialState: ->
    {isOpen: false}

  renderMenuLink: (link) ->
    <AddAssignmentLink key={link.type} link=link goToBuilder={@goToBuilder} />

  onMenuToggle: (isOpen) ->
    return unless CourseStore.isCloned(@props.courseId)
    @props.onSidebarToggle(isOpen)
    _.defer => @setState({isOpen})

  render: ->
    isCloned = CourseStore.isCloned(@props.courseId)
    <div className={classnames('add-assignment', {
      'as-sidebar': isCloned
      'is-open': @state.isOpen
    })}>

      <BS.DropdownButton
        ref='addAssignmentButton'
        id='add-assignment'
        onToggle={@onMenuToggle}
        className='add-assignment'
        title='Add Assignment'
        bsStyle={if @props.hasPeriods then 'primary' else 'default'}
      >
        {@renderAddActions()}
        {<PastAssignments courseId={@props.courseId} /> if isCloned}
      </BS.DropdownButton>
    </div>
module.exports = AddAssignmentMenu
