{expect} = require 'chai'
_ = require 'underscore'
moment = require 'moment-timezone'

TimeHelper = require '../../src/helpers/time'

TEST_TIMEZONE = 'Pacific/Midway'
TODAY_IN_CURRENT_ZONE = moment().startOf('day').format()

describe 'Time Helpers', ->

  it 'can get current locale', ->

    currentLocale = TimeHelper.getCurrentLocales()

    # check on the essential properties for being able to use
    # currentLocale to fix calendar's locale changing
    expect(currentLocale).to.have.property('abbr').and.to.be.a('string')
    expect(currentLocale).to.have.property('week').and.to.be.an('object')
    expect(currentLocale).to.have.deep.property('week.dow').and.to.be.a('number')
    expect(currentLocale).to.have.deep.property('week.doy').and.to.be.a('number')
    expect(currentLocale).to.have.property('weekdaysMin').and.to.be.an('array')


  it 'will set the default timezone', ->

    TimeHelper.syncCourseTimezone(TEST_TIMEZONE)
    expect(moment.defaultZone).to.deep.equal(moment.tz.zone(TEST_TIMEZONE))
    expect(moment().startOf('day').format()).to.not.equal(TODAY_IN_CURRENT_ZONE)


  it 'will reset the default timezone to user time', ->

    TimeHelper.unsyncCourseTimezone()
    expect(moment.defaultZone).to.not.exist
    expect(moment().startOf('day').format()).to.equal(TODAY_IN_CURRENT_ZONE)


  it 'can check the default timezone', ->

    isCourseTimezone = TimeHelper.isCourseTimezone(TEST_TIMEZONE)
    expect(isCourseTimezone).to.be.false

    TimeHelper.syncCourseTimezone(TEST_TIMEZONE)
    isCourseTimezone = TimeHelper.isCourseTimezone(TEST_TIMEZONE)
    expect(isCourseTimezone).to.be.true
    TimeHelper.unsyncCourseTimezone()
