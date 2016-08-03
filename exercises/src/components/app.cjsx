React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
classnames = require 'classnames'
Location = require 'stores/location'

ErrorModal = require './error-modal'
UserActionsMenu = require 'components/user-actions-menu'
{SuretyGuard} = require 'shared'
NetworkActivity = require './network-activity-spinner'
{VocabularyStore, VocabularyActions} = require 'stores/vocabulary'

App = React.createClass

  propTypes:
    location: React.PropTypes.object
    data:  React.PropTypes.object.isRequired

  getDefaultProps: ->
    location: new Location

  componentWillMount: ->
    @props.location.startListening(@onHistoryChange)
    {view, id} = @props.location.getCurrentUrlParts()
    if id is 'new'
      @setState(newId: @createNewRecord(view))
    else
      @loadRecord(view, id)

  loadRecord: (type, id) ->
    return unless type and id
    {actions, store} = @props.location.partsForView(type)

    unless store.isLoading(id) or store.get(id)
      store.once 'loaded', =>
        @props.location.onRecordLoad(type, id, store)
      actions.load(id)

  update: -> @forceUpdate()

  componentWillUnmount: ->
    @props.location.stopListening()

  onHistoryChange: (location) ->
    @setState(location: location)
    {view, id} = @props.location.getCurrentUrlParts()
    if id is 'new'
      @setState(newId: @createNewRecord(view))
    else
      @loadRecord(view, id)

  onNewRecord: (type, ev) ->
    ev.preventDefault()
    newId = @createNewRecord(type)
    @setState({newId})
    @props.location.visitNewRecord(type)

  createNewRecord: (type) ->
    {actions, store} = @props.location.partsForView(type)
    newId = store.freshLocalId()
    actions.createBlank(newId)
    if type is 'vocabulary'
      vocabId = VocabularyStore.freshLocalId()
      actions.setAsVocabularyPlaceHolder(newId, vocabId)
      VocabularyActions.createBlank(vocabId)

    return newId

  onReset: (ev) ->
    ev.preventDefault()
    @props.location.visitSearch()

  render: ->
    {view, id, args} = @props.location.getCurrentUrlParts()
    if id is 'new'
      id = @state.newId or @createNewRecord(view)

    {Body, Controls, store, actions} = @props.location.partsForView(view)

    Body = NetworkActivity if store?.isLoading(id)

    guardProps =
      onlyPromptIf: ->
        id and store?.isChanged(id)
      placement: 'right'
      message: "You will lose all unsaved changes"

    componentProps =
      id: id
      location: @props.location

    classes = classnames(view, 'openstax', 'editor-app', 'container-fluid')


    <div className={classes}>
      <ErrorModal />
      <nav className="navbar navbar-default">
        <div className="container-fluid controls-container">
          <div className="navbar-header">
            <BS.ButtonToolbar className="navbar-btn">
              {if view
                <SuretyGuard
                  onConfirm={@onReset}
                  {...guardProps}
                >
                  <a href="/exercises" className="btn btn-danger back">Back</a>
                </SuretyGuard>}

              <SuretyGuard
                onConfirm={_.partial @onNewRecord, 'exercises'}
                {...guardProps}
              >
                <a className="btn btn-success exercises blank">New Exercise</a>
              </SuretyGuard>

              <SuretyGuard
                onConfirm={_.partial @onNewRecord, 'vocabulary'}
                {...guardProps}
              >
                <a className="btn btn-success vocabulary blank">New Vocabulary Term</a>
              </SuretyGuard>

            </BS.ButtonToolbar>
          </div>

          <div className="navbar-header view-controls">
            <Controls {...componentProps} />
          </div>

          <UserActionsMenu user={@props.data.user} />


        </div>
      </nav>

      <Body {...componentProps} />
    </div>

module.exports = App
