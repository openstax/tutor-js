React = require 'react'
Router = require 'react-router'

BS = require 'react-bootstrap'
HTML = require '../html'
{ReferenceBookPageActions, ReferenceBookPageStore} = require '../../flux/reference-book-page'

module.exports = React.createClass
  displayName: 'ReferenceBookPage'

  mixins: [ Router.State ]

  render: ->
    {cnxId} = @getParams()
    page = ReferenceBookPageStore.get(cnxId)
    <div className="content">
        <HTML html={page.content_html}/>
    </div>
