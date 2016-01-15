{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

{TaskReview} = require 'task/review'
Collection = require 'task/collection'
TASK = require 'cc/tasks/C_UUID/m_uuid/GET'

describe 'Task Collection', ->

  beforeEach ->
    @taskId = 'm_uuid/C_UUID'
    @task = _.extend({}, TASK, taskId: @taskId, moduleUUID: 'm_uuid', collectionUUID: 'C_UUID' )
    Collection.load(@taskId, @task)


  it 'can get as a page', ->
    page = Collection.getAsPage(@taskId)
    expect( _.pluck(page.exercises, 'task_id') )
      .to.deep.equal(['265', '265', '265'])

  it 'can get the index of a step', ->
    expect(Collection.getStepIndex(@taskId, '4572')).to.equal(1)


  it 'can get the module info', ->
    info = Collection.getModuleInfo(@taskId, 'test')
    expect(info).to.deep.equal(
      collectionUUID:"C_UUID", moduleUUID:"m_uuid", link:'test/contents/C_UUID:m_uuid'
    )
