React = require 'react'

{EcosystemsStore} = require '../../flux/ecosystems'


EcosystemListing = React.createClass

  render: ->
    _.map EcosystemsStore.all(), @renderBook

module.exports = EcosystemListing
