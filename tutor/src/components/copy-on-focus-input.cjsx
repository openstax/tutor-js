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
    @refs.input.select()
    Clipboard.copy()

  componentDidMount: ->
    @focus() if @props.focusOnMount

  render: ->
    props = omit(@props, 'focusOnMount')

    <input ref='input'
      className='copy-on-focus'
      readOnly={true}
      onFocus={@focus}
      {...props}
    />
