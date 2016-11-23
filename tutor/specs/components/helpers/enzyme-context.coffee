React       = require 'react'
merge       = require 'lodash/merge'
TestBackend = require 'react-dnd-test-backend'
TestRouter  = require './test-router'
{DragDropManager} = require 'dnd-core'


EnzymeContext =

  withDnD: (options = {}) ->
    context = @build(options)
    merge(context, {
      context:
        dragDropManager: new DragDropManager(TestBackend)
      childContextTypes:
        dragDropManager: React.PropTypes.object
    })

  build: (options = {}) ->
    merge({
      context:
        router: new TestRouter()
      childContextTypes:
        router: React.PropTypes.object
    }, options)

module.exports = EnzymeContext
