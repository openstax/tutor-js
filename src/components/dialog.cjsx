React = require 'react'
BS = require 'react-bootstrap'

module.exports = React.createClass
  displayName: 'Dialog'
  propTypes:
    header: React.PropTypes.node.isRequired
    cancelMsg: React.PropTypes.string.isRequired
    isChanged: React.PropTypes.func.isRequired
    footer: React.PropTypes.node
    primary: React.PropTypes.node
    cancel: React.PropTypes.node
    onCancel: React.PropTypes.func
    onPrimary: React.PropTypes.func

  onCancel: ->
    {isChanged, cancelMsg, onCancel} = @props
    if isChanged()
      if confirm(cancelMsg)
        onCancel()

  render: ->
    {className, header, footer, primary, cancel, onCancel, onPrimary} = @props

    primary = <BS.Button bsStyle='primary' onClick={onPrimary}>{primary}</BS.Button>
    cancel = <BS.Button aria-role='close' onClick={@onCancel}>{cancel}</BS.Button> if cancel
    close = <BS.Button className='pull-right' aria-role='close' onClick={@onCancel}>X</BS.Button>
    header = [header, close]
    footer = [primary, cancel, footer]

    <BS.Panel className={className} header={header} footer={footer}>
      {@props.children}
    </BS.Panel>
