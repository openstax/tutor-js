BS = require 'react-bootstrap'
React = require 'react'
_ = require 'underscore'
{Promise} = require 'es6-promise'


DialogProperties =
  title:     React.PropTypes.string.isRequired
  onOk:      React.PropTypes.func.isRequired
  onCancel:  React.PropTypes.func.isRequired
  body:      React.PropTypes.element.isRequired
  show:      React.PropTypes.bool
  buttons:   React.PropTypes.arrayOf( React.PropTypes.element )
  className: React.PropTypes.string

# This is the "real" dialog component. It's rendered to a div under document.body
DetachedTutorDialog = React.createClass

  displayName: 'DetachedTutorDialog'

  propTypes: DialogProperties

  getInitialState: ->
    show: true

  componentWillReceiveProps: (nextProps) ->
    @setState(show: nextProps.show) if nextProps.show?

  _hide: ->
    @setState(show: false)

  hide: ->
    @_hide()
    @props.onCancel()

  render: ->
    return null unless @state.show
    buttons = @props.buttons or [
        <BS.Button key='cancel' className='cancel'
          onClick={_.compose(@props.onCancel,  @_hide)}>Cancel</BS.Button>
        <BS.Button key='ok'     className='ok'
          onClick={_.compose(@props.onOk, @_hide)} bsStyle='primary'>OK</BS.Button>
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

module.exports = TutorDialog = React.createClass
  displayName: 'TutorDialog'

  propTypes: _.omit(DialogProperties, 'body')

  componentDidMount: ->
    # While unlikely, the onOk and onCancel properties could have been updated while the dialog was visible
    # If they were we need to call their current functions
    TutorDialog.show(_.extend({}, @props, body: @props.children)).then(
      ( => @props.onOk?(arguments...) ) , ( @props.onCancel?(arguments...) )
    )

  componentWillUnmount: ->
    TutorDialog.hide(@props)

  componentWillReceiveProps: (newProps) ->
    TutorDialog.update(newProps)

  # The render method doesn't add anything to the DOM
  # instead it shows/hides DetachedTutorDialog
  render: -> return null

  statics:
    show: (props) ->
      new Promise (onOk, onCancel) =>
        props = _.extend(_.clone(props), {
          onOk, onCancel, show: true
        })
        if @dialog
          @dialog.replaceProps(props)
        else
          div = document.body.appendChild( document.createElement('div') )
          div.id
          @dialog = React.render(React.createElement(DetachedTutorDialog, props), div)

        @dialog

    hide: ->
      @dialog?.hide()

    update: (props) ->
      @dialog?.setProps(props)
