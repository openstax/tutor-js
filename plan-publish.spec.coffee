{expect} = require 'chai'
sinon = require 'sinon'
_ = require 'underscore'

{PlanPublishActions, PlanPublishStore} = require '../../src/flux/plan-publish'

expectedActions = [
  'reset'
  'saveJob'
  'que'
  'queued'
  'startChecking'
  'stopChecking'
  '_getIds'
]

expectedStore = [
  'getAsyncStatus'
  'isProgressing'
  'isSucceeded'
  'isDone'
  'isFailed'
  'isPublishing'
  'isPublished'
]

JOB_CHECK_INTERVAL = 2000
JOB_CHECK_REPEATS = 3

JOB_DATA_ID = 'job-id-yay!'
JOB_FOR_ID = 'a-plan-publish-or-something-like-that'

JOB_DATA =
  id: JOB_DATA_ID

JOB_QUEUED_RESPONSE =
  id: JOB_FOR_ID
  jobId: JOB_DATA_ID

JOB_STATUSES = [
  'job_requesting'
  'job_queued'
  'unqueued'
  'working'
  'queued'
  'succeeded'
  'failed'
  'killed'
  'unknown'
]

describe 'Plan Publish flux', ->

  it 'should have expected functions and publish-specific aliases', ->

    _.each(expectedActions, (action) ->
      expect(PlanPublishActions)
        .to.have.property(action).that.is.a('function')
    )

    _.each(expectedStore, (storeAsker) ->
      expect(PlanPublishStore)
        .to.have.property(storeAsker).that.is.a('function')
    )
