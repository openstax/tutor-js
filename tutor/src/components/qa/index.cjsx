_     = require 'underscore'
React = require 'react'
MatchForTutor = require '../match-for-tutor'
{Redirect} = require 'react-router'
{EcosystemsStore, EcosystemsActions} = require '../../flux/ecosystems'

BindStore = require '../bind-store-mixin'
BookLink  = require './book-link'
Router = require '../../helpers/router'

QADashboard = React.createClass

  mixins: [BindStore]
  bindStore: EcosystemsStore
  bindEvent: 'loaded'
  contextTypes:
    router: React.PropTypes.object


  componentWillMount: ->
    unless EcosystemsStore.isLoading()
      EcosystemsActions.load()
      EcosystemsStore.once('loaded', @redirectToFirst)

  redirectToFirst: ->
    ecosystemId = EcosystemsStore.first()?.id
    @context.router.transitionTo(
      Router.makePathname('QAViewBook', {ecosystemId})
    )

  render: ->
    <div className="qa">
      <MatchForTutor {...@props} />
      {<h3>Loading …</h3> if EcosystemsStore.isLoading()}
    </div>

module.exports = QADashboard
