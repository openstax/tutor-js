React       = require 'react'
extend      = require 'lodash/extend'
TestBackend = require 'react-dnd-test-backend'
TestRouter  = require './test-router'
{DragDropManager} = require 'dnd-core'


EnzymeContext =

  withDnD: (options = {}) ->
    extend({
      context:
        dragDropManager: new DragDropManager(TestBackend)
        router: new TestRouter()
      childContextTypes:
        dragDropManager: React.PropTypes.object
        router: React.PropTypes.object
    }, options)

module.exports = EnzymeContext
