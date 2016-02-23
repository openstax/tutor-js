React = require 'react'
{RouteHandler} = require 'react-router'

{EcosystemsStore, EcosystemsActions} = require '../../flux/ecosystems'
ChapterSectionChooser = require '../chapter-section-chooser'
BindStore = require '../bind-store-mixin'

QuestionsDashboard = React.createClass

  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <ChapterSectionChooser courseId={courseId} selected={[]} />


    # if EcosystemsStore.isLoaded()
    #   params = _.clone @context.router.getCurrentParams()
    #   params.ecosystemId ?= "#{EcosystemsStore.first().id}"
    #   <RouteHandler {...params} />
    # else
    #   <h3>Loading ...</h3>

module.exports = QuestionsDashboard
