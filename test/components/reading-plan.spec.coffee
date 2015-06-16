{expect} = require 'chai'

React = require 'react'

{TaskPlanActions, TaskPlanStore} = require '../../src/flux/task-plan'
{TocActions} = require '../../src/flux/toc'
{ReadingPlan} = require '../../src/components/task-plan/reading'

TEST_TOC = [
  {
    "id":"1",
    "title":"Updated Tutor HS Physics Content - legacy",
    "type":"part",
    children: [{
      id: '2'
      title: 'Chapter title'
      type: 'part'
      children: [
        {id: '1', type: 'page', title: 'Introduction'}
      ]
    }]
  }
]

tomorrow = Date.now() + 1000 * 3600 * 24
dayAfter = tomorrow + 1000 * 3600 * 24

VALID_MODEL =
  type: 'reading'
  id: '111'
  title: 'Test Title'
  opens_at: (new Date(tomorrow)).toString()
  due_at:  (new Date(dayAfter)).toString()
  settings:
    page_ids: ['1']


helper = (model, doChangeTitle) ->
  {id} = model
  # Load the plan into the store
  TaskPlanActions.loaded(model, id)
  if doChangeTitle
    TaskPlanActions.updateTitle(id, 'Some other title')
  html = React.renderToString(<ReadingPlan id={id} />)
  div = document.createElement('div')
  div.innerHTML = html
  div


describe 'Reading Plan', ->
  beforeEach ->
    TaskPlanActions.reset()
    TocActions.reset()
    TocActions.loaded(TEST_TOC)

  it 'should have the right buttons when valid but not changed', ->
    node = helper(VALID_MODEL, false)
    expect(node.querySelector('.-publish.disabled')).to.be.null
    expect(node.querySelector('.-delete')).to.not.be.null

  it 'should allow publish/save when the title is changed', ->
    node = helper(VALID_MODEL, true)
    expect(node.querySelector('.-publish.disabled')).to.be.null
    expect(node.querySelector('.-delete')).to.not.be.null


  it 'should not allow delete when the plan does not exist in the backend', ->
    id = TaskPlanStore.freshLocalId()
    model =
      type: 'reading'
      id: id

    TaskPlanActions.created(model, id)
    node = helper(model, true)
    expect(node.querySelector('.-delete')).to.be.null


  it 'should not show delete if plan is published', ->
    yesterday = Date.now() - 3600 * 1000 * 24
    model =
      type: 'reading'
      id: '1'
      published_at: (new Date(yesterday)).toString()

    TaskPlanActions.created(model, '1')
    node = helper(model, true)
    expect(node.querySelector('.-delete')).to.be.null

  it 'should not show delete if plan is new', ->
    id = TaskPlanStore.freshLocalId()
    model =
      type: 'reading'
      id: id

    TaskPlanActions.created(model, id)
    node = helper(model, true)
    expect(node.querySelector('.-delete')).to.be.null

  it 'should show delete if plan is not new and not published', ->
    model =
      type: 'reading'
      id: '1'

    TaskPlanActions.created(model, '1')
    node = helper(model, true)
    expect(node.querySelector('.-delete')).to.not.be.null



  # TODO: Add unit tests to verify API calls
