React = require 'react'

MODES =
  VIEW: 'mode-view'
  EDIT: 'mode-edit'
  PREVIEW: 'mode-preview'

module.exports = React.createClass
  displayName: 'MultiMode'

  getInitialState: ->
    mode: @props.initialMode or MODES.VIEW

  render: ->
    classes = [@state.mode]
    classes.push(@props.className) if @props.className
    classes = classes.join(' ')

    childProps =
      className: classes
      model: @props.model
      parent: @props.parent # Questions use this to remove themselves from exercise
      onEditMode: @onEditMode
      onViewMode: @onViewMode
      onPreviewMode: @onPreviewMode
      children: @props.children

    switch @state.mode
      when MODES.VIEW     then @props.viewClass(childProps)
      when MODES.EDIT     then @props.editClass(childProps)
      when MODES.PREVIEW  then @props.previewClass(childProps)
      else throw new Error('BUG!')

  onEditMode: -> @setState {mode: MODES.EDIT}
  onViewMode: -> @setState {mode: MODES.VIEW}
  onPreviewMode: -> @setState {mode: MODES.PREVIEW}

  componentWillReceiveProps: (newProps) ->
    if newProps.initialMode isnt @props.initialMode
      @setState {mode: newProps.initialMode}
