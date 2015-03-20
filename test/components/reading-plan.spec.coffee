{expect} = require 'chai'

React = require 'react'

{TaskPlanActions, TaskPlanStore} = require '../../src/flux/task-plan'
{TocActions} = require '../../src/flux/toc'
{ReadingPlan} = require '../../src/components/task-plan/reading'

TEST_TOC = [
  {
    id: 2
    title: 'Chapter title'
    type: 'part'
    children: [
      {id: 1, type: 'page', title: 'Introduction'}
    ]
  }
]

VALID_MODEL =
  type: 'reading'
  id: 111
  title: 'Test Title'
  opens_at: '2015-03-19'
  due_at: '2015-03-20'
  settings:
    page_ids: [1]


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

  it 'should not allow save/publish when empty', ->
    model =
      type: 'reading'
      id: 0

    node = helper(model, false)
    expect(node.querySelector('.-save.disabled')).to.not.be.null
    expect(node.querySelector('.-publish.disabled')).to.not.be.null
    expect(node.querySelector('.-delete')).to.not.be.null

  it 'should have the right buttons when valid but not changed', ->
    node = helper(VALID_MODEL, false)
    expect(node.querySelector('.-save.disabled')).to.not.be.null
    expect(node.querySelector('.-publish.disabled')).to.be.null
    expect(node.querySelector('.-delete')).to.not.be.null

  it 'should allow save when the title is changed', ->
    node = helper(VALID_MODEL, true)
    expect(node.querySelector('.-save.disabled')).to.be.null
    expect(node.querySelector('.-publish.disabled')).to.not.be.null
    expect(node.querySelector('.-delete')).to.not.be.null


  it 'should not allow delete when the plan does not exist in the backend', ->
    id = TaskPlanStore.freshLocalId()
    model =
      type: 'reading'
      id: id

    TaskPlanActions.created(model, id)
    node = helper(model, true)
    expect(node.querySelector('.-delete')).to.be.null

  # TODO: Add unit tests to verify API calls
