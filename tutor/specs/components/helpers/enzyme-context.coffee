React       = require 'react'
merge       = require 'lodash/merge'
TestBackend = require('react-dnd-test-backend').default
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
        broadcasts: { location: (cb) -> cb(pathname: (options.pathname or '/')) }
      childContextTypes:
        broadcasts: React.PropTypes.object
        router: React.PropTypes.object
    }, options)

module.exports = EnzymeContext
