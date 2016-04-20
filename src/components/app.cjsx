React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
classnames = require 'classnames'
history = require 'history'
ErrorModal = require './error-modal'
UserActionsMenu = require 'components/user-actions-menu'
SuretyGuard = require './surety-guard'

{ExerciseActions, ExerciseStore} = require 'stores/exercise'
{VocabularyActions, VocabularyStore} = require 'stores/vocabulary'

VIEWS =
  exercise:
    body:     require './exercise'
    controls: require './exercise/controls'
    store:    ExerciseStore
    actions:  ExerciseActions

  search:
    body:     require './search'
    controls: require './search/controls'

  vocabulary:
    body:     require './vocabulary'
    controls: require './vocabulary/controls'
    store:    VocabularyStore
    actions:  VocabularyActions


App = React.createClass

  propTypes:
    history: React.PropTypes.object
    user:  React.PropTypes.object.isRequired

  getDefaultProps: ->
    history: history.createHistory()

  componentWillMount: ->
    @historyUnlisten = @props.history.listen(@onHistoryChange)

  componentWillUnmount: ->
    @historyUnlisten()

  onHistoryChange: (location) ->
    @setState(location: location)

  createRecord: (type, ev) ->
    ev.preventDefault()
    Component = VIEWS[type]
    newId = Component.store.freshLocalId()
    Component.actions.createBlank(newId)
    @setState({newId})
    @props.history.push("/#{type}/new")

  onReset: (ev) ->
    ev.preventDefault()
    @props.history.push('/')

  render: ->
    paths = _.tail @state.location.pathname.split('/')

    [view, id] = paths
    Component = VIEWS[view] or VIEWS['search']

    id = @state.newId if id is 'new'

    guardProps =
      onlyPromptIf: ->
        id and Component.store.isChanged(id)
      placement: 'right'
      message: "You will lose all unsaved changes"

    classes = classnames(view, 'openstax', 'editor-app', 'container-fluid')

    componentProps =
      id: id
      history: @props.history

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
                onConfirm={_.partial @createRecord, 'exercise'}
                {...guardProps}
              >
                <a className="btn btn-success blank">New Exercise</a>
              </SuretyGuard>

              <SuretyGuard
                onConfirm={_.partial @createRecord, 'vocabulary'}
                {...guardProps}
              >
                <a className="btn btn-success blank">New Vocabulary Term</a>
              </SuretyGuard>

            </BS.ButtonToolbar>
          </div>

          <div className="navbar-header view-controls">
            <Component.controls {...componentProps} />
          </div>

          <UserActionsMenu user={@props.user} />


        </div>
      </nav>

      <Component.body {...componentProps} />
    </div>

module.exports = App
