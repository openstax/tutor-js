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
    onMenuSelection: React.PropTypes.func.isRequired

  render: ->
    {courseId} = @context.router.getCurrentParams()
    sections = @props.section.chapter_section.join('.')
    [linkTarget, params] = if @props.section.cnx_id
      ['viewReferenceBookPage',  {courseId: courseId, cnxId: @props.section.cnx_id}]
    else
      ['viewReferenceBookSection', {courseId: courseId, section: sections}]
    <ul className="section" data-depth={@props.section.chapter_section.length}>
      <Router.Link onClick={@props.onMenuSelection} to={linkTarget}
          params={params}>
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
  contextTypes:
    router: React.PropTypes.func
  propTypes:
    onMenuSelection: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    toc = ReferenceBookStore.getToc(courseId)
    <div className="toc">
      { _.map toc.children, (child) =>
        <Section onMenuSelection={@props.onMenuSelection} key={child.id} section={child} /> }
    </div>
