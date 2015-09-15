React = require 'react'
{RouteHandler} = require 'react-router'

{EcosystemsStore, EcosystemsActions} = require '../flux/ecosystems'
LoadableItem = require '../components/loadable-item'

BindStore = require '../components/bind-store-mixin'
BookLink  = require '../components/ecosystems/book-link'

Exercises = React.createClass

  mixins: [BindStore]
  bindStore: EcosystemsStore
  bindEvent: 'loaded'

  componentWillMount: ->
    EcosystemsActions.load() unless EcosystemsStore.isLoading()


  render: ->

    if EcosystemsStore.isLoaded()
      <ul>
        {for book in EcosystemsStore.all()
          <li key={book.id}><BookLink book={book} /></li>}
        <RouteHandler/>
      </ul>
    else
      <h3>Loading ...</h3>

module.exports = Exercises
