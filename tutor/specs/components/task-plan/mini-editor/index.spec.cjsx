{React, _} = require '../../helpers/component-testing'

MiniEditor = require '../../../../src/components/task-plan/mini-editor'
{TaskPlanActions} = require '../../../../src/flux/task-plan'

COURSE  = require '../../../../api/courses/1.json'
COURSE_ID = '1'

DATA   = require '../../../../api/courses/1/dashboard'
PLAN = _.findWhere(DATA.plans, id: '7')

describe 'TaskPlan MiniEditor wrapper', ->
  props = {}
  beforeEach ->
    props =
      courseId: '1'
      planId:   '42'
      findPopOverTarget: sinon.spy()
      onHide: sinon.spy()
      position: { x: 100, y: 100 }

  it 'renders with loadable', ->
    wrapper = shallow(<MiniEditor {...props} />)
    expect(wrapper.find('LoadableItem[id="42"]')).length.to.be(1)
    undefined
