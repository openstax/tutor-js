_ = require 'underscore'
{CCDashboardStore, CCDashboardActions} = require '../../../src/flux/cc-dashboard'

BaseModel = require '../../../../api/courses/1/cc/dashboard.json'

ExtendBaseStore = (props) -> _.extend({}, BaseModel, props)

DashboardRenderHelper = (model, component, moreProps = {}, routerParams, routerQuery) ->
  {id} = model
  # Load the plan into the store
  props = _.extend({id, courseId: "1"}, moreProps)
  Testing.renderComponent( component, props: props, routerParams: routerParams, routerQuery: routerQuery)


