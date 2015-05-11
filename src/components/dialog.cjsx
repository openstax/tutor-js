React = require 'react'
BS = require 'react-bootstrap'

###
<Dialog
  className='my-dialog-class'
  header='Dialog Title'
  confirmMsg='Are you sure you want to close?'
  isChanged={-> true}
  onCancel={-> alert 'Cancelling'}
  >
  body text
</Dialog>
###

module.exports = React.createClass
  displayName: 'Dialog'
  propTypes:
    header: React.PropTypes.node.isRequired
    onCancel: React.PropTypes.func.isRequired
    isChanged: React.PropTypes.func
    confirmMsg: React.PropTypes.string
    footer: React.PropTypes.node
    cancel: React.PropTypes.any
    primary: React.PropTypes.node
    onPrimary: React.PropTypes.func

  onCancel: ->
    {isChanged, confirmMsg, onCancel} = @props
    if isChanged?() and confirmMsg
      if confirm(confirmMsg)
        onCancel()
    else
      onCancel()

  render: ->
    {className, header, footer, primary, cancel, isChanged} = @props

    if cancel
      cancelBtn = <BS.Button aria-role='close' onClick={@onCancel}>{cancel}</BS.Button>

    closeBtn = <BS.Button 
      className='pull-right close-icon' 
      aria-role='close' 
      onClick={@onCancel}>
        <i className="fa fa-close"></i>
    </BS.Button>
    header = [header, closeBtn]
    footer = [primary, cancelBtn, footer] if footer or primary or cancelBtn

    classes = ['default-dialog']
    classes.push('-is-changed') if isChanged?()
    classes.push(className) if className
    className = classes.join(' ')

    <BS.Panel className={className} header={header} footer={footer}>
      {@props.children}
    </BS.Panel>
