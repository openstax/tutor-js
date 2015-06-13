React = require 'react'
Router = require 'react-router'
_  = require 'underscore'
BS = require 'react-bootstrap'


{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'


Leaf = React.createClass
  displayName: 'ReferenceBookTocLeaf'
  mixins: [ Router.State ]
  propTypes:
    branch: React.PropTypes.object.isRequired

  render: ->
    {courseId} = @getParams()

    <ul className="leaf">
      <Router.Link
        to="viewReferenceBookPage"
        params={pageId: @props.branch.id, courseId: courseId}>

        {@props.branch.title}

      </Router.Link>
      { _.map @props.branch.children, (child) ->
        <li><Leaf key={child.id} branch={child} /></li> }
    </ul>

module.exports = React.createClass
  displayName: 'ReferenceBook'

  mixins: [ Router.State ]

  render: ->
    {courseId} = @getParams()
    toc = ReferenceBookStore.getToc(courseId)
    <div className="reference-book">
      <h1>{toc.title}</h1>
      { _.map toc.children, (child) ->
        <Leaf key={child.id} branch={child} /> }
    </div>
