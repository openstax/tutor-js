React = require 'react'
{RouteHandler} = require 'react-router'

{EcosystemsStore, EcosystemsActions} = require '../../flux/ecosystems'
LoadableItem = require '../loadable-item'

BindStore = require '../bind-store-mixin'
BookLink  = require './book-link'

QADashboard = React.createClass

  mixins: [BindStore]
  bindStore: EcosystemsStore
  bindEvent: 'loaded'

  componentWillMount: ->
    EcosystemsActions.load() unless EcosystemsStore.isLoading()

  contextTypes:
    router: React.PropTypes.func

  render: ->
    if EcosystemsStore.isLoaded()
      params = _.clone @context.router.getCurrentParams()
      params.ecosystemId ?= "#{EcosystemsStore.first().id}"
      params.bookId ?= "#{EcosystemsStore.getBook(params.ecosystemId).id}"
      <RouteHandler {...params} />
    else
      <h3>Loading ...</h3>

module.exports = QADashboard
