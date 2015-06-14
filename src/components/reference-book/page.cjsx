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
    html = page.content_html
    # FIXME the BE sends HTML with head and body
    # Fixing it with nasty regex for now
    html = html
      .replace(/^[\s\S]*<body[\s\S]*?>/, '')
      .replace(/<\/body>[\s\S]*$/, '')
    <div className="page">
      <div className="content">
        <HTML html={html}/>
      </div>
    </div>
