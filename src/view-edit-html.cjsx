# @cjsx React.DOM

React = require 'react'
# React.addons = require 'react-addons'
Quill = require 'quill-with-math'
katex = require 'katex'

{ExerciseStore, EXERCISE_MODES} = require './flux/exercise'

Viewer = React.createClass
  displayName: 'ContentViewer'

  propTypes:
    content: React.PropTypes.string
    title: React.PropTypes.string

  getDefaultProps: () ->
    onEditContent: () -> debugger

  handleEdit: () ->
    @props.onEditContent()

  render: () ->
    if ExerciseStore.getExerciseMode() is EXERCISE_MODES.EDIT

      if @props.html? and @props.html isnt ''
        <div className="viewer-container hoverable" onClick={@handleEdit}>
          {@props.children}
          <div className="viewer #{@props.className}" dangerouslySetInnerHTML={__html: @props.html}>
          </div>
        </div>
      else if @props.html is ''
        <div className="prompter-container" onClick={@handleEdit}>
          <div className="intentional-empty-content  #{@props.className}">
            <span className="prompt-add-tip">This area was made empty by the author. {@props.prompt_add}</span>
          </div>
        </div>
      else
        <div className="prompter-container" onClick={@handleEdit}>
          <div className="empty-content  #{@props.className}">
            <span className="prompt-add-tip">{@props.prompt_add}</span>
          </div>
        </div>

    else # Not editable
      <div className="viewer  #{@props.className}" dangerouslySetInnerHTML={__html: @props.html}></div>


  renderMath: ->
    for node in @getDOMNode().querySelectorAll('[data-math]:not(.loaded)')
      formula = node.getAttribute('data-math')

      # Divs with data-math should be rendered as a block
      isBlock = node.tagName.toLowerCase() in ['div']

      if isBlock
        formula = "\\displaystyle {#{formula}}"

      katex.render(formula, node)
      node.classList.add('loaded')

  componentDidMount:  -> @renderMath()
  componentDidUpdate: -> @renderMath()


Editor = React.createClass
  displayName: 'ContentEditor'

  getInitialState: () ->
    objects:
      editor: null

  propTypes:
    content: React.PropTypes.string
    title: React.PropTypes.string

  getDefaultProps: () ->
    onSaveContent: () -> debugger
    onCancelEdit: () -> debugger
    content: ''
    theme: 'snow'
    className: 'panel-default'

  focus: () ->
    @state.objects.editor.focus()

  initializeEditor: () ->
    editor = new Quill @refs.editor.getDOMNode(), theme: @props.theme
    editor.addModule 'toolbar',
      container: @refs.toolbar.getDOMNode()
    editor.setHTML @props.html or '' # for newly-added questions or answers
    @state.objects.editor = editor
    # Focus the editor at the end of the text
    len = editor.getLength() - 1
    editor.setSelection(len, len)
    @renderMath()

  componentDidMount: () ->
    @initializeEditor()

  componentDidUpdate: () ->
    @initializeEditor()

  renderMath: ->
    for node in @getDOMNode().querySelectorAll('[data-math]:not(.loaded)')
      formula = node.getAttribute('data-math')

      # Divs with data-math should be rendered as a block
      isBlock = node.tagName.toLowerCase() in ['div']

      if isBlock
        formula = "\\displaystyle {#{formula}}"

      katex.render(formula, node)
      node.classList.add('loaded')

  componentWillReceiveProps: (newprops) ->
    @state.objects.editor.setHTML newprops.content

  handleSave: () ->
    if @state.objects.editor.getText().trim().length is 0
      @props.onSaveContent('')
    else
      @props.onSaveContent(@state.objects.editor.getHTML())

  handleCancel: () ->
    @props.onCancelEdit(@state.objects.editor.getHTML())

  render: () ->
    classes = ['panel', 'panel-warning']
    classes.push(@props.className)

    # Disable the cancel class if the previous value was null.
    # This can occur when adding a new question or answer
    cancelClasses = ['btn', 'btn-default']
    cancelClasses.push('disabled') unless @props.html?

    <div className={classes.join(' ')}>
      <div className="panel-heading">
        {@props.title}
        {@props.children}
      </div>
      <div className="panel-body">
        <div className="ql-toolbar" ref="toolbar">
          <span className="ql-format-group">
            <span title="Bold" className="ql-format-button ql-bold"></span>
            <span className="ql-format-separator"></span>
            <span title="Italic" className="ql-format-button ql-italic"></span>
            <span className="ql-format-separator"></span>
            <span title="Underline" className="ql-format-button ql-underline"></span>
            <span className="ql-format-separator"></span>
            <span title="Strikethrough" className="ql-format-button ql-strike"></span>
          </span>
          <span className="ql-format-group">
            <span title="List" className="ql-format-button ql-list"></span>
            <span className="ql-format-separator"></span>
            <span title="Bullet" className="ql-format-button ql-bullet"></span>
            <span className="ql-format-separator"></span>
            <select title="Text Alignment" defaultValue="left" className="ql-align">
              <option value="left" label="Left"></option>
              <option value="center" label="Center"></option>
              <option value="right" label="Right"></option>
              <option value="justify" label="Justify"></option>
            </select>
          </span>
          <span className="ql-format-group">
            <span title="Link" className="ql-format-button ql-link"></span>
          </span>
        </div>
        <div className="ql-editor" ref="editor"></div>
      </div>
      <div className="panel-footer" ref="footer">
        <div className="ql-operations">
          <button className={cancelClasses.join(' ')} onClick={@handleCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={@handleSave}>Done</button>
        </div>
      </div>
    </div>

ViewEditHtml = React.createClass
  displayName: 'ViewEditHtml'
  propTypes:
    content: React.PropTypes.string
    title: React.PropTypes.string
    className: React.PropTypes.string

  getInitialState: () ->
    if @props.html?
      mode: 'view'
    else
      mode: 'edit'

  onEditContent: () ->
    @setState
      mode: 'edit'

  onCancelEdit: () ->
    @setState
      mode: 'view'

  onSaveContent: (content) ->
    @setState
      mode: 'view'
    @props.onSaveContent(content)

  render: () ->
    hasContent = @props.html? and @props.html isnt ""
    classes = ['content-container']
    classes.push('mode-edit') if @state.mode is 'edit'
    classes.push('mode-view') if @state.mode is 'view' and hasContent
    classes.push('mode-prompt') if @state.mode is 'view' and not hasContent
    classes.push(@props.className)
    classes = classes.join(' ')
    editor = () =>
      <Editor
        ref="editor"
        title={@props.title or 'Edit this thingamajig'}
        html={@props.html}
        onCancelEdit={@onCancelEdit}
        onSaveContent={@onSaveContent}
        >
        {@props.children}
      </Editor>
    viewer = () =>
      <Viewer
        html={@props.html}
        prompt_add={@props.prompt_add}
        prompt_edit={@props.prompt_edit}
        onEditContent={@onEditContent}
        >
        {@props.children}
      </Viewer>

    item = if @state.mode is 'edit' then editor() else viewer()
    <div className={classes}>
      {item}
    </div>

module.exports = {ViewHtml:Viewer, ViewEditHtml}
