{Testing, sinon, _, React, ReactTestUtils} = require 'shared/specs/helpers'

{ConceptCoach}    = require 'concept-coach/base'
ErrorNotification = require 'concept-coach/error-notification'

TASK  = require '../../api/cc/tasks/C_UUID/m_uuid/GET'
tasks = require 'task/collection'
api   = require 'api'
cloneDeep = require 'lodash/cloneDeep'

Course = require 'course/model'
AUTH_DATA = require '../../auth/status/GET'

ERROR =
  response:
    status: 500
    statusText: 'Its On Fire!'
    data:
      errors: [ {code: 'test_test_test'} ]

describe 'CC Error Notification Component', ->
  beforeEach ->
    @props =
      course: new Course(_.first(AUTH_DATA.courses))
      close: sinon.spy()
      moduleUUID: 'm_uuid'
      collectionUUID: 'C_UUID'
    tasks.load("#{@props.collectionUUID}/#{@props.moduleUUID}",  TASK)

  it "doesn't render by default", ->
    wrapper = shallow(<ErrorNotification {...@props} />)
    expect(wrapper.html()).to.be.null
    undefined

  it 'shows error details by default', ->
    wrapper = shallow(<ErrorNotification {...@props} />)
    api.channel.emit('error', ERROR)
    expect(wrapper.find('ModalTitle').render().text()).to.equal('Server Error encountered')
    expect(wrapper.find('ModalBody').render().text()).to.include('test_test_test')
    undefined

  it 'renders course not started', ->
    wrapper = shallow(<ErrorNotification {...@props} />)
    error = cloneDeep(ERROR)
    error.response.data.errors[0].code = 'course_not_started'
    api.channel.emit('error', error)
    expect(wrapper.find('ModalTitle').render().text()).to.equal('Future Course')
    expect(wrapper.find('ModalBody').render().text()).to.include('not yet started')
    undefined

  it 'renders course has ended', ->
    wrapper = shallow(<ErrorNotification {...@props} />)
    error = cloneDeep(ERROR)
    error.response.data.errors[0].code = 'course_ended'
    api.channel.emit('error', error)
    expect(wrapper.find('ModalTitle').render().text()).to.equal('Past Course')
    expect(wrapper.find('ModalBody').render().text()).to.include('course ended')
    undefined
