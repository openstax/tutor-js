_     = require 'underscore'
React = require 'react'
{RouteHandler} = require 'react-router'

{EcosystemsStore, EcosystemsActions} = require '../../flux/ecosystems'

BindStore = require '../bind-store-mixin'
BookLink  = require './book-link'
Router = require '../../helpers/router'

QADashboard = React.createClass

  mixins: [BindStore]
  bindStore: EcosystemsStore
  bindEvent: 'loaded'

  componentWillMount: ->
    EcosystemsActions.load() unless EcosystemsStore.isLoading()

  render: ->
    if EcosystemsStore.isLoaded()
      params = Router.currentParams()
      params.ecosystemId ?= "#{EcosystemsStore.first().id}"
      <RouteHandler {...params} />
    else
      <h3>Loading ...</h3>

module.exports = QADashboard
