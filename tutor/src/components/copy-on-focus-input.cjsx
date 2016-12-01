React = require 'react'

omit = require 'lodash/omit'

Clipboard = require '../helpers/clipboard'

module.exports = React.createClass
  displayName: 'CopyOnFocusInput'
  propTypes:
    value: React.PropTypes.string.isRequired
    focusOnMount: React.PropTypes.bool

  focus: ->
    @refs.input.focus()

  copy: ->
    @refs.input.select()
    Clipboard.copy()

  componentDidMount: ->
    if @props.focusOnMount
      @focus()
      @copy()

  render: ->
    props = omit(@props, 'focusOnMount')

    <input ref='input'
      className='copy-on-focus'
      readOnly={true}
      onFocus={@copy}
      {...props}
    />
