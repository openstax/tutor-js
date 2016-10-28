React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'

{AddAssignmentLink} = require './task-dnd'

PastAssignments = require './past-assignments'

CourseAddMenuMixin = require './add-menu-mixin'

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
    @props.onSidebarToggle(isOpen)
    _.defer => @setState({isOpen})

  render: ->
    hasPastAssignments = true # FIXME - this will come from BE endpoint

    <div className={classnames('add-assignment', {
      'as-sidebar': hasPastAssignments
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
        <PastAssignments courseId={@props.courseId} />
      </BS.DropdownButton>
    </div>
module.exports = AddAssignmentMenu
