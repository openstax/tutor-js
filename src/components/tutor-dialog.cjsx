BS = require 'react-bootstrap'
React = require 'react'
_ = require 'underscore'
{Promise} = require 'es6-promise'

TutorDialog = React.createClass

  displayName: 'TutorDialog'

  propTypes:
    title:     React.PropTypes.string.isRequired
    onProceed: React.PropTypes.func.isRequired
    onCancel:  React.PropTypes.func.isRequired
    body:      React.PropTypes.element.isRequired
    show:      React.PropTypes.bool
    buttons:   React.PropTypes.arrayOf( React.PropTypes.element )
    className: React.PropTypes.string

  getInitialState: ->
    show: true

  componentWillReceiveProps: (nextProps) ->
    @setState(show: nextProps.show) if nextProps.show?

  hide: ->
    @setState(show: false)

  render: ->
    return null unless @state.show
    buttons = @props.buttons or [
        <BS.Button key='cancel' onClick={_.compose(@props.onCancel,  @hide)}>Cancel</BS.Button>
        <BS.Button key='ok'     onClick={_.compose(@props.onProceed, @hide)} bsStyle='primary'>OK</BS.Button>
    ]
    classes = ['tutor-dialog']
    classes.push @props.className if @props.className

    <BS.Modal className={classes.join(' ')} onRequestHide={@hide} title={@props.title}>
      <div className='modal-body'>
        {@props.body}
      </div>
      <div className='modal-footer'>
        {buttons}
      </div>
    </BS.Modal>

module.exports = {

  show: (props) ->
    new Promise (onProceed, onCancel) =>

      props = _.extend(_.clone(props), {
        onProceed, onCancel, show: true
      })

      if @dialog
        @dialog.replaceProps(props)
      else
        div = document.body.appendChild( document.createElement('div') )
        @dialog = React.render(React.createElement(TutorDialog, props), div)

      @dialog

}
