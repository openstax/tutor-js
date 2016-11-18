React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'

{AddAssignmentLink} = require './task-dnd'

PastAssignments = require './past-assignments'

CourseAddMenuMixin = require './add-menu-mixin'
{CourseStore} = require '../../flux/course'

AddAssignmentSidebar = React.createClass

  mixins: [ CourseAddMenuMixin ]

  propTypes:
    courseId: React.PropTypes.string.isRequired
    hasPeriods: React.PropTypes.bool.isRequired


  getInitialState: ->
    {isOpen: false}

  renderMenuLink: (link) ->
    <AddAssignmentLink key=link.type link=link goToBuilder=@goToBuilder />

  onMenuToggle: (isOpen) ->
    return unless CourseStore.isCloned(@props.courseId)

    _.defer => @setState({isOpen})

  render: ->
    <div className={classnames('add-assignment-sidebar', {
      'is-open': @state.isOpen
    })}>
      <div className='sidebar-section'>
        <div className="section-label">NEW</div>
        <ul className="new-assignments">
          {@renderAddActions()}
        </ul>
      </div>
      <PastAssignments className='sidebar-section' courseId={@props.courseId} />
    </div>
module.exports = AddAssignmentSidebar
