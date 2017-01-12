{Testing, expect, sinon, _} = require 'shared/specs/helpers'
cloneDeep = require 'lodash/cloneDeep'

User = require 'user/model'

AUTH_DATA = require '../../auth/status/GET'
TWO_COURSE_ECOSYSTEM_ID = 'd52e93f4-8653-4273-86da-3850001c0786'

describe 'User', ->

  beforeEach ->
    User.update(cloneDeep(AUTH_DATA))

  afterEach ->
    User._reset()

  it 'defaults to not logged in', ->
    User._reset()
    expect(User.isLoggedIn()).to.be.false
    undefined

  it 'resets courses when destroy is called and can no longer emit signals', ->
    fakeCourse =
      destroy: -> true
    sinon.stub(fakeCourse, 'destroy')
    User.courses = [fakeCourse]
    logoutSpy = sinon.spy()
    User.channel.on 'logout.received', logoutSpy
    User.destroy()
    expect(User.courses).to.be.empty
    expect(fakeCourse.destroy).to.have.been.called
    expect(logoutSpy).not.to.have.been.called

    User._signalLogoutCompleted()
    expect(logoutSpy).to.have.not.been.called
    undefined


  it 'returns most recent registration for course', ->
    expect(User.courses).to.have.length(3)
    matches = _.where(User.courses, ecosystem_book_uuid: TWO_COURSE_ECOSYSTEM_ID)
    expect(matches).to.have.length(2)

    matches[0].roles[0].latest_enrollment_at = "2016-01-06T19:59:44.072Z"
    matches[1].roles[0].latest_enrollment_at = "2017-01-06T19:59:44.072Z"
    expect(User.getCourse(TWO_COURSE_ECOSYSTEM_ID).id).to.equal(matches[1].id)

    matches[0].roles[0].latest_enrollment_at = "2017-01-06T20:00:00.100Z"
    matches[1].roles[0].latest_enrollment_at = "2017-01-06T20:00:00.000Z"
    expect(User.getCourse(TWO_COURSE_ECOSYSTEM_ID).id).to.equal(matches[0].id)

    # test that it doesn't blowup if role latest_enrollment_at is missing
    delete matches[0].roles[0].latest_enrollment_at
    matches[1].roles[0].latest_enrollment_at = "2017-01-06T20:00:00.000Z"
    expect(User.getCourse(TWO_COURSE_ECOSYSTEM_ID).id).to.equal(matches[1].id)

    undefined
