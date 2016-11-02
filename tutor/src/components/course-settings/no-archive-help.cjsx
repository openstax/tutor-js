React = require 'react'
BS = require 'react-bootstrap'

CourseGroupingLabel = require '../course-grouping-label'
{CurrentUserStore} = require '../../flux/current-user'
NewTabLink = require '../new-tab-link'

NoArchiveHelp = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired

  getInitialState: ->
    showModal: false

  renderPopover: ->
    <BS.Popover id='archive-period' className="archive-period" title="WHy?">
      <h1>Hep</h1>
    </BS.Popover>

  open:  -> @setState({showModal: true})
  close: -> @setState({showModal: false})

  HelpModal: ->
    <BS.Modal
      show={@state.showModal}
      onHide={@close}
      className='teacher-edit-period-modal'>

      <BS.Modal.Header closeButton>
        <BS.Modal.Title>
          Archiving Sections and Reteaching a Course
        </BS.Modal.Title>
      </BS.Modal.Header>

      <BS.Modal.Body className='no-archiving-help'>
        <p>
          You no longer need to add or archive sections to teach this course again.
          To teach this course again, please return to your Dashboard on January 1.
        </p>
        <p>
          Need to access grades or info from a section you
          archived? <NewTabLink to={CurrentUserStore.getHelpLink()}>Contact us</NewTabLink>
        </p>
      </BS.Modal.Body>

    </BS.Modal>

  render: ->
    <span className='control no-archive-help'>
      <BS.Button bsStyle='link' onClick={@open}>
        Why can’t I add or archive <CourseGroupingLabel lowercase
          courseId={@props.courseId} />?

      </BS.Button>
      <@HelpModal />
    </span>

module.exports = NoArchiveHelp
