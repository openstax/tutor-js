React = require 'react'
Router = require 'react-router'
_  = require 'underscore'
BS = require 'react-bootstrap'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'

Section = React.createClass
  displayName: 'ReferenceBookTocSection'
  contextTypes:
    router: React.PropTypes.func
  propTypes:
    section: React.PropTypes.object.isRequired
    onClick: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    sections = @props.section.chapter_section.join('.')
    linkTarget = if @props.section.cnx_id then 'viewReferenceBookPage' else 'viewReferenceBookSection'
    <ul className="section" data-depth={@props.section.chapter_section.length}>
      <Router.Link onClick={@props.onClick} to={linkTarget}
          params={courseId: courseId, cnxId: @props.section.cnx_id, section: sections}>
          <span className="section-number">{sections}</span>
          {@props.section.title}
      </Router.Link>
      { _.map @props.section.children, (child) =>
        <li key={child.id}>
          <Section onClick={@props.onClick} section={child} />
        </li> }
    </ul>


module.exports = React.createClass
  displayName: 'ReferenceBookTOC'
  contextTypes:
    router: React.PropTypes.func
  propTypes:
    onClick: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    toc = ReferenceBookStore.getToc(courseId)
    <div className="toc">
      { _.map toc.children, (child) =>
        <Section onClick={@props.onClick} key={child.id} section={child} /> }
    </div>
