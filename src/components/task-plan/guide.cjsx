React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'

{CourseStore, CourseActions} = require '../../flux/course'
LoadableMixin = require '../loadable-mixin'

Guide = React.createClass
  mixins: [LoadableMixin]

  contextTypes:
    router: React.PropTypes.func

  getFlux: ->
    store: CourseStore
    actions: CourseActions

  getId: -> @context.router.getCurrentParams().id


  renderCrudeTable: (data) ->
    <div className="course-guide-table">
      <div className="course-guide-heading">
        guide table
      </div>
      <BS.Table className="reading-progress-group">
        <thead>test</thead>
      </BS.Table>
    </div>



  renderLoaded: ->

    id = @getId()



    if CourseStore.isGuideLoaded(id)

      plan = CourseActions.loadGuide(id)
      console.log(plan)
      
      table = _.map(plan.fields, @renderCrudeTable)

    <BS.Panel className="course-guide-container">
      here it is: {table}
    </BS.Panel>



module.exports = Guide
