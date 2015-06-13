React = require 'react'
Router = require 'react-router'

BS = require 'react-bootstrap'
{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'

module.exports = React.createClass
  displayName: 'ReferenceBookPage'

  mixins: [ Router.State ],

  render: ->
    {courseId, pageId} = @getParams()
    toc = ReferenceBookStore.getToc(courseId)
    <div className="reference-book">
      <Router.Link
        to="viewReferenceBookTOC"
        className="btn btn-primary"
        params={courseId: courseId}>View Table of Contents</Router.Link>

      <div className="page">
        <h1>PageID: {pageId}</h1>
      </div>
    </div>
