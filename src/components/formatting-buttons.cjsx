React = require 'react'

Btn = React.createClass
  render: ->
    <button title={@props.title} className={@props.className}>
      {@props.children}
    </button>


module.exports = [
  <Btn title="Bold" className="btn-toolbar ql-bold">
    <i className="mdi-editor-format-bold"></i>
  </Btn>
  <Btn title="Italic" className="btn-toolbar ql-italic">
    <i className="mdi-editor-format-italic"></i>
  </Btn>
  <Btn title="Bulleted List" className="btn-toolbar ql-bullet">
    <i className="mdi-editor-format-list-bulleted"></i>
  </Btn>
  <Btn title="Numbered List" className="btn-toolbar ql-list">
    <i className="mdi-editor-format-list-numbered"></i>
  </Btn>
  <Btn title="Math" className="btn-toolbar ql-math">
    x<sup>y</sup>
  </Btn>
]
