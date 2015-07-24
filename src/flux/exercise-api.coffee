flux = require 'flux-react'
# TODO make this real when BE can send us this.
ExerciseAPIStore = flux.createStore
  exports:
    get: (itemCode) ->
      "https://exercises-dev.openstax.org/api/exercises?q=tag:#{itemCode}"

module.exports = {ExerciseAPIStore}