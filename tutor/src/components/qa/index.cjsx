_     = require 'underscore'
React = require 'react'
MatchForTutor = require '../match-for-tutor'
{Redirect} = require 'react-router-dom'
{EcosystemsStore, EcosystemsActions} = require '../../flux/ecosystems'

BindStore = require '../bind-store-mixin'
BookLink  = require './book-link'
Router = require '../../helpers/router'

QADashboard = React.createClass
  displayName: 'QADashboard'
  mixins: [BindStore]
  bindStore: EcosystemsStore
  bindEvent: 'loaded'
  contextTypes:
    router: React.PropTypes.object


  componentWillMount: ->
    unless EcosystemsStore.isLoaded() or EcosystemsStore.isLoading()
      EcosystemsActions.load()
      unless @props.params?.ecosystemId?
        EcosystemsStore.once('loaded', @redirectToFirst)

  redirectToFirst: ->
    ecosystemId = EcosystemsStore.first()?.id
    @context.router.history.push(
      Router.makePathname('QAViewBook', {ecosystemId})
    )

  render: ->
    return <h3 className="loading">Loading …</h3> if EcosystemsStore.isLoading()

    <div className="qa">
      <MatchForTutor {...@props} />
    </div>

module.exports = QADashboard
