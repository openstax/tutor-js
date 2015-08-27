{expect} = require 'chai'
sinon = require 'sinon'
_ = require 'underscore'

JobHelper = require '../../src/helpers/job'

expectedActions = [
  'reset'
  'saveJob'
  'que'
  'queued'
  'startChecking'
  'stopChecking'
]

expectedStore = [
  'getAsyncStatus'
  'isProgressing'
  'isCompleted'
  'isDone'
  'isFailed'
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
  'unknown'
  'working'
  'queued'
  'completed'
  'failed'
  'killed'
]
jobListenerConfig = null

describe 'Job Helper', ->

  before ->
    jobListenerConfig = new JobHelper.JobListenerConfig()
    jobListenerConfig.emit = sinon.spy()
    jobListenerConfig.emitChange = sinon.spy()

    _.each(jobListenerConfig.exports, (store, index) ->
      jobListenerConfig.exports[index] = store.bind(_.omit(jobListenerConfig, 'exports'))
    )

  it 'should be able to make a new job listener config', ->

    _.each(expectedActions, (action) ->
      expect(jobListenerConfig)
        .to.have.property(action).that.is.a('function')
    )

    _.each(expectedStore, (storeAsker) ->
      expect(jobListenerConfig.exports)
        .to.have.property(storeAsker).that.is.a('function')
    )

  it 'should be able to save a job', ->
    jobListenerConfig.saveJob('first-job', JOB_FOR_ID)

    expect(jobListenerConfig._job[JOB_FOR_ID]).to.contain('first-job')
    expect(jobListenerConfig._getJobs(JOB_FOR_ID)).to.contain('first-job')

  it 'should be able to save another job', ->
    jobListenerConfig.saveJob('another-job', JOB_FOR_ID)

    expect(jobListenerConfig._job[JOB_FOR_ID]).to.contain('another-job')
    expect(jobListenerConfig._getJobs(JOB_FOR_ID)).to.contain('another-job')

  it 'should be able to get most recently saved job', ->
    expect(jobListenerConfig._getLatestJob(JOB_FOR_ID)).to.equal('another-job')

  it 'should be able to que a job for something', ->
    expect(jobListenerConfig._asyncStatus[JOB_FOR_ID]).to.not.equal(JOB_STATUSES[0])
    jobListenerConfig.que(JOB_FOR_ID)
    expect(jobListenerConfig._asyncStatus[JOB_FOR_ID]).to.equal(JOB_STATUSES[0])
    expect(jobListenerConfig.exports.getAsyncStatus(JOB_FOR_ID)).to.equal(JOB_STATUSES[0])
    expect(jobListenerConfig.emit).to.have.been.calledWith("progress.#{JOB_FOR_ID}.#{JOB_STATUSES[0]}")
    expect(jobListenerConfig.exports.isProgressing(JOB_FOR_ID)).to.be.true

  it 'should be able to receive track a queued job', ->
    jobListenerConfig.queued(JOB_QUEUED_RESPONSE, JOB_FOR_ID)
    expect(jobListenerConfig.emit).to.have.been.calledWith("progress.#{JOB_FOR_ID}.queued", JOB_QUEUED_RESPONSE)
    expect(jobListenerConfig._getLatestJob(JOB_FOR_ID)).to.equal(JOB_DATA_ID)
    expect(jobListenerConfig.exports.isProgressing(JOB_FOR_ID)).to.be.true

  it 'should be able update job status', ->
    jobWorking = _.clone(JOB_DATA)
    jobWorking.status = JOB_STATUSES[3]
    jobListenerConfig._updateJobStatusFor(JOB_FOR_ID)(jobWorking)
    jobWorking.for = JOB_FOR_ID

    expect(jobListenerConfig.exports.getAsyncStatus(JOB_FOR_ID)).to.equal(JOB_STATUSES[3])
    expect(jobListenerConfig.exports.isProgressing(JOB_FOR_ID)).to.be.true
    expect(jobListenerConfig.emit).to.have.been.calledWith("progress.#{JOB_FOR_ID}.#{JOB_STATUSES[3]}", jobWorking)

  # TODO add tests for start and stop checking
