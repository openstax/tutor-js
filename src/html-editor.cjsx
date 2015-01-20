# @cjsx React.DOM

React = require 'react'
Quill = require 'quill-with-math'
KatexMixin = require './katex-mixin'

MOST_RECENTLY_FOCUSED = null

module.exports = React.createClass
  displayName: 'HtmlEditor'
  mixins: [KatexMixin]

  getInitialState: ->
    objects:
      editor: null

  initializeEditor: ->
    editor = new Quill(@refs.editorRoot.getDOMNode(), theme: 'snow')
    editor.addModule 'toolbar',
      container: @props.toolbarId
    editor.addModule('link-tooltip', true)
    editor.addModule('math-tooltip', true)

    editor.setHTML(@props.html or '') # for newly-added questions or answers
    @state.objects.editor = editor
    # Focus the editor at the end of the text
    unless @props.noInitialFocus
      len = editor.getLength() - 1
      editor.setSelection(len, len)

    editor.on 'text-change', =>
      @props.onChange(@leakedGetHtml)

    # Ugly hack for clicking on toolbars and CSS :focus
    editor_focus = editor.focus
    editor.focus = ->
      if MOST_RECENTLY_FOCUSED is editor
        editor_focus.call(editor)

    editor.on 'selection-change', =>
      MOST_RECENTLY_FOCUSED = editor

  componentDidMount: -> @initializeEditor()
  componentDidUpdate: -> @initializeEditor()

  componentWillReceiveProps: (newprops) ->
    @state.objects.editor.setHTML(newprops.html)

  leakedGetHtml: ->
    if @state.objects.editor.getText().trim().length is 0
      ''
    else
      html = @state.objects.editor.getHTML()
      html = @sanitizeKatexHtml(html)
      html

  render: ->
    <div className="quill-wrapper" ref="editorRoot" />
