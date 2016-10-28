React = require 'react'
BS = require 'react-bootstrap'
{DragSource} = require 'react-dnd'

{ItemTypes, NewTaskDrag, DragInjector} = require './task-dnd'

CourseAddMenuMixin = require './add-menu-mixin'
MenuLink = (props) ->
  <li
    data-assignment-type={props.link.type}
  >
    {props.connectDragSource(
      <a

        href={props.link.pathname}
        onClick={_.partial(props.goToBuilder, props.link)} >
        {props.link.text}
      </a>
    )}
  </li>

DnDMenuLink = DragSource(ItemTypes.NewTask, NewTaskDrag, DragInjector)(MenuLink)

AddAssignmentMenu = React.createClass

  mixins: [ CourseAddMenuMixin ]

  propTypes:
    courseId: React.PropTypes.string.isRequired
    hasPeriods: React.PropTypes.bool.isRequired
    onSidebarToggle: React.PropTypes.func.isRequired

  renderMenuLink: (link) ->
    <DnDMenuLink key={link.type} link=link goToBuilder={@goToBuilder} />

  render: ->
    <BS.DropdownButton
      ref='addAssignmentButton'
      id='add-assignment'
      className='add-assignment'
      title='Add Assignment'
      bsStyle={if @props.hasPeriods then 'primary' else 'default'}
    >
      {@renderAddActions()}
    </BS.DropdownButton>

module.exports = AddAssignmentMenu
