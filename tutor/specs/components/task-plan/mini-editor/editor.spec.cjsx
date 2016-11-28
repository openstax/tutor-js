{React, _} = require '../../helpers/component-testing'

MiniEditor = require '../../../../src/components/task-plan/mini-editor/editor'
{CourseActions} = require '../../../../src/flux/course'
{TaskPlanActions, TaskPlanStore} = require '../../../../src/flux/task-plan'

COURSE  = require '../../../../api/courses/1.json'
COURSE_ID = '1'

DATA   = require '../../../../api/courses/1/dashboard'

PLAN = _.extend({
  settings: { exercise_ids: [1, 2, 3] }
}, _.findWhere(DATA.plans, id: '7'))


getButtons = (wrapper) ->
  publish: wrapper.find('.-publish')
  save: wrapper.find('.-save')
  cancel: wrapper.find('.btn.cancel')

describe 'TaskPlan MiniEditor wrapper', ->

  beforeEach ->
    @sandbox = sinon.sandbox.create()
    @sandbox.stub(TaskPlanActions, 'save')
    @sandbox.stub(TaskPlanActions, 'publish')
    @sandbox.stub(TaskPlanStore, 'isValid', -> true)
    @sandbox.stub(TaskPlanStore, 'hasChanged', -> true)

    CourseActions.loaded(COURSE, COURSE_ID)

    TaskPlanActions.loaded(PLAN, PLAN.id)
    @props =
      id: PLAN.id
      courseId: COURSE_ID
      onHide: sinon.spy()


  afterEach ->
    @sandbox.restore()

  it 'can update title', ->
    sinon.stub(TaskPlanActions, 'updateTitle')
    wrapper = mount(<MiniEditor {...@props} />)
    title = wrapper.find("input[value=\"#{PLAN.title}\"]")
    expect(title).length.to.be(1)
    title.simulate('change', target: value: 'foo')
    expect(TaskPlanActions.updateTitle).to.have.been.calledWith(@props.id, 'foo')
    undefined

  it 'hides itself when cancel is clicked', ->
    wrapper = mount(<MiniEditor {...@props} />)
    wrapper.find('.cancel').simulate('click')
    expect(@props.onHide).to.have.been.called
    undefined

  it 'publishes and sets button state', ->
    wrapper = mount(<MiniEditor {...@props} />)
    {publish, save, cancel} = getButtons(wrapper)
    @sandbox.stub(TaskPlanStore, 'isSaving', -> true)
    expect(publish.text()).to.equal('Publish')
    publish.simulate('click')
    expect(TaskPlanActions.publish).to.have.been.called

    expect(publish.text()).to.equal('Publishing…')
    expect(save.text()).to.equal('Save as Draft')
    expect( publish.prop('disabled') ).to.equal(true)
    expect( save.prop('disabled') ).to.equal(true)
    expect( cancel.prop('disabled') ).to.equal(true)
    undefined

  it 'saves as draft and sets button state', ->
    wrapper = mount(<MiniEditor {...@props} />)
    {publish, save, cancel} = getButtons(wrapper)

    expect(save.text()).to.equal('Save as Draft')
    @sandbox.stub(TaskPlanStore, 'isSaving', -> true)
    save.simulate('click')

    expect(TaskPlanActions.save).to.have.been.called
    expect(save.text()).to.equal('Saving…')
    expect(publish.text()).to.equal('Publish')
    expect( publish.prop('disabled') ).to.equal(true)
    expect( save.prop('disabled') ).to.equal(true)
    expect( cancel.prop('disabled') ).to.equal(true)
    undefined

  it 'hides when cancel is clicked', ->
    wrapper = mount(<MiniEditor {...@props} />)
    {cancel} = getButtons(wrapper)
    cancel.simulate('click')
    expect(@props.onHide).to.have.been.called
    undefined
