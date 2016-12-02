React = require 'react'
BS = require 'react-bootstrap'

Clipboard = require '../../helpers/clipboard'
CopyOnFocusInput = require '../copy-on-focus-input'
Icon = require '../icon'
{RosterStore} = require '../../flux/roster'

AddTeacherModal = (props) ->
  <BS.Modal
    bsSize='lg'
    show={props.show}
    onHide={props.onClose}
    className='settings-add-instructor-modal'
  >
    <BS.Modal.Header closeButton>
      <BS.Modal.Title>Add Teacher</BS.Modal.Title>
    </BS.Modal.Header>
    <BS.Modal.Body>
      <p>
        Share this link with an instructor so they can add themselves to the course:
      </p>
      <CopyOnFocusInput value={props.url} focusOnMount />
      <p className="warning">
        <Icon type='exclamation-triangle' /> Do not share this link with students
      </p>
    </BS.Modal.Body>
  </BS.Modal>

AddTeacherLink = React.createClass
  displayName: 'AddTeacherLink'

  propTypes:
    courseId: React.PropTypes.string.isRequired

  getInitialState: ->
    isShown: false

  onClose: ->
    @setState(isShown: false)

  displayModal: ->
    @setState(isShown: true)

  render: ->
    <BS.Button onClick={@displayModal} bsStyle='link' className='control add-teacher'>
      <Icon type="plus" />
      Add Instructor
      <AddTeacherModal
        url={RosterStore.get(@props.courseId).teach_url}
        show={@state.isShown}
        onClose={@onClose}
      />
    </BS.Button>

module.exports = AddTeacherLink
