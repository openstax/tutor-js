React = require 'react'
ReferenceBookPage = require '../reference-book/page-shell'

QAContent = React.createClass
  propTypes:
    cnxId: React.PropTypes.string.isRequired

  render: ->

    <div>
      <ReferenceBookPage cnxId={@props.cnxId}/>
    </div>

module.exports = QAContent
