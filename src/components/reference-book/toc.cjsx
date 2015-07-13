React = require 'react'
Router = require 'react-router'
_  = require 'underscore'
BS = require 'react-bootstrap'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'

Section = React.createClass
  displayName: 'ReferenceBookTocSection'
  mixins: [ Router.State ]
  propTypes:
    section: React.PropTypes.object.isRequired
    onMenuSelection: React.PropTypes.func.isRequired

  render: ->
    {courseId} = @getParams()
    sections = @props.section.chapter_section.join('.')
    linkTarget = if @props.section.cnx_id then 'viewReferenceBookPage' else 'viewReferenceBookSection'
    <ul className="section" data-depth={@props.section.chapter_section.length}>
      <Router.Link onClick={@props.onMenuSelection} to={linkTarget}
          params={courseId: courseId, cnxId: @props.section.cnx_id, section: sections}>
          <span className="section-number">{sections}</span>
          {@props.section.title}
      </Router.Link>
      { _.map @props.section.children, (child) =>
        <li key={child.id}>
          <Section onMenuSelection={@props.onMenuSelection} section={child} />
        </li> }
    </ul>


module.exports = React.createClass
  displayName: 'ReferenceBookTOC'
  mixins: [ Router.State ]
  propTypes:
    onMenuSelection: React.PropTypes.func

  render: ->
    {courseId} = @getParams()
    toc = ReferenceBookStore.getToc(courseId)
    <div className="toc">
      { _.map toc.children, (child) =>
        <Section onMenuSelection={@props.onMenuSelection} key={child.id} section={child} /> }
    </div>
